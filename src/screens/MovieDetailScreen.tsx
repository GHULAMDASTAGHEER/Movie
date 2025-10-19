import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Typography from '../components/Typography';
import Button from '../components/Button';
import Image from '../components/Image';
import { MovieAPI } from '../utils/api';
import { Movie, MovieDetails, MovieVideo } from '../types/movie';

interface RouteParams {
  movie: Movie;
}

const MovieDetailScreen: React.FC = () => {
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [trailer, setTrailer] = useState<MovieVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { movie } = route.params as RouteParams;

  useEffect(() => {
    loadMovieDetails();
  }, []);

  const loadMovieDetails = async () => {
    try {
      setLoading(true);
      const [details, videosResponse] = await Promise.all([
        MovieAPI.getMovieDetails(movie.id),
        MovieAPI.getMovieVideos(movie.id),
      ]);

      setMovieDetails(details);
      
      const trailerVideo = videosResponse.results.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
      );
      setTrailer(trailerVideo || null);
    } catch (error) {
      console.error('Error loading movie details:', error);
      Alert.alert('Error', 'Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  const handleWatchTrailer = () => {
    if (trailer) {
      (navigation as any).navigate('VideoPlayer', { 
        videoKey: trailer.key,
        movieTitle: movie.title 
      });
    } else {
      Alert.alert('No Trailer', 'No trailer available for this movie');
    }
  };

  const handleGetTickets = () => {
    (navigation as any).navigate('SeatSelection', { movie });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Typography variant="body1" style={styles.loadingText}>
          Loading movie details...
        </Typography>
      </View>
    );
  }

  if (!movieDetails) {
    return (
      <View style={styles.errorContainer}>
        <Typography variant="h2" weight="bold" style={styles.errorText}>
          Movie details not found
        </Typography>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h2" weight="bold" style={styles.title}>
          Watch
        </Typography>
      </View>

      <View style={styles.posterContainer}>
        <Image
          variant="backdrop"
          source={{ uri: MovieAPI.getImageUrl(movieDetails.backdrop_path, 'original') }}
          style={styles.poster}
        />
      </View>

      <View style={styles.content}>
        <Typography variant="h1" weight="bold" style={styles.movieTitle}>
          {movieDetails.title}
        </Typography>
        
        <Typography variant="body1" color="#666666" style={styles.releaseDate}>
          In Theaters {formatDate(movieDetails.release_date)}
        </Typography>

        <View style={styles.buttonContainer}>
          <Button
            title="Get Tickets"
            onPress={handleGetTickets}
            variant="primary"
            style={styles.primaryButton}
          />
          <Button
            title="Watch Trailer"
            onPress={handleWatchTrailer}
            variant="outline"
            style={styles.secondaryButton}
            disabled={!trailer}
          />
        </View>

        <View style={styles.genresContainer}>
          <Typography variant="h3" weight="bold" style={styles.sectionTitle}>
            Genres
          </Typography>
          <View style={styles.genres}>
            {movieDetails.genres.map((genre) => (
              <View key={genre.id} style={styles.genreTag}>
                <Typography variant="body2" color="#007AFF">
                  {genre.name}
                </Typography>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.overviewContainer}>
          <Typography variant="h3" weight="bold" style={styles.sectionTitle}>
            Overview
          </Typography>
          <Typography variant="body1" style={styles.overview}>
            {movieDetails.overview}
          </Typography>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(60),
    paddingBottom: verticalScale(20),
  },
  title: {
    color: '#000000',
  },
  posterContainer: {
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(20),
  },
  poster: {
    width: '100%',
    height: verticalScale(250),
  },
  content: {
    paddingHorizontal: scale(16),
  },
  movieTitle: {
    color: '#000000',
    marginBottom: verticalScale(8),
  },
  releaseDate: {
    marginBottom: verticalScale(24),
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: scale(12),
    marginBottom: verticalScale(32),
  },
  primaryButton: {
    flex: 1,
  },
  secondaryButton: {
    flex: 1,
  },
  genresContainer: {
    marginBottom: verticalScale(32),
  },
  sectionTitle: {
    color: '#000000',
    marginBottom: verticalScale(12),
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(8),
  },
  genreTag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(16),
  },
  overviewContainer: {
    marginBottom: verticalScale(32),
  },
  overview: {
    lineHeight: verticalScale(24),
    color: '#333333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: verticalScale(16),
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: scale(32),
  },
  errorText: {
    textAlign: 'center',
    marginBottom: verticalScale(24),
    color: '#FF0000',
  },
  backButton: {
    minWidth: scale(120),
  },
});

export default MovieDetailScreen;
