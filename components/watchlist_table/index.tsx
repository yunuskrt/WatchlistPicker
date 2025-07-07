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

import StarIcon from '@mui/icons-material/Star'
import WhatshotIcon from '@mui/icons-material/Whatshot'

import PlatformIcon from '@components/platform_icon'
import { PLATFORMS } from '@utils/constants'
import { formatDuration } from '@utils/helpers'
import { Movie } from '@utils/types'
type Props = {
	rows: Movie[]
}
import styles from '@styles/WatchlistTable.module.css'

interface Column {
	id:
		| 'image'
		| 'name'
		| 'year'
		| 'minutes'
		| 'platforms'
		| 'rating'
		| 'popularity'
		| 'genres'
	label: string
	minWidth?: number
	maxWidth?: number
	align?: 'right'
}

const columns: readonly Column[] = [
	{ id: 'image', label: '' },
	{ id: 'name', label: 'Title', minWidth: 200 },
	{
		id: 'year',
		label: 'Year',
		align: 'right',
	},
	{
		id: 'minutes',
		label: 'Runtime',
		minWidth: 100,
		align: 'right',
	},
	{
		id: 'platforms',
		label: 'Platforms',
		minWidth: 200,
	},
	{
		id: 'rating',
		label: 'Rating',
		minWidth: 170,
	},
	{
		id: 'popularity',
		label: 'Popularity',
		align: 'right',
		minWidth: 100,
	},
	{
		id: 'genres',
		label: 'Genres',
		minWidth: 200,
		align: 'right',
	},
]

const WatchlistTable = ({ rows }: Props) => {
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(10)

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage)
	}

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(+event.target.value)
		setPage(0)
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
								>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rows
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row) => {
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
												<strong>{row.originalName}</strong>
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
				rowsPerPageOptions={[5, 10, 25]}
				component='div'
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	)
}
export default WatchlistTable
