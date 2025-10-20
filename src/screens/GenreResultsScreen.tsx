import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Typography from '../components/Typography';
import Image from '../components/Image';
import { MovieAPI } from '../utils/api';
import { Movie } from '../types/movie';
import { Fonts } from '../utils/fonts';
import { Colors } from '../utils/colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';


const GenreResultsScreen: React.FC = () => {
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { genre } = route.params as { genre: string };

  const getGenreName = (genreId: number) => {
    const genreMap: { [key: number]: string } = {
      28: 'Action',
      12: 'Adventure',
      16: 'Animation',
      35: 'Comedy',
      80: 'Crime',
      99: 'Documentary',
      18: 'Drama',
      10751: 'Family',
      14: 'Fantasy',
      36: 'History',
      27: 'Horror',
      10402: 'Music',
      9648: 'Mystery',
      10749: 'Romance',
      878: 'Sci-Fi',
      10770: 'TV Movie',
      53: 'Thriller',
      10752: 'War',
      37: 'Western'
    };
    return genreMap[genreId] || 'Movie';
  };

  const getGenreId = (genreName: string) => {
    const genreMap: { [key: string]: number } = {
      'Comedy': 35,
      'Comedies': 35,
      'Crime': 80,
      'Family': 10751,
      'Documentaries': 99,
      'Documentary': 99,
      'Dramas': 18,
      'Drama': 18,
      'Fantasy': 14,
      'Holidays': 10749,
      'Holiday': 10749,
      'Horror': 27,
      'Sci-Fi': 878,
      'SciFi': 878,
      'Thriller': 53,
    };
    return genreMap[genreName] || 35;
  };

  useEffect(() => {
    fetchGenreMovies();
  }, [genre]);

  const fetchGenreMovies = async () => {
    try {
      setLoading(true);
      const genreId = getGenreId(genre);
      const response = await MovieAPI.discoverMovies({ with_genres: genreId });
      setResults(response.results.slice(0, 10));
    } catch (error) {
      console.error('Error fetching genre movies:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMoviePress = (movie: Movie) => {
    (navigation as any).navigate('MovieDetail', { movie });
  };

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleMoviePress(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: MovieAPI.getImageUrl(item.poster_path, ) }}
        style={styles.resultPoster}
      />
      <View style={styles.resultInfo}>
        <Typography variant="body1" weight="500" numberOfLines={1} style={styles.resultTitle}>
          {item.title}
        </Typography>
        <Typography variant="caption" color={Colors.gray} style={styles.resultGenre}>
          {item.genre_ids && item.genre_ids.length > 0 ? getGenreName(item.genre_ids[0]) : 'Movie'}
        </Typography>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Ionicons name="ellipsis-horizontal" size={moderateScale(20)} color={'#61C3F2'} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <MaterialIcons name="keyboard-arrow-left" size={moderateScale(30)} color={Colors.textPrimary} />
      </TouchableOpacity>
      <Typography variant="body1" weight="500" style={styles.resultsCount}>
        {results.length} Results Found
      </Typography>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Typography variant="body1" style={styles.loadingText}>
            Loading {genre} movies...
          </Typography>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={results}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.resultsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(50),
    paddingBottom: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    width:'50%'
  },
  backButton: {
    marginRight: scale(16),
    padding: moderateScale(4),
  },
  resultsCount: {
    color: Colors.textPrimary,
    marginTop:moderateScale(2)
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    // borderBottomWidth: 1,
    // borderBottomColor: Colors.border,
  },
  resultPoster: {
    width: '40%',
    height: scale(90),
    marginRight: scale(16),
    borderRadius: moderateScale(10),
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    color: Colors.textPrimary,
    marginBottom: verticalScale(2),
  },
  resultGenre: {
  },
  moreButton: {
    padding: moderateScale(8),
  },
  resultsList: {
    paddingBottom: verticalScale(20),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: verticalScale(16),
    color: Colors.gray,
  },
});

export default GenreResultsScreen;
