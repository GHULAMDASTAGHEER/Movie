<<<<<<< HEAD
# Movie Booking App

A React Native movie booking application that lists upcoming movies using The Movie Database (TMDB) API and allows users to book movie tickets.

## Features

- **Movie List Screen**: Displays upcoming movies from TMDB API
- **Movie Detail Screen**: Shows detailed information about selected movies
- **Trailer Player**: Full-screen video player for movie trailers
- **Search Screen**: Search for movies by title or browse by genre
- **Seat Selection**: Interactive seat mapping UI for ticket booking
- **Payment Screen**: Complete booking flow with payment confirmation

## API Integration

The app integrates with The Movie Database (TMDB) API using the following endpoints:

- `https://api.themoviedb.org/3/movie/upcoming` - Get upcoming movies
- `https://api.themoviedb.org/3/movie/<movie-id>` - Get movie details
- `https://api.themoviedb.org/3/movie/<movie-id>/videos` - Get movie trailers
- `https://api.themoviedb.org/3/search/movie` - Search movies

## Components

### Reusable Components
- **Typography**: Custom text component with Poppins font family
- **Button**: Customizable button component with different variants
- **Image**: Optimized image component with different size variants

### Screens
- **MovieListScreen**: Main screen showing upcoming movies
- **MovieDetailScreen**: Movie details with trailer and booking options
- **SearchScreen**: Movie search and genre browsing
- **VideoPlayerScreen**: Full-screen trailer player
- **SeatSelectionScreen**: Interactive seat selection UI
- **PaymentScreen**: Payment confirmation screen

## Font Setup

The app uses Poppins font family. Font files are included in:
- `android/app/src/main/assets/fonts/`

## Installation & Setup

1. Install dependencies:
```bash
npm install
```

2. For iOS:
```bash
cd ios && pod install && cd ..
npm run ios
```

3. For Android:
```bash
npm run android
```

## API Key

The app uses a TMDB API key: `82a68e056dac0dbe8a1a72e5ad1d60c6`

To use your own API key:
1. Sign up at [TMDB](https://www.themoviedb.org/settings/api)
2. Replace the API key in `src/utils/api.ts`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Typography.tsx
│   ├── Button.tsx
│   ├── Image.tsx
│   └── index.ts
├── screens/            # App screens
│   ├── MovieListScreen.tsx
│   ├── MovieDetailScreen.tsx
│   ├── SearchScreen.tsx
│   ├── VideoPlayerScreen.tsx
│   ├── SeatSelectionScreen.tsx
│   └── PaymentScreen.tsx
├── types/              # TypeScript type definitions
│   ├── movie.ts
│   └── navigation.ts
├── utils/              # Utility functions
│   ├── api.ts
│   └── fonts.ts
└── assets/             # Static assets
    ├── images/
    └── fonts/
```

## Navigation

The app uses React Navigation with:
- Bottom Tab Navigator for main navigation
- Stack Navigator for screen transitions
- Tab screens: Dashboard, Watch, Search, More

## Dependencies

- React Navigation
- React Native Video
- React Native Safe Area Context
- React Native Vector Icons

## Design

The app follows the provided Figma design with:
- Clean, modern UI
- Poppins font family throughout
- Blue accent color (#007AFF)
- Purple navigation bar (#6B46C1)
- Responsive layout for different screen sizes
=======
# Movie
>>>>>>> 1bd2f50bea411afe95ec9fbe2ca171cc8bf1ccf2
