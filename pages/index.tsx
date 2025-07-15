import React, { useState } from 'react'
import { Movie, WatchlistData } from '@utils/types'
import WatchlistView from '@views/watchlist_view'
import { get } from 'idb-keyval'
import UsernameView from '@views/username_view'
import { isStale, fetchAndCache } from '@utils/helpers'

const Home = () => {
	const [movieData, setMovieData] = useState<Movie[]>([])
	const [loading, setLoading] = useState(false)
	const [status, setStatus] = useState(false)

	const searchUserWatchlist = async (username: string) => {
		setLoading(true)

		const STORE_KEY = 'watchlistData'
		const now = new Date()
		const cache: WatchlistData = (await get<WatchlistData>(STORE_KEY)) ?? {}

		const entry = cache[username]

		if (entry && !isStale(entry.lastUpdated, now)) {
			setMovieData(entry.movies)
		} else {
			const movies: Movie[] = await fetchAndCache(username, cache, now)
			setMovieData(movies)
		}
		setStatus(true)
		setLoading(false)
	}
	return (
		<>
			{loading ? (
				<div>Loading...</div>
			) : status ? (
				<WatchlistView movies={movieData} />
			) : (
				<UsernameView submitUsername={searchUserWatchlist} />
			)}
		</>
	)
}

export default Home
