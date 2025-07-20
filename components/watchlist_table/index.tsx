import React, { useState } from 'react'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Paper from '@mui/material/Paper'
import PlatformIcon from '@components/platform_icon'
import StarIcon from '@mui/icons-material/Star'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Typography from '@mui/material/Typography'
import WhatshotIcon from '@mui/icons-material/Whatshot'

import { COLUMNS, PLATFORMS } from '@utils/constants'
import { formatDuration, sortRows } from '@utils/helpers'
import { Movie } from '@utils/types'

type Props = {
	rows: Movie[]
	openMovieModal: (movie: Movie) => void
}

const WatchlistTable = ({ rows, openMovieModal }: Props) => {
	const [order, setOrder] = useState<'asc' | 'desc'>('asc')
	const [orderBy, setOrderBy] = useState<keyof Movie | ''>('')
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(-1)

	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

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
		<>
			{isMobile ? (
				<Box>
					{rows
						.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
						.map((row) => (
							<Card
								key={row.id}
								sx={{ mb: 2 }}
								onClick={() => openMovieModal(row)}
							>
								<CardContent
									sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
								>
									<Avatar
										variant='square'
										src={row.image}
										alt={row.originalName}
										sx={{ width: 64, height: 80 }}
									/>
									<Box
										sx={{
											display: 'flex',
											flexDirection: 'column',
											gap: 0.8,
											flexGrow: 1,
										}}
									>
										<Typography
											variant='subtitle1'
											fontWeight='bold'
											sx={{ cursor: 'pointer' }}
										>
											{row.originalName} - {row.year}
										</Typography>
										<Typography variant='body2' color='text.secondary'>
											{row.name}
										</Typography>
										<Typography variant='body2'>
											{formatDuration(row.minutes)}
										</Typography>
										<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
											{row.platforms.map(
												(p) =>
													PLATFORMS[p] && (
														<PlatformIcon key={p} {...PLATFORMS[p]} />
													)
											)}
										</Box>
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
												color: '#FFD700',
											}}
										>
											<StarIcon fontSize='small' />
											<Typography
												sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}
											>
												{row.rating.toFixed(1)}
											</Typography>
										</Box>
									</Box>
								</CardContent>
							</Card>
						))}
					<TablePagination
						rowsPerPageOptions={[{ label: 'All', value: -1 }, 5, 10, 25]}
						component='div'
						count={rows.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={changePage}
						onRowsPerPageChange={changeRowsPerPage}
					/>
				</Box>
			) : (
				<Paper sx={{ width: '100%', overflow: 'hidden' }} elevation={3}>
					<TableContainer sx={{ maxHeight: '80vh' }}>
						<Table stickyHeader aria-label='sticky table'>
							<TableHead>
								<TableRow>
									{COLUMNS.map((column) => (
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
									rows.slice(
										page * rowsPerPage,
										page * rowsPerPage + rowsPerPage
									),
									orderBy as keyof Movie,
									order
								).map((row) => {
									return (
										<TableRow
											sx={{ cursor: 'pointer' }}
											hover
											role='checkbox'
											tabIndex={-1}
											key={row.id}
											onClick={() => openMovieModal(row)}
										>
											<TableCell>
												<Avatar
													alt={row.originalName}
													src={row.image}
													sx={{ width: 40, height: 50 }}
													variant='square'
												/>
											</TableCell>
											<TableCell align='left'>
												<Box sx={{ display: 'flex', flexDirection: 'column' }}>
													<Typography variant='subtitle1' fontWeight='bold'>
														{row.originalName}
													</Typography>
													<Typography
														sx={{ cursor: 'pointer' }}
														variant='subtitle1'
														fontStyle='italic'
														fontSize='0.9rem'
														color='text.secondary'
													>
														{row.name}
													</Typography>
												</Box>
											</TableCell>
											<TableCell align='right'>{row.year}</TableCell>
											<TableCell align='right'>
												{formatDuration(row.minutes)}
											</TableCell>

											<TableCell>
												<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
													{row.platforms.map(
														(platform) =>
															PLATFORMS[platform] && (
																<PlatformIcon
																	key={platform}
																	{...PLATFORMS[platform]}
																/>
															)
													)}
												</Box>
											</TableCell>
											<TableCell>
												<Box
													sx={{
														display: 'flex',
														alignItems: 'center',
														color: '#FFD700',
													}}
												>
													<StarIcon />
													<Typography
														sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}
													>
														{row.rating.toFixed(1)}
													</Typography>
												</Box>
											</TableCell>
											<TableCell align='right'>
												<Box
													sx={{
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'flex-end',
														color: '#00BFFF',
													}}
												>
													<WhatshotIcon />
													<Typography
														sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}
													>
														{row.popularity.toFixed(2)}
													</Typography>
												</Box>
												<Typography
													variant='body2'
													color='text.secondary'
													fontSize='0.9em'
												>
													{row.vote_count} votes
												</Typography>
											</TableCell>
											<TableCell align='right'>
												{row.genres.join(', ')}
											</TableCell>
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
			)}
		</>
	)
}
export default WatchlistTable
