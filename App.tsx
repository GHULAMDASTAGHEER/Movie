import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, StyleSheet, View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Fonts } from './src/utils/fonts';
import { Colors } from './src/utils/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

import MovieListScreen from './src/screens/MovieListScreen';
import MovieDetailScreen from './src/screens/MovieDetailScreen';
import SearchScreen from './src/screens/SearchScreen';
import VideoPlayerScreen from './src/screens/VideoPlayerScreen';
import SeatSelectionScreen from './src/screens/SeatSelectionScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import ComingSoonScreen from './src/screens/ComingSoonScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function WatchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MovieList" component={MovieListScreen} />
      <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
      <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
      <Stack.Screen name="SeatSelection" component={SeatSelectionScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
      <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
      <Stack.Screen name="SeatSelection" component={SeatSelectionScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.tabBackground,
          borderTopWidth: 0,
          height: verticalScale(75),
          paddingBottom: verticalScale(8),
          paddingTop: verticalScale(8),
          borderTopLeftRadius: moderateScale(27),
          borderTopRightRadius: moderateScale(27),
        },
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarLabelStyle: {
          fontSize: moderateScale(10),
          fontFamily: Fonts.medium,
          textTransform: 'capitalize',
          marginTop: moderateScale(4),
        },
        tabBarIconStyle: {
          marginTop: moderateScale(4),
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={ComingSoonScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={moderateScale(22)} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Watch"
        component={WatchStack}
        options={{
          tabBarLabel: 'Watch',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="play-circle" size={moderateScale(22)} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MediaLibrary"
        component={ComingSoonScreen}
        options={{
          tabBarLabel: 'Media Library',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="library" size={moderateScale(22)} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={ComingSoonScreen}
        options={{
          tabBarLabel: 'More',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="menu" size={moderateScale(22)} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function App() {
  console.log('🎬 App Started - Console logs are working!');
  
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}


export default App;
