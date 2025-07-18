'use client'

import React, { useState, useRef } from 'react'
import { Movie, WatchlistData } from '@utils/types'
import WatchlistView from '@views/watchlist_view'
import { get, set } from 'idb-keyval'
import UsernameView from '@views/username_view'
import LoadingView from '@views/loading_view'
import { isStale } from '@utils/helpers'
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

interface TableProps {
	movies: Movie[]
	username: string
	lastUpdated: string
	loading: boolean
	status: boolean
}
interface ProgressProps {
	type?: string
	message: string
	value: number
}
interface AlertProps {
	show: boolean
	type: 'success' | 'error' | 'info' | 'warning'
	message: string
}

const Home = () => {
	const [tableData, setTableData] = useState<TableProps>({
		movies: [],
		username: '',
		lastUpdated: '',
		loading: false,
		status: false,
	})
	const [progress, setProgress] = useState<ProgressProps>({
		message: 'İşlem devam ediyor...',
		value: 0,
	})
	const [alert, setAlert] = useState<AlertProps>({
		show: false,
		type: 'info',
		message: '',
	})
	const eventSourceRef = useRef<EventSource | null>(null)

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
	const closeAlert = (
		event?: React.SyntheticEvent | Event,
		reason?: SnackbarCloseReason
	) => {
		if (reason === 'clickaway') {
			return
		}

		setAlert({ ...alert, show: false })
	}
	const searchUserWatchlist = async (username: string) => {
		setTableData({ ...tableData, loading: true })

		const STORE_KEY = 'watchlistData'
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
			showAlert(
				'warning',
				`${username} kullanıcısının watchlisti önbellekten yüklendi!`
			)
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
								`${username} kullanıcısının watchlisti başarıyla yüklendi!`
							)
							cache[username] = {
								movies,
								lastUpdated: now.toISOString(),
							}
							await set('watchlistData', cache)
							break
						case 'error':
							setProgress({ message: eventData.message, value: 100 })
							es.close()
							break
						case 'movie':
							setProgress({
								message: eventData.message,
								value: eventData.progress,
							})
							break
					}
				} catch (error: any) {
					console.log('Error parsing event data:', error.message)
				}
			}
			es.onerror = () => {
				es.close()
				showAlert('error', 'Kullanıcı bulunamadı veya bir hata oluştu.')
				setTableData({
					...tableData,
					loading: false,
					status: false,
				})
			}
		}
	}
	return (
		<div>
			<Snackbar open={alert.show} autoHideDuration={3000} onClose={closeAlert}>
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
				<LoadingView progress={progress.value} message={progress.message} />
			) : tableData.status ? (
				<WatchlistView
					movies={tableData.movies}
					username={tableData.username}
					lastUpdated={tableData.lastUpdated}
				/>
			) : (
				<UsernameView submitUsername={searchUserWatchlist} />
			)}
		</div>
	)
}

export default Home
