'use client'
import React, { useState, useRef } from 'react'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar'

import LoadingView from '@views/loading_view'
import UsernameView from '@views/username_view'
import WatchlistView from '@views/watchlist_view'

import { STORE_KEY } from '@utils/constants'
import { isStale } from '@utils/helpers'
import { AlertProps, ProgressProps, TableProps } from '@utils/interfaces'
import { Movie, WatchlistData } from '@utils/types'
import { get, set } from 'idb-keyval'

const Home = () => {
	const [alert, setAlert] = useState<AlertProps>({
		show: false,
		type: 'info',
		message: '',
	})
	const [progress, setProgress] = useState<ProgressProps>({
		message: 'Processing...',
		value: 0,
		image: null,
	})
	const [tableData, setTableData] = useState<TableProps>({
		movies: [],
		username: '',
		lastUpdated: '',
		loading: false,
		status: false,
	})
	const eventSourceRef = useRef<EventSource | null>(null)

	const closeAlert = (
		event?: React.SyntheticEvent | Event,
		reason?: SnackbarCloseReason
	) => {
		if (reason === 'clickaway') {
			return
		}

		setAlert({ ...alert, show: false })
	}
	const showAlert = (
		type: 'success' | 'error' | 'info' | 'warning',
		message: string
	) => {
		setAlert({
			show: true,
			type,
			message,
		})
	}
	const searchUserWatchlist = async (username: string) => {
		setTableData({ ...tableData, loading: true })

		const now = new Date()
		const cache: WatchlistData = (await get<WatchlistData>(STORE_KEY)) ?? {}

		const entry = cache[username]

		let movies: Movie[] = []
		if (entry && !isStale(entry.lastUpdated, now)) {
			movies = entry.movies
			setTableData({
				movies,
				username,
				lastUpdated: entry.lastUpdated,
				loading: false,
				status: movies.length > 0,
			})
			showAlert('warning', `${username}'s watchlist loaded from cache!`)
		} else {
			const es = new EventSource(`api/v1/progress/${username}`)
			eventSourceRef.current = es
			es.onmessage = async (event) => {
				try {
					const eventData = JSON.parse(event.data)
					switch (eventData.type) {
						case 'done':
							movies = eventData.movies
							setProgress({
								message: eventData.message,
								value: eventData.progress,
								image: eventData.image || null,
							})
							setTableData({
								movies,
								username,
								lastUpdated: now.toISOString(),
								loading: false,
								status: movies.length > 0,
							})
							es.close()
							showAlert(
								'success',
								`${username}'s watchlist loaded successfully!`
							)
							cache[username] = {
								movies,
								lastUpdated: now.toISOString(),
							}
							await set('watchlistData', cache)
							break
						case 'error':
							setProgress({
								message: eventData.message,
								value: 100,
								image: null,
							})
							es.close()
							break
						case 'movie':
							setProgress({
								message: eventData.message,
								value: eventData.progress,
								image: eventData.image || null,
							})
							break
					}
				} catch (error: any) {
					console.log('Error parsing event data:', error.message)
				}
			}
			es.onerror = () => {
				es.close()
				showAlert('error', 'User not found or an error occurred.')
				setTableData({
					...tableData,
					loading: false,
					status: false,
				})
			}
		}
	}
	return (
		<Box>
			<Snackbar
				open={alert.show}
				autoHideDuration={3000}
				onClose={closeAlert}
				anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
			>
				<Alert
					onClose={closeAlert}
					severity={alert.type}
					variant='filled'
					sx={{ width: '100%' }}
				>
					{alert.message}
				</Alert>
			</Snackbar>
			{tableData.loading ? (
				<LoadingView
					progress={progress.value}
					message={progress.message}
					image={progress.image}
				/>
			) : tableData.status ? (
				<WatchlistView
					movies={tableData.movies}
					username={tableData.username}
					lastUpdated={tableData.lastUpdated}
				/>
			) : (
				<UsernameView submitUsername={searchUserWatchlist} />
			)}
		</Box>
	)
}
export default Home
