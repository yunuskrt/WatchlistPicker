import React, { useState, useContext } from 'react'
import { ThemeContext } from '@context/ThemeContext'
import { Container, Box, Typography, TextField, Button } from '@mui/material'
import HomeAppBar from '@/components/home_appbar'

type Props = {
	submitUsername: (username: string) => void
}

const LETTERBOXD_LIGHT_ICON = '/assets/ltbd_light.svg'
const LETTERBOXD_DARK_ICON = '/assets/ltbd_dark.svg'

const UsernameView = ({ submitUsername }: Props) => {
	const themeContext = useContext(ThemeContext)
	const mode = themeContext?.mode ?? false

	const [username, setUsername] = useState('')

	const changeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(event.target.value)
	}

	const handleSubmit = (event: React.FormEvent) => {
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
						component='img'
						src={mode ? LETTERBOXD_DARK_ICON : LETTERBOXD_LIGHT_ICON}
						alt='Letterboxd Logo'
						sx={{
							m: 2,
							maxWidth: '256px',
						}}
					/>

					<Typography
						variant='body2'
						color='text.secondary'
						sx={{ mt: 1, mb: 4 }}
					>
						Enter your username to retrieve platforms for your watchlist.
					</Typography>

					<Box component='form' onSubmit={handleSubmit} sx={{ width: '100%' }}>
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
							type='submit'
							fullWidth
							variant='contained'
							size='large'
							disabled={isButtonDisabled}
							sx={{ mt: 2, py: '12px' }}
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
