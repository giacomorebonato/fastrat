/* eslint-disable @typescript-eslint/consistent-type-definitions */
export type {
	PageContextServer,
	/*
  // When using Client Routing https://vike.dev/clientRouting
  PageContextClient,
  PageContext,
  / */
	// When using Server Routing
	PageContextClientWithServerRouting as PageContextClient,
	PageContextWithServerRouting as PageContext,
	//* /
} from 'vike/types'

// https://vike.dev/pageContext#typescript
declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Vike {
		interface PageContext {
			Page: Page
			exports: {
				documentProps?: {
					description?: string
					title?: string
				}
			}
			pageProps?: PageProps
			urlPathname: string
		}
	}
}

type Page = (pageProps: PageProps) => React.ReactElement
export type PageProps = Record<string, unknown>
