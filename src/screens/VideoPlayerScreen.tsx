import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import YoutubePlayer from 'react-native-youtube-iframe';
import Typography from '../components/Typography';
import { MovieAPI } from '../utils/api';

interface RouteParams {
  movieId: number;
  movieTitle: string;
}

const VideoPlayerScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { movieId, movieTitle } = route.params as RouteParams;

  useEffect(() => {
    loadTrailerVideo();
  }, []);

  const loadTrailerVideo = async () => {
    try {
      setLoading(true);
      const videosResponse = await MovieAPI.getMovieVideos(movieId);
      
      const trailerVideo = videosResponse.results.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
      );
      
      if (trailerVideo) {
        setVideoId(trailerVideo.key);
        setPlaying(true);
      } else {
        setError(true);
      }
    } catch (error) {
      console.error('Error loading trailer:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    navigation.goBack();
  };

  const onStateChange = (state: string) => {
    if (state === 'ended') {
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Typography variant="body1" color="#FFFFFF" style={styles.loadingText}>
            Loading trailer...
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !videoId) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar hidden />
        <View style={styles.errorContainer}>
          <Typography variant="h2" color="#FFFFFF" weight="bold" style={styles.errorText}>
            Trailer not available
          </Typography>
          <Typography variant="body1" color="#FFFFFF" style={styles.errorSubtext}>
            This movie doesn't have a trailer available.
          </Typography>
          <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
            <Typography variant="body1" color="#FFFFFF" weight="bold">
              Done
            </Typography>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Typography variant="h3" color="#FFFFFF" weight="bold" style={styles.movieTitle}>
            {movieTitle}
          </Typography>
        </View>
        <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
          <Typography variant="body1" color="#FFFFFF" weight="bold">
            Done
          </Typography>
        </TouchableOpacity>
      </View>

      <View style={styles.videoContainer}>
        <YoutubePlayer
          height="100%"
          width="100%"
          videoId={videoId}
          play={playing}
          onChangeState={onStateChange}
          onReady={() => setLoading(false)}
          onError={() => setError(true)}
          initialPlayerParams={{
            controls: true,
            modestbranding: true,
            rel: false,
            showinfo: false,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    marginRight: 20,
  },
  movieTitle: {
    fontSize: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  doneButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 32,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  errorSubtext: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.8,
  },
});

export default VideoPlayerScreen;
