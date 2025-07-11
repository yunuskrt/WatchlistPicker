import React, { useState } from 'react'
import { MovieData } from '@/data/movies'
import WatchlistView from '@views/watchlist_view'
import UsernameView from '@views/username_view'

const Home = () => {
	return (
		<>
			<UsernameView />
			{/* <WatchlistView movies={MovieData} /> */}
		</>
	)
}

export default Home
