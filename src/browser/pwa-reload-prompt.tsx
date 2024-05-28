import './pwa-reload-prompt.css'

import { useRegisterSW } from 'virtual:pwa-register/react'

export function PwaReloadPrompt() {
	const {
		offlineReady: [offlineReady, setOfflineReady],
		needRefresh: [needRefresh, setNeedRefresh],
		updateServiceWorker,
	} = useRegisterSW({
		onRegistered(registration) {
			console.log(`SW Registered`, registration)
		},
		onRegisterError(error) {
			console.log('SW registration error', error)
		},
	})

	const close = () => {
		setOfflineReady(false)
		setNeedRefresh(false)
	}

	return (
		<div className='ReloadPrompt-container'>
			{(offlineReady || needRefresh) && (
				<div className='ReloadPrompt-toast'>
					<div className='ReloadPrompt-message'>
						{offlineReady ? (
							<span>App ready to work offline</span>
						) : (
							<span>
								New content available, click on reload button to update.
							</span>
						)}
					</div>
					{needRefresh && (
						<button
							type='button'
							className='ReloadPrompt-toast-button'
							onClick={() => {
								updateServiceWorker(true)
									.then(() => {
										console.log(`Service worker updated. The page will refresh`)
									})
									.catch((error) => {
										console.error(`Error updating service worker`)

										throw error
									})
							}}
						>
							Reload
						</button>
					)}
					<button
						type='button'
						className='ReloadPrompt-toast-button'
						onClick={() => close()}
					>
						Close
					</button>
				</div>
			)}
		</div>
	)
}

export default PwaReloadPrompt
