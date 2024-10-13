import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '#/browser/layout'
import { SideMenu } from '#/browser/side-menu'
import { ClientOnly } from '#/server/client-only'

export const Route = createFileRoute('/code-editor')({
	component: () => {
		return (
			<Layout sidebar={<SideMenu withBookmarks={false} />}>
				<ClientOnly load={() => import('#/collab/code-editor')}>
					{(Editor) => <Editor />}
				</ClientOnly>
			</Layout>
		)
	},
})
