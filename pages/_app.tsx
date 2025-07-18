import '@styles/globals.css'
import type { AppProps } from 'next/app'
import ContextProviders from '@/context'
import { CssBaseline } from '@mui/material'

export default function App({ Component, pageProps }: AppProps) {
	return (
		<ContextProviders>
			<CssBaseline />
			<Component {...pageProps} />{' '}
		</ContextProviders>
	)
}
