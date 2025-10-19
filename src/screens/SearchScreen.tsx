import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Typography from '../components/Typography';
import Image from '../components/Image';
import { MovieAPI } from '../utils/api';
import { Movie } from '../types/movie';
import { Fonts } from '../utils/fonts';

const SearchScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const navigation = useNavigation();

  const genres = [
    { name: 'Comedies', emoji: '😄' },
    { name: 'Crime', emoji: '🔍' },
    { name: 'Family', emoji: '👨‍👩‍👧‍👦' },
    { name: 'Documentaries', emoji: '📽️' },
    { name: 'Dramas', emoji: '🎭' },
    { name: 'Fantasy', emoji: '🧙‍♂️' },
    { name: 'Holidays', emoji: '🎄' },
    { name: 'Horror', emoji: '👻' },
    { name: 'Sci-Fi', emoji: '🚀' },
    { name: 'Thriller', emoji: '🔪' },
  ];

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
    setQuery(genre);
    Keyboard.dismiss();
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
    >
      <Image
        variant="poster"
        source={{ uri: MovieAPI.getImageUrl(item.poster_path, 'w200') }}
        style={styles.resultPoster}
      />
      <View style={styles.resultInfo}>
        <Typography variant="h3" weight="bold" numberOfLines={2}>
          {item.title}
        </Typography>
        <Typography variant="body2" color="#666666">
          {new Date(item.release_date).getFullYear()}
        </Typography>
      </View>
    </TouchableOpacity>
  );

  const renderGenreGrid = () => (
    <View style={styles.genresContainer}>
      <View style={styles.genresGrid}>
        {genres.map((genre, index) => (
          <TouchableOpacity
            key={index}
            style={styles.genreCard}
            onPress={() => handleGenrePress(genre.name)}
          >
            <View style={styles.genreEmoji}>
              <Typography variant="h2">{genre.emoji}</Typography>
            </View>
            <Typography variant="body2" weight="600" style={styles.genreName}>
              {genre.name}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>
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

    if (results.length > 0) {
      return (
        <View style={styles.resultsContainer}>
          <Typography variant="h3" weight="bold" style={styles.resultsTitle}>
            {results.length} Results Found
          </Typography>
          <FlatList
            data={results}
            renderItem={renderSearchResult}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        </View>
      );
    }

    return renderGenreGrid();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Q TV shows, movies and more"
          placeholderTextColor="#666666"
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Typography variant="body1" color="#666666">✕</Typography>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        {query.length >= 2 && (
          <Typography variant="h3" weight="bold" style={styles.topResultsTitle}>
            Top Results
          </Typography>
        )}
        {renderResults()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(60),
    paddingBottom: verticalScale(20),
    gap: scale(12),
  },
  searchInput: {
    flex: 1,
    height: verticalScale(44),
    borderWidth: moderateScale(1),
    borderColor: '#E0E0E0',
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(16),
    fontSize: moderateScale(16),
    fontFamily: Fonts.regular,
  },
  clearButton: {
    padding: moderateScale(8),
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(16),
  },
  topResultsTitle: {
    marginBottom: verticalScale(16),
    color: '#000000',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsTitle: {
    marginBottom: verticalScale(16),
    color: '#000000',
  },
  resultItem: {
    flexDirection: 'row',
    marginBottom: verticalScale(16),
    alignItems: 'center',
  },
  resultPoster: {
    width: scale(60),
    height: verticalScale(90),
    marginRight: scale(12),
  },
  resultInfo: {
    flex: 1,
  },
  genresContainer: {
    flex: 1,
  },
  genresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(12),
  },
  genreCard: {
    width: '47%',
    aspectRatio: 1.5,
    backgroundColor: '#F8F8F8',
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  genreEmoji: {
    marginBottom: verticalScale(8),
  },
  genreName: {
    color: '#000000',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: verticalScale(16),
    color: '#666666',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    marginBottom: verticalScale(8),
    color: '#000000',
  },
});

export default SearchScreen;
