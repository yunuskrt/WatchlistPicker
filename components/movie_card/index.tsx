import React from 'react'

import Avatar from '@mui/material/Avatar'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Rating from '@mui/material/Rating'
import ScheduleIcon from '@mui/icons-material/Schedule'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { Movie } from '@utils/types'
import { PLATFORMS } from '@utils/constants'

type Props = {
	movie: Movie | null
}

const MovieCard = ({ movie }: Props) => {
	const showSubtitle = movie?.name && movie?.name !== movie?.originalName
	return (
		<Card
			sx={{
				display: 'flex',
				flexDirection: { xs: 'column', sm: 'row' },
				maxWidth: 700,
				boxShadow: 3,
				borderRadius: 2,
			}}
		>
			<CardMedia
				component='img'
				sx={{
					width: { xs: '100%', sm: 200 },
					height: { xs: 250, sm: 'auto' },
					flexShrink: 0,
					objectFit: 'cover',
				}}
				image={movie?.image}
				alt={movie?.originalName}
			/>
			<CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
				<Stack spacing={1} flexGrow={1}>
					{/* Title */}
					<Typography variant='h5' component='div' fontWeight='bold'>
						{movie?.originalName}
					</Typography>
					{/* Subtitle (if different from original name) */}
					{showSubtitle && (
						<Typography
							variant='subtitle1'
							color='text.secondary'
							sx={{ mt: -1 }}
						>
							{movie?.name}
						</Typography>
					)}
					{/* Year and Minutes */}
					<Stack
						direction='row'
						spacing={2}
						alignItems='center'
						color='text.secondary'
					>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
							<CalendarTodayIcon fontSize='small' />
							<Typography variant='body2'>{movie?.year}</Typography>
						</Box>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
							<ScheduleIcon fontSize='small' />
							<Typography variant='body2'>{movie?.minutes} min</Typography>
						</Box>
					</Stack>
					{/* Genres */}
					<Stack direction='row' spacing={1} useFlexGap flexWrap='wrap'>
						{movie?.genres.map((genre) => (
							<Chip key={genre} label={genre} size='small' />
						))}
					</Stack>
				</Stack>

				<Stack spacing={2} sx={{ mt: 2 }}>
					{/* Platforms */}
					<Box>
						<Typography
							variant='caption'
							color='text.secondary'
							display='block'
							mb={0.5}
						>
							Available on:
						</Typography>
						<Stack direction='row' spacing={1}>
							{movie?.platforms.map(
								(platform) =>
									PLATFORMS[platform] && (
										<Avatar
											key={platform}
											src={PLATFORMS[platform].logo}
											sx={{ width: 24, height: 24, bgcolor: 'transparent' }}
											variant='square'
										>
											{platform.charAt(0)}
										</Avatar>
									)
							)}
						</Stack>
					</Box>
					{/* Rating */}
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<Rating
							name='movie-rating'
							value={movie!.rating / 2}
							precision={0.1}
							readOnly
						/>
						<Typography variant='h6' component='span'>
							{movie?.rating.toFixed(1)}
						</Typography>
						<Typography variant='body2' color='text.secondary'>
							/ 10
						</Typography>
					</Box>
				</Stack>
			</CardContent>
		</Card>
	)
}

export default MovieCard
