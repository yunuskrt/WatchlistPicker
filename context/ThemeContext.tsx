'use client'
import React, { createContext, useState, useEffect, ReactNode } from 'react'

import { createTheme, useMediaQuery } from '@mui/material'

export const ThemeContext = createContext<
	| {
			mode: boolean
			setMode: React.Dispatch<React.SetStateAction<boolean>>
			theme: ReturnType<typeof createTheme>
	  }
	| undefined
>(undefined)

const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
	const prefersMode = useMediaQuery('(prefers-color-scheme: dark)')
	const [mode, setMode] = useState(prefersMode)

	useEffect(() => {
		setMode(prefersMode)
	}, [prefersMode])

	const theme = createTheme({
		palette: {
			mode: mode ? 'dark' : 'light',
		},
	})

	return (
		<ThemeContext.Provider value={{ mode, setMode, theme }}>
			{children}
		</ThemeContext.Provider>
	)
}
export default ThemeContextProvider
