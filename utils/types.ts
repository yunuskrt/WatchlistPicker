export type ErrorResponse = {
	error: string
}
export type Filter = {
	year?: number[]
	runtime?: number[]
	platform?: string
	genre?: string
	rating?: number
	popularity?: number
}
export type Movie = {
	id: number
	name: string
	year: number
	minutes: number
	originalName: string
	platforms: string[]
	rating: number
	popularity: number
	vote_count: number
	genres: string[]
	image: string
}
export type MovieTableLoading = {
	rows?: number
	progress: number
	message?: string
	image: string | null
}
export type Platform = {
	id: string
	name: string
	logo: string
}
export type PlatformSelectOption = {
	value: string
	label: string
}
export type WatchlistData = Record<
	string,
	{ movies: Movie[]; lastUpdated: string }
>
