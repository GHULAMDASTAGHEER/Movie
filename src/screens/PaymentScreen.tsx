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
import { Fonts } from '../utils/fonts';

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

  const seatTypes = [
    { type: 'Selected', color: '#CD9D0F', description: 'Your selected seats' },
    { type: 'Not available', color: '#A6A6A6', description: 'Already booked' },
    { type: 'VIP ($150)', color: '#564CA3', description: 'VIP seats' },
    { type: 'Regular ($50)', color: '#61C3F2', description: 'Regular seats' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} >
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
        {/* Seat image with border line on top */}
        <View style={styles.seatImageContainer}>
          
          <View style={styles.imageRow}>
            <Image
              source={IMAGES.Count}
              style={{width:moderateScale(6), height:moderateScale(149)}}
            />
            <Image
              source={IMAGES.SeatSelected}
              style={{width:moderateScale(328), height:moderateScale(190)}}
            />
          </View>
        </View>

        {/* Legend for seat types */}
        <View style={styles.legendContainer}>
        <View style={styles.topBorder} />
          {seatTypes?.map((seat, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: seat.color }]} />
              <Typography variant="body2" style={styles.legendText}>
                {seat.type}
              </Typography>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.bottomContainer}>
        {/* Seat summary chip */}
        <View style={styles.seatChip}>
          <Typography variant="body2" weight="500" style={{ color: Colors.textPrimary }}>
            {selectedSeats?.length || 4}
          </Typography>
          <Typography variant="body2" style={{ color: Colors.textPrimary }}>
            {`/${selectedSeats?.[0]?.row ?? '-'} row`}
          </Typography>
          <Typography variant="body2" weight="500" style={{ color: Colors.textPrimary, marginLeft: scale(2) }}>×</Typography>
        </View>

        {/* Total price card + Proceed button */}
        <View style={styles.ctaRow}>
          <View style={styles.priceCard}>
            <Typography variant="caption" color={Colors.textPrimary}>
              Total Price
            </Typography>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: verticalScale(2) }}>
              <Typography variant="caption" weight="bold" color={Colors.textPrimary} style={{ marginRight: scale(6) }}>
                $
              </Typography>
              <Typography variant="caption" weight="bold" color={Colors.textPrimary}>
                {totalPrice || 0}
              </Typography>
            </View>
          </View>
          <View style={{ flex: 1, marginLeft: scale(12) }}>
            <Button
              label={processing ? 'Processing...' : 'Proceed to pay'}
              onPress={handlePayment}
              disabled={processing}
              fontSize={moderateScale(14)}
              fontFamily={Fonts.semiBold}
              backgroundColor={Colors.buttonPrimary}
              borderRadius={moderateScale(10)}
               marginBottom={moderateScale(20)}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    paddingTop: verticalScale(40),
  },
  seatImageContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(30),
  },
  topBorder: {
    width: moderateScale(328),
    height: moderateScale(4),
    backgroundColor: Colors.gray20,
    marginBottom: verticalScale(20),
    borderRadius:moderateScale(50)
  },
  imageRow: {
    flexDirection: 'row',
    gap: moderateScale(10),
    alignItems: 'center',
  },
  bottomContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.background,
  },
  seatChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: scale(10),
    width:moderateScale(105),
    paddingVertical: verticalScale(6),
    backgroundColor: Colors.secondary,
    borderRadius: moderateScale(12),
    gap: moderateScale(8),
    marginBottom: verticalScale(12),
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceCard: {
    width: moderateScale(105),
    backgroundColor: Colors.secondary,
    borderRadius: moderateScale(10),
    paddingHorizontal: scale(16),
    height:moderateScale(48),
    paddingVertical: verticalScale(4),
     marginBottom:moderateScale(20)
  },
  screen: {
    width: moderateScale(200),
    height: verticalScale(4),
    backgroundColor: Colors.gray,
    borderRadius: moderateScale(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenText: {
    color: Colors.textSecondary,
    marginTop: verticalScale(10),
  },

  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: verticalScale(30),
    paddingHorizontal: scale(5),
    marginTop:moderateScale(50)
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(10),
    width: '48%',
  },
  legendColor: {
    width: moderateScale(16),
    height: moderateScale(16),
    borderRadius: moderateScale(4),
    marginRight: scale(8),
  },
  legendText: {
    color: Colors.textPrimary,
    fontSize: moderateScale(12),
  },
});

export default PaymentScreen;
