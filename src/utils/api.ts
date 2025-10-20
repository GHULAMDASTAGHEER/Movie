import { Movie, MovieDetails, MovieVideosResponse, UpcomingMoviesResponse } from '../types/movie';

const API_KEY = '82a68e056dac0dbe8a1a72e5ad1d60c6';
const BASE_URL = 'https://api.themoviedb.org/3';

export class MovieAPI {
  private static async fetchFromAPI<T>(endpoint: string): Promise<T> {
    const separator = endpoint.includes('?') ? '&' : '?';
    const url = `${BASE_URL}${endpoint}${separator}api_key=${API_KEY}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API fetch error:', error);
      throw error;
    }
  }

  static async getUpcomingMovies(page: number = 1): Promise<UpcomingMoviesResponse> {
    return this.fetchFromAPI<UpcomingMoviesResponse>(`/movie/upcoming?page=${page}`);
  }

  static async getMovieDetails(movieId: number): Promise<MovieDetails> {
    return this.fetchFromAPI<MovieDetails>(`/movie/${movieId}`);
  }

  static async getMovieVideos(movieId: number): Promise<MovieVideosResponse> {
    return this.fetchFromAPI<MovieVideosResponse>(`/movie/${movieId}/videos`);
  }

  static async searchMovies(query: string, page: number = 1): Promise<UpcomingMoviesResponse> {
    return this.fetchFromAPI<UpcomingMoviesResponse>(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
  }

  static async discoverMovies(params: { with_genres?: number; page?: number }): Promise<UpcomingMoviesResponse> {
    const queryParams = new URLSearchParams();
    if (params.with_genres) {
      queryParams.append('with_genres', params.with_genres.toString());
    }
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    return this.fetchFromAPI<UpcomingMoviesResponse>(`/discover/movie?${queryParams.toString()}`);
  }

  static getImageUrl(path: string, size: 'w200' | 'w300' | 'w500' | 'w780' | 'original' = 'w500'): string {
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }

  static getYoutubeThumbnail(videoKey: string): string {
    return `https://img.youtube.com/vi/${videoKey}/hqdefault.jpg`;
  }
}
