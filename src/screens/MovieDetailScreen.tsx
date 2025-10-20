import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Typography from '../components/Typography';
import Button from '../components/Button';
import Image from '../components/Image';
import { MovieAPI } from '../utils/api';
import { Movie, MovieDetails, MovieVideo } from '../types/movie';
import { Colors } from '../utils/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { IMAGES } from '../assets';
import { Fonts } from '../utils/fonts';

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
        movieId: movie.id,
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

  const getGenreColor = (index: number) => {
    const colors = ['#20B2AA', '#FF69B4', '#9370DB', '#FFD700'];
    return colors[index % colors.length];
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
          label="Go Back"
          onPress={() => navigation.goBack()}
          // style={styles.backButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <View style={styles.posterSection}>
        <Image
          source={{ uri: MovieAPI.getImageUrl(movieDetails.backdrop_path, 'original') }}
          style={styles.poster}
        />
        
        <View style={styles.posterOverlay}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} >
              <MaterialIcons name="keyboard-arrow-left" size={moderateScale(30)} color={Colors.white} />
            </TouchableOpacity>
            <Typography variant="body1" weight="500" style={styles.headerTitle}>
              Watch
            </Typography>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.movieInfo}>
            {/* <Typography variant="h1" weight="bold" style={styles.movieTitle}>
              {movieDetails.title}
            </Typography> */}
            <Image source={IMAGES.MovieDetail} style={{height:scale(30), width:scale(102)}} />
            
            <Typography variant="body1" weight='500' color={Colors.white} style={styles.releaseDate}>
              In Theaters {formatDate(movieDetails.release_date)}
            </Typography>

            <View style={styles.buttonContainer}>
              <Button
                label="Get Tickets"
                onPress={handleGetTickets}
                backgroundColor={Colors.buttonPrimary}
                fontSize={moderateScale(14)}
                fontFamily={Fonts.semiBold}
                width={'70%'}
              />
              <Button
                label="Watch Trailer"
                onPress={handleWatchTrailer}
                backgroundColor={'transparent'}
                fontSize={moderateScale(14)}
                fontFamily={Fonts.semiBold}
                width={'70%'}
                borderWidth={1}
                borderColor={Colors.buttonPrimary}
                color={Colors.white}
              />
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.contentSection} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.genresContainer}>
            <Typography variant="body1" weight="500" style={styles.sectionTitle}>
              Genres
            </Typography>
            <View style={styles.genres}>
              {movieDetails.genres.map((genre, index) => (
                <View key={genre.id} style={[styles.genreTag, { backgroundColor: getGenreColor(index) }]}>
                  <Typography variant="subTitle" color={Colors.white} weight="600" numberOfLines={1}>
                    {genre.name}
                  </Typography>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.overviewContainer}>
            <Typography variant="body1" weight="500" style={styles.sectionTitle}>
              Overview
            </Typography>
            <Typography variant="subTitle" style={styles.overview}>
              {movieDetails.overview}
            </Typography>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  posterSection: {
    height: verticalScale(360),
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  posterOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
    paddingTop: verticalScale(50),
    paddingBottom: verticalScale(50),
    paddingHorizontal: scale(16),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width:'50%'
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: Colors.white,
    marginTop:scale(2)
  },
  headerSpacer: {
    width: scale(40),
  },
  movieInfo: {
    alignItems: 'center',
  },
  movieTitle: {
    color: '#FFD700',
    fontSize: moderateScale(28),
    textAlign: 'center',
    marginBottom: verticalScale(8),
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  releaseDate: {
    fontSize: moderateScale(16),
    marginBottom: verticalScale(10),
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: verticalScale(12),
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#4A9EFF',
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(14),
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: moderateScale(1),
    borderColor: '#4A9EFF',
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(14),
  },
  contentSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
  },
  content: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: scale(8),
    marginBottom: verticalScale(24),
  },
  ratingBadge: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  genresContainer: {
    marginBottom: verticalScale(32),
  },
  sectionTitle: {
    color: Colors.textPrimary,
    marginBottom: verticalScale(10),
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(8),
  },
  genreTag: {
    width: scale(60),
    height: scale(24),
    borderRadius: moderateScale(50),
    alignItems:'center',
    justifyContent:'center',
  },
  overviewContainer: {
    marginBottom: verticalScale(32),
  },
  overview: {
    lineHeight: verticalScale(17),
    color: Colors.gray20,
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
});

export default MovieDetailScreen;
