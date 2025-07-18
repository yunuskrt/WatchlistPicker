import React, { useMemo } from 'react'
import {
	Box,
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material'
import Progress from '@components/progress'

interface MovieTableLoadingProps {
	rows?: number
	progress: number
	message?: string
}

const LoadingView = ({
	rows = 25,
	progress,
	message,
}: MovieTableLoadingProps) => {
	const skeletonRows = useMemo(() => [...Array(rows).keys()], [rows])

	return (
		<Box>
			<Box sx={{ width: '100%' }}>
				<Progress value={progress} sx={{ height: 20, borderRadius: 1 }} />

				{message && (
					<Typography variant='body2' color='text.secondary'>
						{message}
					</Typography>
				)}
			</Box>
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
											variant='rectangular'
											width={40}
											height={56}
											sx={{ mr: 2 }}
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
												key={p}
												variant='circular'
												width={24}
												height={24}
												sx={{ mr: p !== 2 ? 1 : 0 }}
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
		</Box>
	)
}

export default LoadingView
