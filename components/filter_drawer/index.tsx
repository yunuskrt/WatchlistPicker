import React, { useState } from 'react'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterAltIcon from '@mui/icons-material/FilterAlt'

import { Filter } from '@utils/types'
type Props = {
	submitFilters: (filters: Filter) => void
	removeFilters: () => void
}

const FilterDrawer = ({ submitFilters, removeFilters }: Props) => {
	const currentDate = new Date()
	const currentYear = currentDate.getFullYear()

	const [genre, setGenre] = useState('')
	const [rating, setRating] = useState<number>(0.0)
	const [runtime, setRuntime] = useState<number[]>([0, 300])
	const [platform, setPlatform] = useState('')
	const [popularity, setPopularity] = useState<number>(0)
	const [year, setYear] = useState<number[]>([1920, currentYear])

	const changeGenre = (event: SelectChangeEvent) => {
		setGenre(event.target.value as string)
	}
	const changePlatform = (event: SelectChangeEvent) => {
		setPlatform(event.target.value as string)
	}
	const changePopularity = (event: Event, newValue: number) => {
		setPopularity(newValue)
	}
	const changeRating = (event: Event, newValue: number) => {
		setRating(newValue)
	}
	const changeRuntime = (event: Event, newValue: number[]) => {
		setRuntime(newValue)
	}
	const changeYear = (event: Event, newValue: number[]) => {
		setYear(newValue)
	}

	const clearFilters = () => {
		removeFilters()
		setGenre('')
		setPlatform('')
		setPopularity(0)
		setRating(0.0)
		setRuntime([0, 300])
		setYear([1920, currentYear])
	}
	const applyFilters = () => {
		const filters: Filter = {}
		if (genre) filters.genre = genre
		if (platform) filters.platform = platform
		if (popularity > 0) filters.popularity = popularity
		if (rating > 0) filters.rating = rating
		if (runtime[0] > 0 || runtime[1] < 300) filters.runtime = runtime
		if (year[0] > 1920 || year[1] < currentYear) filters.year = year
		submitFilters(filters)
	}

	return (
		<Box
			sx={{
				width: 250,
				display: 'flex',
				flexDirection: 'column',
				gap: 1,
				padding: 2,
			}}
			role='presentation'
		>
			<Box sx={{ width: 200 }}>
				<Typography id='year-slider' gutterBottom>
					Year
				</Typography>
				<Slider
					sx={{ ml: 1 }}
					value={year}
					onChange={changeYear}
					aria-labelledby='year-slider'
					valueLabelDisplay='auto'
					min={1920}
					max={currentYear}
				/>
			</Box>

			<Box sx={{ width: 200 }}>
				<Typography id='runtime-slider' gutterBottom>
					Runtime
				</Typography>
				<Slider
					sx={{ ml: 1 }}
					value={runtime}
					onChange={changeRuntime}
					aria-labelledby='runtime-slider'
					valueLabelDisplay='auto'
					min={0}
					max={300}
				/>
			</Box>

			<Box sx={{ minWidth: 200 }}>
				<Typography gutterBottom>Platform</Typography>
				<FormControl fullWidth>
					<Select value={platform} onChange={changePlatform} displayEmpty>
						{[
							{ value: 'All Platforms', label: 'Tüm Platformlar' },
							{ value: 'Amazon Prime Video', label: 'Amazon Prime Video' },
							{ value: 'Disney Plus', label: 'Disney Plus' },
							{ value: 'MUBI', label: 'MUBI' },
							{ value: 'Netflix', label: 'Netflix' },
							{ value: 'TOD TV', label: 'TOD TV' },
							{ value: 'TV+', label: 'TV+' },
						].map((platform) => (
							<MenuItem key={platform.value} value={platform.value}>
								{platform.label}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>

			<Box sx={{ width: 200 }}>
				<Typography gutterBottom>Min Rating</Typography>
				<Slider
					sx={{ ml: 1 }}
					value={rating}
					onChange={changeRating}
					step={0.1}
					min={0.0}
					max={10.0}
					valueLabelDisplay='auto'
					marks={[
						{ value: 6.0 },
						{ value: 7.0 },
						{ value: 8.0 },
						{ value: 9.0 },
						{ value: 10.0 },
					]}
				/>
			</Box>

			<Box sx={{ width: 200 }}>
				<Typography gutterBottom>Min Popularity</Typography>
				<Slider
					sx={{ ml: 1 }}
					value={popularity}
					onChange={changePopularity}
					min={0}
					max={200}
					valueLabelDisplay='auto'
				/>
			</Box>

			<Box sx={{ minWidth: 200 }}>
				<Typography gutterBottom>Genre</Typography>
				<FormControl fullWidth>
					<Select value={genre} onChange={changeGenre} displayEmpty>
						{[
							'',
							'Aile',
							'Aksiyon',
							'Animasyon',
							'Bilim-Kurgu',
							'Dram',
							'Fantastik',
							'Gerilim',
							'Gizem',
							'Komedi',
							'Korku',
							'Macera',
							'Müzik',
							'Romantik',
							'Savaş',
							'Suç',
							'Tarih',
							'Vahşi Batı',
						].map((genre) => (
							<MenuItem key={genre} value={genre}>
								{genre}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>

			<Divider sx={{ my: 3 }} />

			<ButtonGroup orientation='vertical' aria-label='Vertical button group'>
				<Button startIcon={<DeleteIcon />} onClick={clearFilters}>
					Clear Filters
				</Button>
				<Button
					startIcon={<FilterAltIcon />}
					variant='contained'
					onClick={applyFilters}
				>
					Apply Filters
				</Button>
			</ButtonGroup>
		</Box>
	)
}
export default FilterDrawer
