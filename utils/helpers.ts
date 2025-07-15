import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { Movie } from '@utils/types'
import { set } from 'idb-keyval'
import { WatchlistData } from '@utils/types'
import axios from 'axios'

export const formatDuration = (minutes: number): string => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60

    if (h > 0 && m > 0) return `${h}h ${m}min`
    if (h > 0) return `${h}h`
    return `${m}min`
}

export const downloadExcel = (movieData: Movie[]) => {
	const flatData = movieData.map((movie) => ({
		ID: movie.id,
		Name: movie.name,
		'Original Name': movie.originalName,
		Year: movie.year,
		Minutes: movie.minutes,
		Rating: movie.rating,
		Popularity: movie.popularity,
		'Vote Count': movie.vote_count,
		Genres: movie.genres.join(', '),
		Platforms: movie.platforms.join(', '),
		ImageURL: movie.image,
	}))
	const worksheet = XLSX.utils.json_to_sheet(flatData)
	const workbook = XLSX.utils.book_new()
	XLSX.utils.book_append_sheet(workbook, worksheet, 'Movies')

	const excelBuffer = XLSX.write(workbook, {
		bookType: 'xlsx',
		type: 'array',
	})

	const blob = new Blob([excelBuffer], {
		type: 'application/octet-stream',
	})

	saveAs(blob, 'movies.xlsx')
}

export const sortRows = (
	rows: Movie[],
	orderBy: keyof Movie,
	order: 'asc' | 'desc'
) => {
	if (!orderBy) return rows
	return [...rows].sort((a, b) => {
		const aValue = Array.isArray(a[orderBy])
			? a[orderBy].join(', ')
			: a[orderBy]
		const bValue = Array.isArray(b[orderBy])
			? b[orderBy].join(', ')
			: b[orderBy]

		if (typeof aValue === 'number' && typeof bValue === 'number') {
			return order === 'asc' ? aValue - bValue : bValue - aValue
		} else {
			return order === 'asc'
				? String(aValue).localeCompare(String(bValue))
				: String(bValue).localeCompare(String(aValue))
		}
	})
}

export const pickRandom = (movies: Movie[]): Movie | null => {
	if (movies.length === 0) return null
	const randomIndex = Math.floor(Math.random() * movies.length)
	return movies[randomIndex]
}

export const isStale = (lastUpdatedISO: string, now: Date): boolean => {
	// const STALE_MS = 2 * 60 * 1000;
  	// const diffMs = now.getTime() - new Date(lastUpdatedISO).getTime();
  	// return diffMs >= STALE_MS;
	const STALE_DAYS = 7
	const diffDays =
		(now.getTime() - new Date(lastUpdatedISO).getTime()) /
		(1000 * 60 * 60 * 24)
	return diffDays >= STALE_DAYS
}

export const fetchAndCache = async(
	username: string,
  	cache: WatchlistData,
  	now: Date
): Promise<Movie[]> => {
	const result = await axios.get(`api/v1/movies/${username}`)
	const movies: Movie[] = result.data

	cache[username] = {
		movies,
		lastUpdated: now.toISOString(),
	}
  	await set('watchlistData', cache)

  	return movies
}