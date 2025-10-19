import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Video, { VideoRef } from 'react-native-video';
import Typography from '../components/Typography';

interface RouteParams {
  videoKey: string;
  movieTitle: string;
}

const VideoPlayerScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { videoKey, movieTitle } = route.params as RouteParams;
  const videoRef = useRef<typeof Video>(null);

  const videoUrl = `https://www.youtube.com/watch?v=${videoKey}`;

  const handleDone = () => {
    navigation.goBack();
  };

  const handleVideoLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleVideoError = () => {
    setLoading(false);
    setError(true);
  };

  const handleVideoEnd = () => {
    setTimeout(() => {
      navigation.goBack();
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
          <Typography variant="body1" color="#FFFFFF" weight="bold">
            Done
          </Typography>
        </TouchableOpacity>
      </View>

      <View style={styles.videoContainer}>
        <Video
          ref={videoRef as React.Ref<VideoRef>}
          source={{ uri: videoUrl }}
          style={styles.video}
          controls={true}
          resizeMode="contain"
          onLoad={handleVideoLoad}
          onError={handleVideoError}
          onEnd={handleVideoEnd}
          playInBackground={false}
          playWhenInactive={false}
        />
        
        {loading && (
          <View style={styles.loadingOverlay}>
            <Typography variant="body1" color="#FFFFFF">
              Loading trailer...
            </Typography>
          </View>
        )}
        
        {error && (
          <View style={styles.errorOverlay}>
            <Typography variant="body1" color="#FFFFFF" style={styles.errorText}>
              Failed to load trailer
            </Typography>
            <TouchableOpacity onPress={handleDone} style={styles.retryButton}>
              <Typography variant="body1" color="#FFFFFF" weight="bold">
                Go Back
              </Typography>
            </TouchableOpacity>
          </View>
        )}
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
    right: 20,
    zIndex: 10,
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
  video: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  errorOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
});

export default VideoPlayerScreen;
