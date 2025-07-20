import React from 'react'

import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import DownloadIcon from '@mui/icons-material/Download'
import ShuffleIcon from '@mui/icons-material/Shuffle'

import { downloadExcel } from '@utils/helpers'
import { Movie } from '@utils/types'

type Props = {
	movieData: Movie[]
	pickRandomMovie: () => void
}

const WatchlistToolbar = ({ movieData, pickRandomMovie }: Props) => {
	return (
		<ButtonGroup aria-label='Basic button group'>
			<Button
				startIcon={<ShuffleIcon />}
				variant='outlined'
				color='success'
				onClick={pickRandomMovie}
			>
				Pick Random Movie
			</Button>
			<Button
				sx={{
					backgroundColor: '#217346',
					'&:hover': {
						backgroundColor: '#1e623d',
					},
					color: '#fff',
				}}
				startIcon={<DownloadIcon />}
				variant='outlined'
				color='success'
				onClick={() => downloadExcel(movieData)}
			>
				Download Excel
			</Button>
		</ButtonGroup>
	)
}

export default WatchlistToolbar
