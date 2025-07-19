import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import MovieCard from '@/components/movie_card'
import SearchAppBar from '@/components/search_appbar'
import WatchlistTable from '@components/watchlist_table'
import WatchlistToolbar from '@components/watchlist_toolbar'
import { Filter, Movie } from '@utils/types'
import { pickRandom } from '@utils/helpers'
import HistoryIcon from '@mui/icons-material/History'
import PersonIcon from '@mui/icons-material/Person'

interface MovieModal {
	open: boolean
	movie: Movie | null
}
type Props = { movies: Movie[]; username: string; lastUpdated: string }
const WatchlistView = ({ movies, username, lastUpdated }: Props) => {
	const [tableData, setTableData] = useState<Movie[]>(movies)
	const [movieModal, setMovieModal] = useState<MovieModal>({
		open: false,
		movie: null,
	})
	const removeFilters = () => {
		setTableData(movies)
	}
	const searchMovies = (query: string) => {
		if (query.trim() === '') {
			setTableData(movies)
			return
		}
		setTableData(
			movies.filter(
				(movie) =>
					movie.name.toLowerCase().includes(query.toLowerCase()) ||
					movie.originalName.toLowerCase().includes(query.toLowerCase())
			)
		)
	}
	const submitFilters = (filters: Filter) => {
		setTableData(
			movies.filter((movie) => {
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
	const openMovieModal = (movie: Movie) => {
		setMovieModal({ open: true, movie })
	}
	const closeMovieModal = () => {
		setMovieModal({ open: false, movie: null })
	}
	const pickRandomMovie = () => {
		const randomMovie = pickRandom(tableData)
		if (randomMovie) {
			openMovieModal(randomMovie)
		} else {
			alert('No movies available to pick from.')
		}
	}
	return (
		<Box sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}>
			<SearchAppBar
				submitFilters={submitFilters}
				removeFilters={removeFilters}
				searchMovies={searchMovies}
			/>
			<WatchlistToolbar
				movieData={tableData}
				pickRandomMovie={pickRandomMovie}
			/>
			<Box>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
					<PersonIcon />
					<Typography variant='body2' color='text.secondary'>
						<strong>{username}</strong> watchlist'i
					</Typography>
				</Box>

				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
					<HistoryIcon />
					<Typography variant='body2' color='text.secondary'>
						Son Güncelleme Tarihi:{' '}
						<strong>
							{new Date(lastUpdated).toLocaleString('tr-TR', {
								day: '2-digit',
								month: 'long',
								year: 'numeric',
								hour: '2-digit',
								minute: '2-digit',
								hour12: false,
								timeZone: 'Europe/Istanbul',
							})}
						</strong>
					</Typography>
				</Box>
			</Box>
			<WatchlistTable rows={tableData} openMovieModal={openMovieModal} />
			<Modal
				open={movieModal.open}
				onClose={closeMovieModal} // This is the key prop for closing the modal
				aria-labelledby='movie-details-modal-title'
				aria-describedby='movie-details-modal-description'
			>
				<Box
					sx={{
						position: 'absolute' as 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: '90%',
						maxWidth: 700,
						bgcolor: 'transparent',
						border: 'none',
						outline: 'none',
						boxShadow: 24,
					}}
				>
					<MovieCard movie={movieModal.movie} />
				</Box>
			</Modal>
		</Box>
	)
}

export default WatchlistView
