import type React from 'react'
import { Suspense, lazy, startTransition, useEffect, useState } from 'react'
import type { ComponentType, ReactNode } from 'react'

export function ClientOnly<T>({
	load,
	children,
	fallback = null,
	deps = [],
}: {
	load: () => Promise<
		{ default: React.ComponentType<T> } | React.ComponentType<T>
	>
	children: (Component: React.ComponentType<T>) => ReactNode
	fallback?: ReactNode | null
	deps?: Parameters<typeof useEffect>[1]
}) {
	const [Component, setComponent] = useState<ComponentType<unknown> | null>(
		null,
	)

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const loadComponent = () => {
			const Component = lazy(() =>
				load()
					.then((LoadedComponent) => {
						return {
							default: () => {
								return children(
									'default' in LoadedComponent
										? LoadedComponent.default
										: LoadedComponent,
								)
							},
						}
					})
					.catch((error) => {
						console.error('Component loading failed:', error)
						return { default: () => <p>Error loading component.</p> }
					}),
			)
			setComponent(Component)
		}

		startTransition(() => {
			loadComponent()
		})
	}, deps)

	return Component ? (
		<Suspense fallback={fallback}>
			<Component />
		</Suspense>
	) : (
		fallback
	)
}
