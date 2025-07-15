import React, { useState } from 'react'
import { Movie, WatchlistData } from '@utils/types'
import WatchlistView from '@views/watchlist_view'
import { get } from 'idb-keyval'
import UsernameView from '@views/username_view'
import LoadingView from '@views/loading_view'
import { isStale, fetchAndCache } from '@utils/helpers'

interface HomeProps {
	movies: Movie[]
	loading: boolean
	status: boolean
}

const Home = () => {
	// const [movieData, setMovieData] = useState<Movie[]>([])
	// const [loading, setLoading] = useState(false)
	// const [status, setStatus] = useState(false)

	const [homeData, setHomeData] = useState<HomeProps>({
		movies: [],
		loading: false,
		status: false,
	})

	const searchUserWatchlist = async (username: string) => {
		// setLoading(true)
		setHomeData({ ...homeData, loading: true })

		const STORE_KEY = 'watchlistData'
		const now = new Date()
		const cache: WatchlistData = (await get<WatchlistData>(STORE_KEY)) ?? {}

		const entry = cache[username]

		if (entry && !isStale(entry.lastUpdated, now)) {
			// setMovieData(entry.movies)
			setHomeData({ ...homeData, movies: entry.movies })
		} else {
			const movies: Movie[] = await fetchAndCache(username, cache, now)
			// setMovieData(movies)
			setHomeData({ ...homeData, movies })
		}
		setHomeData({ ...homeData, loading: false, status: true })
		// setStatus(true)
		// setLoading(false)
	}
	return (
		<>
			{homeData.loading ? (
				<LoadingView />
			) : homeData.status ? (
				// <WatchlistView movies={homeData.movies} />
				<LoadingView />
			) : (
				<UsernameView submitUsername={searchUserWatchlist} />
			)}
		</>
	)
}

export default Home
