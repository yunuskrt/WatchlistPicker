'use client'
import React, { useContext } from 'react'

import { ThemeProvider } from '@mui/material'

import { ThemeContext } from '@context/ThemeContext'

const ComponentWrapper = ({ children }: React.PropsWithChildren<{}>) => {
	const themeContext = useContext(ThemeContext)
	if (!themeContext) {
		return null
	}
	const { theme } = themeContext
	return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
export default ComponentWrapper
