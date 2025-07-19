'use client'

import { ThemeProvider } from '@mui/material'
import React, { useContext } from 'react'
import { ThemeContext } from '@context/ThemeContext'

export default function ComponentWrapper({
	children,
}: React.PropsWithChildren<{}>) {
	const themeContext = useContext(ThemeContext)
	if (!themeContext) {
		return null
	}
	const { theme } = themeContext
	return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
