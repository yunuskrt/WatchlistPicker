import React from 'react'
import MovieCard from '@components/movie_card'
import { Movie } from '@utils/types'

const movie: Movie = {
	id: 8967,
	name: 'Hayat Ağacı',
	year: 2011,
	minutes: 189,
	originalName: 'The Tree of Life',
	platforms: ['Amazon Prime Video', 'Netflix'],
	rating: 2.7,
	popularity: 3.8159,
	vote_count: 3167,
	genres: ['Dram', 'Fantastik'],
	image: 'https://image.tmdb.org/t/p/w500/l8cwuB5WJSoj4uMAsnzuHBOMaSJ.jpg',
}
const Hello = () => {
	return <MovieCard movie={movie} />
}

export default Hello
