import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Typography from '../components/Typography';
import Button from '../components/Button';
import Image from '../components/Image';
import { MovieAPI } from '../utils/api';
import { Movie } from '../types/movie';
import { Colors } from '../utils/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MovieListScreen: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigation = useNavigation();

  const loadMovies = async (pageNum: number = 1, isRefresh: boolean = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await MovieAPI.getUpcomingMovies(pageNum);
      
      if (isRefresh || pageNum === 1) {
        setMovies(response.results);
      } else {
        setMovies(prev => [...prev, ...response.results]);
      }
      
      setHasMore(pageNum < response.total_pages);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const handleRefresh = () => {
    loadMovies(1, true);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      loadMovies(page + 1);
    }
  };

  const handleMoviePress = (movie: Movie) => {
    (navigation as any).navigate('MovieDetail', { movie });
  };

  const handleSearchPress = () => {
    (navigation as any).navigate('SearchStack');
  };

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => handleMoviePress(item)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: MovieAPI.getImageUrl(item.poster_path, ) }}
        style={styles.moviePoster}
      />
      <View style={styles.movieTitleOverlay}>
        <Typography variant="h4" style={styles.movieTitle}>
          {item.title}
        </Typography>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Typography variant="body2" weight="bold" style={styles.title}>
        Watch
      </Typography>
      <TouchableOpacity onPress={handleSearchPress} style={styles.searchButton}>
        <Ionicons name="search" size={moderateScale(15)} color={Colors.black} />
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => {
    if (!loading || page === 1) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </View>
    );
  };

  if (loading && page === 1) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.secondary} />
        <Typography variant="body1" style={styles.loadingText}>
          Loading movies...
        </Typography>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContainer: {
    paddingHorizontal: scale(16),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(20),
    paddingTop: verticalScale(60),
  },
  title: {
    color: Colors.textPrimary,
  },
  searchButton: {
    padding: moderateScale(8),
  },
  movieCard: {
    marginBottom: verticalScale(20),
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    position: 'relative',
  },
  movieTitleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.overlay,
    padding: moderateScale(16),
  },
  movieTitle: {
    color: Colors.textWhite,
    textShadowColor: Colors.overlayDark,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: verticalScale(16),
    color: Colors.gray,
  },
  footerLoader: {
    paddingVertical: verticalScale(20),
    alignItems: 'center',
  },
  moviePoster:{
    width: '100%',
    height: 180,
  }
});

export default MovieListScreen;
