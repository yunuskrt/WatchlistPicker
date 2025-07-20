'use client'
import React from 'react'

import ComponentWrapper from '@context/ComponentWrapper'

import ThemeContextProvider from './ThemeContext'

const ContextProviders = ({ children }: { children: React.ReactNode }) => {
	return (
		<ThemeContextProvider>
			<ComponentWrapper>{children}</ComponentWrapper>
		</ThemeContextProvider>
	)
}
export default ContextProviders
