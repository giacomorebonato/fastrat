import { type Page, expect, test } from '@playwright/test'
import { HtmlValidate } from 'html-validate/node'

const htmlvalidate = new HtmlValidate({
	extends: ['html-validate:recommended'],
	rules: {
		'no-trailing-whitespace': 0,
		'attribute-empty-style': 0,
		'valid-id': 0,
		'wcag/h32': 0,
		'prefer-native-element': 0,
		'no-implicit-button-type': 0,
		'element-permitted-content': 0,
	},
})

test('creates a note and ensures note list is updated from websockets and that SSR is happening', async ({
	browser,
	page,
}) => {
	await page.reload()
	page.on('console', (msg) => {
		if (msg.type() === 'error') {
			throw Error(msg.text())
		}
	})
	await page.goto('http://localhost:3000/notes')
	// const wsPromise = getWebSocket(page)

	await expect(page).toHaveTitle(/FastRat/)
	await page.getByText('Logout').isVisible()
	await page.locator('textarea').isVisible()

	await page.getByTestId('btn-create-note').click()

	await page.waitForURL('http://localhost:3000/notes/*')

	const noteId = page.url().split('notes/').at(-1)

	await page.waitForSelector(`[data-testid=note-${noteId}]`)

	await page.locator('textarea').fill('Beautiful day')

	await page.waitForTimeout(2_000)

	await expect(page.locator(`[data-testid=note-${noteId}] span`)).toHaveText(
		'Beautiful day',
		{
			timeout: 1_000,
		},
	)

	// JS is disabled to ensure that HTML is not build client side
	const context = await browser.newContext({
		javaScriptEnabled: false,
	})

	const pageWithoutJS = await context.newPage()
	await pageWithoutJS.goto(`http://localhost:3000/notes/${noteId}`)

	const content = await pageWithoutJS.content()

	expect(content).toContain(
		'<textarea class="textarea textarea-bordered w-full">Beautiful day</textarea>',
	)
	expect(content).toContain(
		`<title data-rh="true">Fastrat - Beautiful day</title>`,
	)
})

test(`it renders valid HTML of the main page`, async ({ page }) => {
	await page.goto('http://localhost:3000')

	const html = await page.content()
	const report = await htmlvalidate.validateString(html)

	for (const result of report.results) {
		expect(result.messages).toHaveLength(0)
	}
})

test(`it renders valid HTML of the main page with clientOnly rendering`, async ({
	page,
}) => {
	page.on('console', (msg) => {
		if (msg.type() === 'error') {
			throw Error(msg.text())
		}
	})

	await page.goto('http://localhost:3000?clientOnly=true')
	await page.getByText(`Modern Web Development with Fastify + React`)
	await page.getByTestId(`btn-logout`).click()
})

test(`it renders valid HTML of the notes page`, async ({ page, browser }) => {
	await page.goto('http://localhost:3000/notes')
	await page.getByTestId('btn-create-note').click()
	await page.waitForURL('http://localhost:3000/notes/*')
	const noteId = page.url().split('notes/').at(-1)
	await page.goto(`http://localhost:3000/notes/${noteId}`)

	const context = await browser.newContext({
		javaScriptEnabled: false,
	})
	const pageWithoutJS = await context.newPage()
	await pageWithoutJS.goto(`http://localhost:3000/notes/${noteId}`)
	const html = await pageWithoutJS.content()
	const report = await htmlvalidate.validateString(html)

	for (const result of report.results) {
		expect(result.messages).toHaveLength(0)
	}
})

test(`it redirects from server side when passing not existing id in the URL`, async ({
	page,
}) => {
	const response = await page.goto('http://localhost:3000/notes/12345')

	expect(response?.url()).toEqual('http://localhost:3000/notes')
})

test(`collaborative editor is working with CRDT`, async ({
	page: page1,
	context,
}) => {
	const page2 = await context.newPage()
	await page1.goto(`http://localhost:3000/code-editor`)
	await page2.goto(`http://localhost:3000/code-editor`)

	await expect(page1.getByText(`CRDT connected`)).toBeVisible()
	await expect(page2.getByText(`CRDT connected`)).toBeVisible()

	const normalizeSpaces = (str?: string | null) => {
		if (!str) {
			return ''
		}
		return str.replace(/\u00A0/g, ' ').trim()
	}
	const writeIntoMonaco = async (page: Page, text: string): Promise<string> => {
		const monacoEditor = page.locator('.monaco-editor').nth(0)
		await monacoEditor.click()

		await page.keyboard.press('ControlOrMeta+KeyA')
		await page.keyboard.press('Backspace')
		await page1.waitForTimeout(1_000)

		await page1.keyboard.type(text)

		await page1.waitForTimeout(1_000)

		const value = await page.locator('.monaco-editor').nth(0).textContent()

		return normalizeSpaces(value)
	}

	const readFromMonaco = async (page: Page) => {
		const value = await page.locator('.monaco-editor').nth(0).textContent()

		return normalizeSpaces(value)
	}

	let editor1Value = await writeIntoMonaco(page1, '# Hello world!')
	let editor2Value = await readFromMonaco(page2)

	expect(editor1Value).toEqual(editor2Value)
	expect(editor1Value).toEqual(`1# Hello world!`)

	editor2Value = await writeIntoMonaco(page2, '# Good morning!')
	editor1Value = await readFromMonaco(page1)

	expect(editor1Value).toEqual(editor2Value)
	expect(editor1Value).toEqual(`1# Good morning!`)
})
