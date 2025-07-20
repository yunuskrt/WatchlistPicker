import React, { useState, useContext } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import HomeAppBar from '@components/home_appbar'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { LETTERBOXD_LIGHT_ICON, LETTERBOXD_DARK_ICON } from '@utils/constants'
import { ThemeContext } from '@context/ThemeContext'

type Props = {
	submitUsername: (username: string) => void
}

const UsernameView = ({ submitUsername }: Props) => {
	const themeContext = useContext(ThemeContext)
	const mode = themeContext?.mode ?? false

	const [username, setUsername] = useState('')

	const changeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(event.target.value)
	}
	const submitForm = (event: React.FormEvent) => {
		event.preventDefault()
		submitUsername(username)
	}

	const isButtonDisabled = username.trim() === ''
	return (
		<Box>
			<HomeAppBar />
			<Container component='main' maxWidth='xs'>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						textAlign: 'center',
						minHeight: '80vh',
					}}
				>
					<Box
						sx={{
							m: 2,
							maxWidth: '256px',
						}}
						component='img'
						src={mode ? LETTERBOXD_DARK_ICON : LETTERBOXD_LIGHT_ICON}
						alt='Letterboxd Logo'
					/>

					<Typography
						sx={{ mt: 1, mb: 4 }}
						variant='body2'
						color='text.secondary'
					>
						Enter your username to retrieve platforms for your watchlist.
					</Typography>

					<Box component='form' onSubmit={submitForm} sx={{ width: '100%' }}>
						<TextField
							autoComplete='off'
							id='letterboxd-username'
							label='Letterboxd Username'
							variant='outlined'
							margin='normal'
							required
							fullWidth
							autoFocus
							value={username}
							onChange={changeUsername}
						/>

						<Button
							sx={{ mt: 2, py: '12px' }}
							type='submit'
							fullWidth
							variant='contained'
							size='large'
							disabled={isButtonDisabled}
						>
							Continue
						</Button>
					</Box>
				</Box>
			</Container>
		</Box>
	)
}
export default UsernameView
