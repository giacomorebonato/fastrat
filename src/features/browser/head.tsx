import favicon from './favicon.ico'

export function Head() {
	return (
		<>
			<meta name='viewport' content='width=device-width, initial-scale=1.0' />
			<link rel='icon' type='image/x-icon' href={favicon} />
		</>
	)
}
