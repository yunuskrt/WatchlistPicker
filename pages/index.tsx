import React, { useState } from 'react'
import { MovieData } from '@/data/movies'
import SearchAppBar from '@components/appbar'
import WatchlistTable from '@components/watchlist_table'
import { Filter, Movie } from '@utils/types'
import WatchlistToolbar from '@components/watchlist_toolbar'
import Box from '@mui/material/Box'

const Home = () => {
	const [tableData, setTableData] = useState<Movie[]>(MovieData)
	const submitFilters = (filters: Filter) => {
		setTableData(
			MovieData.filter((movie) => {
				let matches = true
				if (filters.year) {
					matches =
						matches &&
						movie.year >= filters.year[0] &&
						movie.year <= filters.year[1]
				}
				if (filters.runtime) {
					matches =
						matches &&
						movie.minutes >= filters.runtime[0] &&
						movie.minutes <= filters.runtime[1]
				}
				if (filters.platform) {
					matches =
						matches &&
						(filters.platform == 'All Platforms'
							? movie.platforms.length > 0
							: movie.platforms.includes(filters.platform))
				}
				if (filters.genre) {
					matches = matches && movie.genres.includes(filters.genre)
				}
				if (filters.rating) {
					matches = matches && movie.rating >= filters.rating
				}
				if (filters.popularity) {
					matches = matches && movie.popularity >= filters.popularity
				}
				return matches
			})
		)
	}
	const removeFilters = () => {
		setTableData(MovieData)
	}
	const searchMovies = (query: string) => {
		if (query.trim() === '') {
			setTableData(MovieData)
			return
		}
		setTableData(
			MovieData.filter(
				(movie) =>
					movie.name.toLowerCase().includes(query.toLowerCase()) ||
					movie.originalName.toLowerCase().includes(query.toLowerCase())
			)
		)
	}
	return (
		<>
			<Box sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}>
				<SearchAppBar
					submitFilters={submitFilters}
					removeFilters={removeFilters}
					searchMovies={searchMovies}
				/>
				<WatchlistToolbar movieData={tableData} />
				<WatchlistTable rows={tableData} />
			</Box>
		</>
	)
}

export default Home
