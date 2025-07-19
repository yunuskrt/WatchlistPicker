'use client'

import React from 'react'
import ThemeContextProvider from './ThemeContext'
import ComponentWrapper from '@context/ComponentWrapper'

export default function ContextProviders({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<ThemeContextProvider>
			<ComponentWrapper>{children}</ComponentWrapper>
		</ThemeContextProvider>
	)
}
