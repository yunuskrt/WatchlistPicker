import React, { useState, useMemo } from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'
import Progress from '@components/progress'
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { MovieTableLoading } from '@utils/types'

type Props = MovieTableLoading
const LoadingView = ({ rows = 25, progress, message, image }: Props) => {
	const skeletonRows = useMemo(() => [...Array(rows).keys()], [rows])
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
	const openPopover = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}
	const closePopover = () => {
		setAnchorEl(null)
	}
	const open = Boolean(anchorEl)

	return (
		<Box>
			<Box sx={{ overflow: 'hidden', maxHeight: '90vh' }}>
				<Table aria-label='loading movie table'>
					<TableHead>
						<TableRow>
							<TableCell sx={{ minWidth: 200 }}></TableCell>
							<TableCell sx={{ minWidth: 80 }}></TableCell>
							<TableCell sx={{ minWidth: 100 }}></TableCell>
							<TableCell sx={{ minWidth: 200 }}></TableCell>
							<TableCell sx={{ minWidth: 170 }}></TableCell>
							<TableCell sx={{ minWidth: 100 }}></TableCell>
							<TableCell sx={{ minWidth: 200 }}></TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{skeletonRows.map((i) => (
							<TableRow key={i}>
								<TableCell>
									{/* Title/Subtitle */}
									<Box display='flex' alignItems='center'>
										<Skeleton
											sx={{ mr: 2 }}
											variant='rectangular'
											width={40}
											height={56}
										/>
										<Box>
											<Skeleton width='160px' height={18} />
											<Skeleton width='120px' height={14} />
										</Box>
									</Box>
								</TableCell>

								{/* Year */}
								<TableCell>
									<Skeleton width='40px' />
								</TableCell>

								{/* Runtime */}
								<TableCell>
									<Skeleton width='60px' />
								</TableCell>

								{/* Platforms */}
								<TableCell>
									<Box display='flex' alignItems='center'>
										{[0, 1, 2].map((p) => (
											<Skeleton
												sx={{ mr: p !== 2 ? 1 : 0 }}
												key={p}
												variant='circular'
												width={24}
												height={24}
											/>
										))}
									</Box>
								</TableCell>

								{/* Rating */}
								<TableCell>
									<Skeleton width='50px' />
								</TableCell>

								{/* Popularity */}
								<TableCell>
									<Skeleton width='70px' />
								</TableCell>

								{/* Genres */}
								<TableCell>
									<Skeleton width='180px' height={18} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Box>

			<Box
				sx={{
					position: 'absolute',
					top: '46%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					zIndex: 1,
					display: 'flex',
					flexDirection: 'column',
					gap: '2px',
					width: '240px',
					height: '250px',
				}}
			>
				{image ? (
					<Avatar
						sx={{ width: 240, height: 250, bgcolor: 'transparent' }}
						src={image}
						variant='rounded'
					/>
				) : (
					<Skeleton
						sx={{ bgcolor: 'grey.300' }}
						width={240}
						height={250}
						variant='rectangular'
					/>
				)}
				<Progress value={progress} sx={{ height: 10 }} />
				<Box>
					<Typography
						aria-owns={open ? 'mouse-over-popover' : undefined}
						aria-haspopup='true'
						aria-label='movie info'
						aria-controls='primary-search-theme'
						variant='body2'
						color='text.secondary'
						noWrap
						onMouseEnter={openPopover}
						onMouseLeave={closePopover}
					>
						{message}
					</Typography>
					<Popover
						id='mouse-over-popover'
						sx={{ pointerEvents: 'none' }}
						open={open}
						anchorEl={anchorEl}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'left',
						}}
						disableRestoreFocus
						onClose={closePopover}
					>
						<Typography sx={{ p: 1 }}>{message}</Typography>
					</Popover>
				</Box>
			</Box>
		</Box>
	)
}
export default LoadingView
