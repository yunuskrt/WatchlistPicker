import type { NextApiRequest, NextApiResponse } from 'next'
import { ErrorResponse, Movie } from '@utils/types'
const axios = require('axios')
const cheerio = require('cheerio')

type Data = Movie[] | ErrorResponse

async function getWatchlistMovieLinks(username: string): Promise<string[]> {
	try {
		const MAX_PAGES = parseInt(process.env.MAX_PAGES || '10')
		const pageLinks: string[] = []
		let page = 1
		let check = true
		while (page <= MAX_PAGES && check) {
			console.log(`Processing page ${page}...`)
			try {
				const url = `${process.env.BASE_URL}/${username}/watchlist/page/${page}`
				const response = await axios.get(url)
				const $ = cheerio.load(response.data)

				const posters = $('li.poster-container div[data-target-link]')
				const postersList = Array.from(posters)
				if (postersList.length === 0) check = false
				else {
					postersList.forEach((el) => {
						const link = $(el).attr('data-target-link')
						if (link) {
							pageLinks.push(link)
						}
					})
				}
			} catch (error) {
				check = false
			}
			page++
			// add a delay to avoid overwhelming the server
			await new Promise((resolve) => setTimeout(resolve, 1000))
		}
		console.log(`Total ${pageLinks.length} links found.`)
		return pageLinks
	} catch (error: any) {
		console.error('Error:', error.message)
		return []
	}
}

async function getTmdbIdFromLetterboxdUrl(
	movieUrl: string
): Promise<string | null> {
	try {
		const response = await axios.get(movieUrl)
		const html = response.data
		const $ = cheerio.load(html)

		const tmdbId = $('body').attr('data-tmdb-id')
		return tmdbId || null
	} catch (error: any) {
		console.error('Error receiving tmdb id:', error.message)
		return null
	}
}

async function getMovieDetails(movieId: string): Promise<Movie | null> {
	try {
		const [detailsRes, providersRes] = await Promise.all([
			axios.get(`${process.env.TMDB_API_BASE_URL}/movie/${movieId}`, {
				params: { api_key: process.env.TMDB_API_KEY, language: 'tr-TR' },
			}),
			axios.get(
				`${process.env.TMDB_API_BASE_URL}/movie/${movieId}/watch/providers`,
				{
					params: { api_key: process.env.TMDB_API_KEY },
				}
			),
		])

		// platforms in Turkey
		const providersTR = providersRes.data.results.TR?.flatrate || []
		const platformNames = providersTR.map((p: any) => p.provider_name)

		const movieData: Movie = {
			id: detailsRes.data.id,
			name: detailsRes.data.title,
			year: parseInt(detailsRes.data.release_date.substring(0, 4)),
			minutes: detailsRes.data.runtime,
			originalName: detailsRes.data.original_title,
			platforms: platformNames,
			rating: parseFloat(detailsRes.data.vote_average.toFixed(1)),
			popularity: detailsRes.data.popularity,
			vote_count: detailsRes.data.vote_count,
			genres: detailsRes.data.genres.map((g: any) => g.name),
			image: detailsRes.data.poster_path
				? `${process.env.IMAGE_BASE_URL}${detailsRes.data.poster_path}`
				: '',
		}

		console.log(`✅ Success: ${movieData.originalName} (${movieData.year})`)
		return movieData
	} catch (error: any) {
		console.error(
			`❌ Error: While processing movie with ID ${movieId}. Message: ${error.message}`
		)
		return null
	}
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method Not Allowed' })
	}
	const username = req.query.username as string
	if (!username) {
		return res.status(400).json({ error: 'Username is required' })
	}
	try {
		const watchlistMovieLinks = await getWatchlistMovieLinks(username)
		if (!watchlistMovieLinks || watchlistMovieLinks.length === 0) {
			return res
				.status(404)
				.json({ error: 'No movie links found in the watchlist.' })
		}
		// set headers for SSE
		res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
		res.setHeader('Cache-Control', 'no-cache, no-transform')
		res.setHeader('Connection', 'keep-alive')
		// ❶ turn off buffering Gzip compression
		res.setHeader('Content-Encoding', 'identity') // ('none' da olur)
		// ❷ turn off buffering
		res.setHeader('X-Accel-Buffering', 'no')
		res.flushHeaders()
		// flag to check if client is still connected
		let clientConnected = true
		req.on('close', () => {
			console.log('Client disconnected, stopping process.')
			clientConnected = false
		})

		// first message with total movie count
		const total = watchlistMovieLinks.length
		res.write(
			`data: ${JSON.stringify({
				type: 'movie',
				message: `${total} movies found.`,
				progress: 0,
			})}\n\n`
		)

		const watchlistData = []
		for (const [index, link] of watchlistMovieLinks.entries()) {
			// check if client is still connected every iteration
			if (!clientConnected) break
			console.log(`${index + 1}/${total} - Processing link: ${link}`)

			const tmdbId = await getTmdbIdFromLetterboxdUrl(
				`${process.env.BASE_URL}${link}`
			)
			if (tmdbId) {
				const movieDetails = await getMovieDetails(tmdbId)
				if (movieDetails) {
					watchlistData.push(movieDetails)
					console.log(`Found movie: ${movieDetails.originalName}`)
					// send progress update with movie details
					res.write(
						`data: ${JSON.stringify({
							type: 'movie',
							message: `${movieDetails.originalName} (${
								movieDetails.year
							}) işleniyor. ${index + 1} of ${total}.`,
							progress: Math.round(((index + 1) / total) * 100),
						})}\n\n`
					)
				}
			}

			// a delay to avoid overwhelming the server
			await new Promise((resolve) => setTimeout(resolve, 1000))
		}
		// send final message when all movies are processed
		if (clientConnected) {
			res.write(
				`data: ${JSON.stringify({
					type: 'done',
					message: 'İşlem tamamlandı.',
					progress: 100,
					movies: watchlistData,
				})}\n\n`
			)
			res.end() // end connection
		}
	} catch (error: any) {
		console.log('An error occurred:', error.message)
		// send message to client if connection is still open
		if (!res.writableEnded) {
			res.write(
				`data: ${JSON.stringify({
					type: 'error',
					message: 'Serverda bir hata oluştu.',
					progress: 100,
				})}\n\n`
			)
			res.end()
		}
	}
}
