import { Platform, PlatformSelectOption } from '@utils/types'
import { ColumnProps } from '@utils/interfaces'

export const COLUMNS: readonly ColumnProps[] = [
	{ id: 'image', label: '' },
	{ id: 'name', label: 'Title', minWidth: 200 },
	{
		id: 'year',
		label: 'Year',
		align: 'right',
		sortable: true,
	},
	{
		id: 'minutes',
		label: 'Runtime',
		minWidth: 100,
		align: 'right',
		sortable: true,
	},
	{
		id: 'platforms',
		label: 'Platforms',
		minWidth: 200,
		sortable: true,
	},
	{
		id: 'rating',
		label: 'Rating',
		minWidth: 170,
		sortable: true,
	},
	{
		id: 'popularity',
		label: 'Popularity',
		align: 'right',
		minWidth: 100,
		sortable: true,
	},
	{
		id: 'genres',
		label: 'Genres',
		minWidth: 200,
		align: 'right',
	},
]
export const GENRE_SELECT_OPTIONS: string[] = [
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
]
export const LETTERBOXD_LIGHT_ICON = '/assets/ltbd_light.svg'
export const LETTERBOXD_DARK_ICON = '/assets/ltbd_dark.svg'
export const PLATFORMS: Record<string, Platform> = {
	'Amazon Prime Video': {
		id: 'amazon',
		name: 'Amazon Prime Video',
		logo: '/assets/prime_video.jpeg',
	},
	'Disney Plus': {
		id: 'disney',
		name: 'Disney Plus',
		logo: '/assets/disney_plus.png',
	},
	MUBI: { id: 'mubi', name: 'MUBI', logo: '/assets/mubi.png' },
	Netflix: { id: 'netflix', name: 'Netflix', logo: '/assets/netflix.png' },
	'TOD TV': { id: 'tod', name: 'TOD TV', logo: '/assets/tod_tv.jpeg' },
	'TV+': { id: 'tvplus', name: 'TV+', logo: '/assets/tv_plus.jpeg' },
}
export const PLATFORM_SELECT_OPTIONS: PlatformSelectOption[] = [
	{ value: 'All Platforms', label: 'Tüm Platformlar' },
	{ value: 'Amazon Prime Video', label: 'Amazon Prime Video' },
	{ value: 'Disney Plus', label: 'Disney Plus' },
	{ value: 'MUBI', label: 'MUBI' },
	{ value: 'Netflix', label: 'Netflix' },
	{ value: 'TOD TV', label: 'TOD TV' },
	{ value: 'TV+', label: 'TV+' },
]
export const STORE_KEY = 'watchlistData'
