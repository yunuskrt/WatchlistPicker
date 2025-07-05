import type { NextApiRequest, NextApiResponse } from "next";
import { ErrorResponse, Movie } from '@utils/types';
import {MovieData} from '@/data/movies';

type Data = Movie[] | ErrorResponse;


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
    if (req.method !== 'GET')
        return res.status(405).json({ error: 'Method Not Allowed' });
  res.status(200).json(MovieData);
}
