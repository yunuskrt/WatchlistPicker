import React, { useState } from 'react'
import { styled, alpha } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import ContrastIcon from '@mui/icons-material/Contrast'
import FilterDrawer from '@components/filter_drawer'
import Drawer from '@mui/material/Drawer'

import { Filter } from '@utils/types'
type Props = {
	submitFilters: (filters: Filter) => void
	removeFilters: () => void
	searchMovies: (query: string) => void
}

const Search = styled('div')(({ theme }) => ({
	position: 'relative',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	'&:hover': {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	marginRight: theme.spacing(2),
	marginLeft: 0,
	width: '100%',
	[theme.breakpoints.up('sm')]: {
		marginLeft: theme.spacing(3),
		width: 'auto',
	},
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	'& .MuiInputBase-input': {
		padding: theme.spacing(1, 1, 1, 0),
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('md')]: {
			width: '20ch',
		},
	},
}))

const SearchAppBar = ({
	submitFilters,
	removeFilters,
	searchMovies,
}: Props) => {
	const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
	const toggleDrawer = (newOpen: boolean) => () => {
		setFilterDrawerOpen(newOpen)
	}

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position='static'>
				<Toolbar>
					<div>
						<IconButton
							size='large'
							edge='start'
							color='inherit'
							aria-label='open drawer'
							sx={{ mr: 2 }}
							onClick={toggleDrawer(true)}
						>
							<MenuIcon />
						</IconButton>
						<Drawer open={filterDrawerOpen} onClose={toggleDrawer(false)}>
							<FilterDrawer
								submitFilters={submitFilters}
								removeFilters={removeFilters}
							/>
						</Drawer>
					</div>

					<Search>
						<SearchIconWrapper>
							<SearchIcon />
						</SearchIconWrapper>
						<StyledInputBase
							placeholder='Search…'
							inputProps={{ 'aria-label': 'search' }}
							onChange={(e) => searchMovies(e.target.value)}
						/>
					</Search>
					<Box sx={{ flexGrow: 1 }} />
					<IconButton
						size='large'
						edge='end'
						aria-label='account of current user'
						aria-controls='primary-search-theme'
						aria-haspopup='true'
						color='inherit'
						onClick={() => console.log('TODO - Switch Theme clicked')}
					>
						<ContrastIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
		</Box>
	)
}
export default SearchAppBar
