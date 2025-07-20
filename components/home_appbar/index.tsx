import React, { useState, useContext } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import IconButton from '@mui/material/IconButton'
import LightModeIcon from '@mui/icons-material/LightMode'
import Popover from '@mui/material/Popover'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import { ThemeContext } from '@context/ThemeContext'

type Props = {}

const HomeAppBar = ({}: Props) => {
	const themeContext = useContext(ThemeContext)
	const mode = themeContext?.mode ?? false
	const setMode = themeContext?.setMode ?? (() => {})

	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
	const openPopover = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}
	const closePopover = () => {
		setAnchorEl(null)
	}
	const open = Boolean(anchorEl)
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position='static'>
				<Toolbar>
					<Box sx={{ flexGrow: 1 }} />
					<Box>
						<IconButton
							aria-owns={open ? 'mouse-over-popover' : undefined}
							aria-haspopup='true'
							size='large'
							edge='end'
							aria-label='theme switch'
							aria-controls='primary-search-theme'
							color='inherit'
							onMouseEnter={openPopover}
							onMouseLeave={closePopover}
							onClick={() => setMode(!mode)}
						>
							{mode ? <LightModeIcon /> : <DarkModeIcon />}
						</IconButton>
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
							<Typography sx={{ p: 1 }}>{`Switch to ${
								mode ? 'light' : 'dark'
							} mode`}</Typography>
						</Popover>
					</Box>
				</Toolbar>
			</AppBar>
		</Box>
	)
}
export default HomeAppBar
