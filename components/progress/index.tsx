import React from 'react'

import Box from '@mui/material/Box'
import LinearProgress, {
	LinearProgressProps,
} from '@mui/material/LinearProgress'

const Progress = (props: LinearProgressProps & { value: number }) => {
	return (
		<Box sx={{ display: 'flex', alignItems: 'center' }}>
			<Box sx={{ width: '100%', mr: 1 }}>
				<LinearProgress variant='determinate' {...props} />
			</Box>
		</Box>
	)
}

export default Progress
