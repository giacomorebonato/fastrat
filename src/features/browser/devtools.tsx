import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Devtools = () => {
	return (
		<section className='devtools'>
			<ReactQueryDevtools buttonPosition='bottom-left' />
			<TanStackRouterDevtools
				position='bottom-left'
				toggleButtonProps={{
					style: {
						zIndex: 2,
						left: 60,
					},
				}}
			/>
		</section>
	)
}
