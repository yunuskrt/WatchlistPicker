import { Movie } from '@utils/types'

export interface AlertProps {
	show: boolean
	type: 'success' | 'error' | 'info' | 'warning'
	message: string
}
export interface ColumnProps {
	id: keyof Movie | 'image'
	label: string
	minWidth?: number
	maxWidth?: number
	align?: 'right'
	sortable?: boolean
}
export interface MovieModalProps {
	open: boolean
	movie: Movie | null
}
export interface ProgressProps {
	type?: string
	message: string
	value: number
	image: string | null
}
export interface TableProps {
	movies: Movie[]
	username: string
	lastUpdated: string
	loading: boolean
	status: boolean
}
