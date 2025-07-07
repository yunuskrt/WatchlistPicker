import React, { useState } from 'react'

import Avatar from '@mui/material/Avatar'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'

import StarIcon from '@mui/icons-material/Star'
import WhatshotIcon from '@mui/icons-material/Whatshot'

import PlatformIcon from '@components/platform_icon'
import { PLATFORMS } from '@utils/constants'
import { formatDuration, sortRows } from '@utils/helpers'
import { Movie } from '@utils/types'

type Props = {
	rows: Movie[]
	openMovieModal: (movie: Movie) => void
}
import styles from '@styles/WatchlistTable.module.css'

interface Column {
	id: keyof Movie | 'image'
	label: string
	minWidth?: number
	maxWidth?: number
	align?: 'right'
	sortable?: boolean
}
const columns: readonly Column[] = [
	{ id: 'image', label: '' },
	{ id: 'name', label: 'Title', minWidth: 200 },
	{
		id: 'year',
		label: 'Year',
		align: 'right',
		sortable: true,
	},
	{
		id: 'minutes',
		label: 'Runtime',
		minWidth: 100,
		align: 'right',
		sortable: true,
	},
	{
		id: 'platforms',
		label: 'Platforms',
		minWidth: 200,
		sortable: true,
	},
	{
		id: 'rating',
		label: 'Rating',
		minWidth: 170,
		sortable: true,
	},
	{
		id: 'popularity',
		label: 'Popularity',
		align: 'right',
		minWidth: 100,
		sortable: true,
	},
	{
		id: 'genres',
		label: 'Genres',
		minWidth: 200,
		align: 'right',
	},
]

const WatchlistTable = ({ rows, openMovieModal }: Props) => {
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(-1)
	const [orderBy, setOrderBy] = useState<keyof Movie | ''>('')
	const [order, setOrder] = useState<'asc' | 'desc'>('asc')

	const changePage = (event: unknown, newPage: number) => {
		setPage(newPage)
	}
	const changeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(+event.target.value)
		setPage(0)
	}
	const sortCol = (columnId: keyof Movie) => {
		if (orderBy === columnId) {
			setOrder(order === 'asc' ? 'desc' : 'asc')
		} else {
			setOrderBy(columnId)
			setOrder('asc')
		}
	}

	return (
		<Paper sx={{ width: '100%', overflow: 'hidden' }} elevation={3}>
			<TableContainer sx={{ maxHeight: '90vh' }}>
				<Table stickyHeader aria-label='sticky table'>
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell
									key={column.id}
									align={column.align}
									style={{ minWidth: column.minWidth }}
									sortDirection={orderBy === column.id ? order : false}
								>
									{column.sortable ? (
										<TableSortLabel
											active={orderBy === column.id}
											direction={orderBy === column.id ? order : 'asc'}
											onClick={() => sortCol(column.id as keyof Movie)}
										>
											{column.label}
										</TableSortLabel>
									) : (
										column.label
									)}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{sortRows(
							rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
							orderBy as keyof Movie,
							order
						).map((row) => {
							return (
								<TableRow hover role='checkbox' tabIndex={-1} key={row.id}>
									<TableCell>
										<Avatar
											alt='Remy Sharp'
											src={row.image}
											sx={{ width: 50, height: 50 }}
											variant='square'
										/>
									</TableCell>
									<TableCell align='left'>
										<div className={styles.movieName}>
											<strong onClick={() => openMovieModal(row)}>
												{row.originalName}
											</strong>
											<em>{row.name}</em>
										</div>
									</TableCell>
									<TableCell align='right'>{row.year}</TableCell>
									<TableCell align='right'>
										{formatDuration(row.minutes)}
									</TableCell>

									<TableCell>
										<div className={styles.platforms}>
											{row.platforms.map(
												(platform) =>
													PLATFORMS[platform] && (
														<PlatformIcon
															key={platform}
															{...PLATFORMS[platform]}
														/>
													)
											)}
										</div>
									</TableCell>
									<TableCell>
										<div className={styles.rating}>
											<StarIcon />
											<span>{row.rating.toFixed(1)}</span>
										</div>
									</TableCell>
									<TableCell align='right'>
										<div className={styles.popularity}>
											<WhatshotIcon />
											<span>{row.popularity.toFixed(2)}</span>
										</div>

										<div className={styles.voteCount}>
											{row.vote_count} votes
										</div>
									</TableCell>
									<TableCell align='right'>{row.genres.join(', ')}</TableCell>
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[{ label: 'All', value: -1 }, 5, 10, 25]}
				component='div'
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={changePage}
				onRowsPerPageChange={changeRowsPerPage}
			/>
		</Paper>
	)
}
export default WatchlistTable
