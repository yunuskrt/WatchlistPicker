import React from 'react'
import WatchlistTable from '@components/watchlist_table'
import { MovieData } from '@/data/movies'

const Home = () => {
	return <WatchlistTable rows={MovieData} />
}

export default Home
