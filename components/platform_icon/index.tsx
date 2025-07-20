import React, { useState } from 'react'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'

import { Platform } from '@utils/types'

type Props = Platform

const PlatformIcon = ({ id, name, logo }: Props) => {
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
			<Avatar
				sx={{ width: 35, height: 35, margin: '0 5px' }}
				aria-owns={open ? 'mouse-over-popover' : undefined}
				aria-haspopup='true'
				key={id}
				alt={name}
				src={logo}
				variant='circular'
				onMouseEnter={openPopover}
				onMouseLeave={closePopover}
			/>
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
				<Typography sx={{ p: 1 }}>{name}</Typography>
			</Popover>
		</Box>
	)
}
export default PlatformIcon
