import React, { useState } from 'react'
import { Movie, WatchlistData } from '@utils/types'
import WatchlistView from '@views/watchlist_view'
import { get } from 'idb-keyval'
import UsernameView from '@views/username_view'
import LoadingView from '@views/loading_view'
import { isStale, fetchAndCache } from '@utils/helpers'

interface HomeProps {
	movies: Movie[]
	username: string
	lastUpdated: string
	loading: boolean
	status: boolean
}

const Home = () => {
	const [homeData, setHomeData] = useState<HomeProps>({
		movies: [],
		username: '',
		lastUpdated: '',
		loading: false,
		status: false,
	})

	const searchUserWatchlist = async (username: string) => {
		setHomeData({ ...homeData, loading: true })

		const STORE_KEY = 'watchlistData'
		const now = new Date()
		const cache: WatchlistData = (await get<WatchlistData>(STORE_KEY)) ?? {}

		const entry = cache[username]

		let movies: Movie[] = []
		if (entry && !isStale(entry.lastUpdated, now)) movies = entry.movies
		else movies = await fetchAndCache(username, cache, now)

		setHomeData({
			movies,
			username,
			lastUpdated: now.toISOString(),
			loading: false,
			status: movies.length > 0,
		})
	}
	return (
		<>
			{homeData.loading ? (
				<LoadingView />
			) : homeData.status ? (
				<WatchlistView
					movies={homeData.movies}
					username={homeData.username}
					lastUpdated={homeData.lastUpdated}
				/>
			) : (
				<UsernameView submitUsername={searchUserWatchlist} />
			)}
		</>
	)
}

export default Home
