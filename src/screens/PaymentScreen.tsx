import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Typography from '../components/Typography';
import Button from '../components/Button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../utils/colors';
import { Movie, Seat } from '../types/movie';
import { IMAGES } from '../assets';

interface RouteParams {
  movie: Movie;
  selectedSeats: Seat[];
  selectedDate: string;
  selectedTime: string;
  selectedHall: string;
  totalPrice: number;
}

const PaymentScreen: React.FC = () => {
  const [processing, setProcessing] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  
  // Safe parameter extraction with fallbacks
  const params = route.params as RouteParams || {};
  const {
    movie = { title: 'Unknown Movie' },
    selectedSeats = [],
    selectedDate = 'Unknown Date',
    selectedTime = 'Unknown Time',
    selectedHall = 'Unknown Hall',
    totalPrice = 0
  } = params;

  // Format date: "5 Mar" -> "March 5, 2021"
  const formatDate = (date: string) => {
    const months: { [key: string]: string } = {
      'Mar': 'March',
      'Apr': 'April',
      'May': 'May',
      'Jun': 'June',
      'Jul': 'July',
      'Aug': 'August',
      'Sep': 'September',
      'Oct': 'October',
      'Nov': 'November',
      'Dec': 'December',
    };
    
    const parts = date.split(' ');
    if (parts.length === 2) {
      const day = parts[0];
      const month = months[parts[1]] || parts[1];
      return `${month} ${day}, 2021`;
    }
    return date;
  };

  // Format hall: "Cinetech + Hall 1" -> "hall 1"
  const formatHall = (hall: string) => {
    const match = hall.match(/Hall (\d+)/i);
    return match ? `hall ${match[1]}` : hall.toLowerCase();
  };

  const formattedHeaderDate = `${formatDate(selectedDate)}  I  ${selectedTime} ${formatHall(selectedHall)}`;

  const handlePayment = async () => {
    setProcessing(true);
    
    setTimeout(() => {
      setProcessing(false);
      Alert.alert(
        'Payment Successful!',
        'Your tickets have been booked successfully.',
        [
          {
            text: 'OK',
            onPress: () => (navigation as any).navigate('MovieList'),
          },
        ]
      );
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialIcons name="keyboard-arrow-left" size={moderateScale(26)} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Typography variant="body1" weight="500" style={styles.title}>{movie.title}</Typography>
            <Typography variant="subTitle" weight='500' color={Colors.secondaryLight}>{formattedHeaderDate}</Typography>
          </View>
          <View style={{ width: moderateScale(26) }} />
        </View>
      </View>

      <View style={styles.content}>
        <Image
        source={IMAGES.Count}
        style={{width:moderateScale(6), height:moderateScale(149) ,top:moderateScale(45)}}
        />
         <Image
        source={IMAGES.SeatSelected}
        style={{width:moderateScale(328), height:moderateScale(190)}}
        />
      </View>

     

      <View style={styles.bottomContainer}>
        <Button
          label={processing ? 'Processing...' : 'Complete Payment'}
          onPress={handlePayment}
          disabled={processing}
          backgroundColor={Colors.buttonPrimary}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerArea: {
    paddingTop: verticalScale(48),
    paddingBottom: verticalScale(12),
    paddingHorizontal: scale(14),
    backgroundColor: Colors.background,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: moderateScale(26),
    height: moderateScale(26),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
    top: moderateScale(10),
  },
  title: {
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(80),
    flexDirection:'row',
    gap:moderateScale(10)
  },
  
  bottomContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
});

export default PaymentScreen;
