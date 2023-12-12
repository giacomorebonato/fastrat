import type {
	OnBeforeRenderAsync,
	PageContextClient,
	PageContextServer,
} from 'vike/types'

export const onBeforeRender: OnBeforeRenderAsync = async (
	pageContext: PageContextServer | PageContextClient,
): ReturnType<OnBeforeRenderAsync> => {
	const noteId = pageContext.routeParams!.id

	return {
		pageContext: {
			pageProps: {
				noteId,
			},
		},
	}
}
