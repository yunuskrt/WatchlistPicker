import type { NextApiRequest, NextApiResponse } from "next";
import { ErrorResponse, Movie } from '@utils/types';
const axios = require('axios');
const cheerio = require('cheerio');


type Data = Movie[] | ErrorResponse;

async function getWatchlistMovieLinks(username: string): Promise<string[]> {
	try {
        const MAX_PAGES = parseInt(process.env.MAX_PAGES || '10');
		const pageLinks : string[] = []
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

async function getTmdbIdFromLetterboxdUrl(movieUrl: string): Promise<string | null> {
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
			axios.get(`${process.env.TMDB_API_BASE_URL}/movie/${movieId}/watch/providers`, {
				params: { api_key: process.env.TMDB_API_KEY },
			}),
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

		console.log(`✅ Success: ${movieData.name} (${movieData.year})`)
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
  res: NextApiResponse<Data>,
) {
    if (req.method !== 'GET')
        return res.status(405).json({ error: 'Method Not Allowed' });
    else{
        const username = req.query.username as string;
        
        if (!username)
            return res.status(400).json({ error: 'Username is required' });

      	const watchlistMovieLinks = await getWatchlistMovieLinks(username)
        if (!watchlistMovieLinks || watchlistMovieLinks.length === 0) {
          console.log('No movie links found in the watchlist.')
          return res.status(404).json({ error: 'No movie links found in the watchlist.'})
        }
        const tmdbIds = []
        const watchlistData = []
        let ind = 1
        for (const link of watchlistMovieLinks) {
          const tmdbId = await getTmdbIdFromLetterboxdUrl(`${process.env.BASE_URL}${link}`)
          console.log(`${ind} - Processing link: ${link}`)
          if (tmdbId) {
            const movieDetails = await getMovieDetails(tmdbId)
            tmdbIds.push(tmdbId)
            if (movieDetails)
              watchlistData.push(movieDetails)
            console.log(`Found TMDB ID: ${tmdbId} for link: ${link}`)
          } else {
            console.log(`No TMDB ID found for link: ${link}`)
          }
          // Add a delay to avoid overwhelming the server
          await new Promise((resolve) => setTimeout(resolve, 4000))
          ind++
        }
        console.log(`Total TMDB IDs found: ${tmdbIds.length}`)
        return res.status(200).json(watchlistData);
    }

}