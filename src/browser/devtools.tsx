import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Devtools = () => {
	return (
		<section className='devtools'>
			<ReactQueryDevtools buttonPosition='bottom-right' />
			<TanStackRouterDevtools position='bottom-left' />
		</section>
	)
}

export default Devtools
