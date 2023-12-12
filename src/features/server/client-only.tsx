import React, { type ComponentType } from 'react'

export function ClientOnly<
	CT extends ComponentType<React.ComponentProps<CT>>,
>(props: {
	component: () => Promise<{ default: CT }>
	componentProps: React.ComponentProps<CT>
	fallback: React.FC
}) {
	const [Component, setComponent] = React.useState<any>(() => props.fallback)

	React.useEffect(() => {
		setComponent(() => React.lazy(props.component))
	}, [props.component])

	return (
		<React.Suspense fallback={props.fallback ? <props.fallback /> : null}>
			<Component {...props.componentProps} />
		</React.Suspense>
	)
}
