import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { Movie } from '@utils/types'

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