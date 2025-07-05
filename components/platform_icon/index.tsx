import React, { useState } from 'react'

import Avatar from '@mui/material/Avatar'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'

import { Platform } from '@utils/types'

const PlatformIcon = ({ id, name, logo }: Platform) => {
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

	const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const handlePopoverClose = () => {
		setAnchorEl(null)
	}

	const open = Boolean(anchorEl)

	return (
		<div>
			<Avatar
				aria-owns={open ? 'mouse-over-popover' : undefined}
				aria-haspopup='true'
				onMouseEnter={handlePopoverOpen}
				onMouseLeave={handlePopoverClose}
				key={id}
				alt={name}
				src={logo}
				sx={{ width: 35, height: 35, margin: '0 5px' }}
				variant='circular'
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
				onClose={handlePopoverClose}
				disableRestoreFocus
			>
				<Typography sx={{ p: 1 }}>{name}</Typography>
			</Popover>
		</div>
	)
}
export default PlatformIcon
