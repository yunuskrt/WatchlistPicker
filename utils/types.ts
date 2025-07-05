export type ErrorResponse = {
    error: string;
};

export type Movie = {
    id: number;
    name: string;
    year: number;
    minutes: number;
    originalName: string;
    platforms: string[];
    rating: number;
    popularity: number;
    vote_count: number;
    genres: string[];
    image: string;
};

export type Platform = {
    id: string;
    name: string;
    logo: string;
}