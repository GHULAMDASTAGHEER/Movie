import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import Typography from '../components/Typography';
import Image from '../components/Image';
import { MovieAPI } from '../utils/api';
import { Movie } from '../types/movie';
import { Fonts } from '../utils/fonts';
import { Colors } from '../utils/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IMAGES } from '../assets';

const SearchScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const navigation = useNavigation();

  const genres = [
    { 
      name: 'Comedies', 
      image: IMAGES.Comedy,
      color: '#4A90E2'
    },
    { 
      name: 'Crime', 
      image: IMAGES.Crime,
      color: '#2C3E50'
    },
    { 
      name: 'Family', 
      image: IMAGES.Family,
      color: '#E67E22'
    },
    { 
      name: 'Documentaries', 
      image: IMAGES.Documentaries,
      color: '#27AE60'
    },
    { 
      name: 'Dramas', 
      image: IMAGES.Dramas,
      color: '#8E44AD'
    },
    { 
      name: 'Fantasy', 
      image: IMAGES.Fantasy,
      color: '#F39C12'
    },
    { 
      name: 'Holidays', 
      image: IMAGES.Holidays,
      color: '#E74C3C'
    },
    { 
      name: 'Horror', 
      image: IMAGES.Horror,
      color: '#2C3E50'
    },
    { 
      name: 'Sci-Fi', 
      image: IMAGES.SciFi,
      color: '#3498DB'
    },
    { 
      name: 'Thriller', 
      image: IMAGES.Thriller,
      color: '#27AE60'
    },
    
  ];

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

  useEffect(() => {
    if (query.trim().length >= 2) {
      searchMovies();
    } else {
      setResults([]);
      setSearchAttempted(false);
    }
  }, [query]);

  const searchMovies = async () => {
    try {
      setLoading(true);
      setSearchAttempted(true);
      const response = await MovieAPI.searchMovies(query.trim());
      setResults(response.results);
    } catch (error) {
      console.error('Error searching movies:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMoviePress = (movie: Movie) => {
    (navigation as any).navigate('MovieDetail', { movie });
  };

  const handleGenrePress = (genre: string) => {
    (navigation as any).navigate('GenreResults', { genre });
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSearchAttempted(false);
  };

  const renderSearchResult = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleMoviePress(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: MovieAPI.getImageUrl(item.poster_path, 'w200') }}
        style={styles.resultPoster}
      />
      <View style={styles.resultInfo}>
        <Typography variant="body1" weight="500" numberOfLines={1} style={styles.resultTitle}>
          {item.title}
        </Typography>
        <Typography variant="body2" color={Colors.gray10} style={styles.resultGenre}>
          {item.genre_ids && item.genre_ids.length > 0 ? getGenreName(item.genre_ids[0]) : 'Movie'}
        </Typography>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Ionicons name="ellipsis-horizontal" size={moderateScale(20)} color={'#61C3F2'} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderGenreGrid = () => (
    <View style={styles.genresContainer}>
        <ScrollView showsVerticalScrollIndicator={false}  contentContainerStyle={styles.genresGrid}>
        {genres?.map((genre, index) => (
          <TouchableOpacity
            key={index}
            style={styles.genreCard}
            onPress={() => handleGenrePress(genre.name)}
            activeOpacity={0.8}
          >
            <Image
              source={genre.image}
              resizeMode="cover"
              style={styles.genreImage}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0, 0, 0, 0.45)']}
              style={styles.genreOverlay}
            >
              <Typography variant="body1" weight="500" style={styles.genreName}>
                {genre.name}
              </Typography>
            </LinearGradient>
          </TouchableOpacity>
        ))}
        </ScrollView>
    </View>
  );

  const renderResults = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Typography variant="body1" style={styles.loadingText}>
            Searching...
          </Typography>
        </View>
      );
    }

    if (searchAttempted && results.length === 0) {
      return (
        <View style={styles.noResultsContainer}>
          <Typography variant="h3" weight="bold" style={styles.noResultsText}>
            No results found
          </Typography>
          <Typography variant="body1" color="#666666">
            Try searching for something else
          </Typography>
        </View>
      );
    }

    return renderGenreGrid();
  };

  const renderListHeader = () => (
    <>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={moderateScale(20)} color={Colors.black} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="TV shows, movies and more"
            placeholderTextColor={Colors.gray}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close" size={moderateScale(25)} color={Colors.black} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {query.length >= 2 && results.length > 0 && (
        <View style={{paddingHorizontal:scale(20)}}>
        <View style={styles.resultsHeader}>
          {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={moderateScale(24)} color={Colors.textPrimary} />
          </TouchableOpacity> */}
          <Typography variant="caption" weight="500" style={styles.resultsCount}>
             Top Results
          </Typography>
        </View>
        </View>
      )}
    </>
  );

  if (results.length > 0 && query.length >= 2) {
    return (
      <View style={styles.container}>
        <FlatList
          data={results}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderListHeader}
          contentContainerStyle={styles.resultsList}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={moderateScale(20)} color={Colors.black} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="TV shows, movies and more"
            placeholderTextColor={Colors.gray}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close" size={moderateScale(25)} color={Colors.black} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.content}>
        {renderResults()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(50),
    paddingBottom: verticalScale(20),
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(5),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    marginRight: scale(16),
    padding: moderateScale(4),
  },
  resultsCount: {
    color: Colors.textPrimary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: moderateScale(50),
    paddingHorizontal: scale(16),
    height: moderateScale(50),
  },
  searchIcon: {
    marginRight: scale(12),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(16),
    fontFamily: Fonts.regular,
    color: Colors.textPrimary,
    marginTop:5
  },
  clearButton: {
    padding: moderateScale(4),
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(15),
  },
  topResultsTitle: {
    marginBottom: verticalScale(16),
    color: Colors.textPrimary,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsTitle: {
    marginBottom: verticalScale(16),
    color: Colors.textPrimary,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  resultPoster: {
    width: '38%',
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
    fontSize: moderateScale(14),
  },
  moreButton: {
    padding: moderateScale(8),
  },
  resultsList: {
    paddingBottom: verticalScale(20),
  },
  genresContainer: {
    flex: 1,
  },
  genresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  genreCard: {
    width: '48.5%',
    height: moderateScale(100),
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(10),
    overflow: 'hidden',
    position: 'relative',
  },
  genreImage: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(10),
    position: 'absolute',
  },
  genreOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: moderateScale(12),
  },
  genreName: {
    color: Colors.white,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginLeft:moderateScale(3)
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
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    marginBottom: verticalScale(8),
    color: Colors.textPrimary,
  },
});

export default SearchScreen;
