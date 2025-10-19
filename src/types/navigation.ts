export type RootStackParamList = {
  MovieList: undefined;
  MovieDetail: { movie: any };
  VideoPlayer: { videoKey: string; movieTitle: string };
  SeatSelection: { movie: any };
  Payment: { 
    movie: any; 
    selectedSeats: any[]; 
    selectedDate: string; 
    selectedTime: string; 
    totalPrice: number; 
  };
  Search: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  Watch: undefined;
  SearchStack: undefined;
  More: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
