import React, { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Typography from '../components/Typography';
import Button from '../components/Button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../utils/colors';
import { Movie } from '../types/movie';

interface RouteParams {
  movie: Movie;
}

interface Seat {
  id: string;
  row: number;
  number: number;
  type: 'regular' | 'vip';
  available: boolean;
  selected: boolean;
}

const SeatSelectionScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('5 Mar');
  const [selectedTime, setSelectedTime] = useState('12:30');
  const navigation = useNavigation();
  const route = useRoute();
  const { movie } = route.params as RouteParams;

  const dates = ['5 Mar', '6 Mar', '7 Mar', '8 Mar', '9 Mar'];
  const timeSlots = [
    { time: '12:30', hall: 'Cinetech + Hall 1', price: 50 },
    { time: '13:30', hall: 'Cinetech + Hall 1', price: 75 },
    { time: '15:00', hall: 'Cinetech + Hall 2', price: 60 },
  ];

  const generateSeats = (): Seat[] => {
    const seats: Seat[] = [];
    for (let row = 1; row <= 14; row++) {
      const seatsPerRow = row <= 10 ? 8 : 6;
      for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
        const seatType = row <= 3 ? 'vip' : 'regular';
        const available = Math.random() > 0.3;
        
        seats.push({
          id: `${row}-${seatNum}`,
          row,
          number: seatNum,
          type: seatType,
          available,
          selected: false,
        });
      }
    }
    return seats;
  };

  // const [seats] = useState<Seat[]>(generateSeats());

  const miniPreview = useMemo(() => {
    // Build a tiny 8x5 preview map just for the time-slot card
    const rows = 5;
    const perRow = 8;
    return Array.from({ length: rows }, (_, r) =>
      Array.from({ length: perRow }, (_, c) => (r + c) % 4 === 0 ? 'u' : 'a')
    );
  }, []);




  const renderSeatMini = () => (
    <View style={styles.miniMapContainer}>
      {miniPreview.map((row, idx) => (
        <View key={idx} style={styles.miniRow}>
          {row.map((cell, i) => (
            <View
              key={i}
              style={[styles.miniSeat, cell === 'u' ? styles.miniUnavailable : styles.miniAvailable]}
            />
          ))}
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerArea}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialIcons name="keyboard-arrow-left" size={moderateScale(26)} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Typography variant="body1" weight="500" style={styles.title}>{movie.title}</Typography>
            <Typography variant="subTitle" weight='500' color={Colors.secondaryLight}>In Theaters December 22, 2021</Typography>
          </View>
          <View style={{ width: moderateScale(26) }} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.dateSection}>
          <Typography variant="body1" weight="500" style={styles.sectionTitle}>
            Date
          </Typography>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.datesContainer}>
              {dates?.map((date) => (
                <TouchableOpacity
                  key={date}
                  style={[
                    styles.dateButton,
                    selectedDate === date && { backgroundColor: Colors.buttonPrimary },
                  ]}
                  onPress={() => setSelectedDate(date)}
                  activeOpacity={0.8}
                >
                  <Typography
                    variant="subTitle"
                    weight='600'
                    color={selectedDate === date ? Colors.white : Colors.textPrimary}
                    style={{top:moderateScale(1)}}
                  >
                    {date}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.timeSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.timeSlotsRow}>
              {timeSlots.map((slot) => (
                <TouchableOpacity
                  key={slot.time}
                  style={[styles.slotCard, selectedTime === slot.time && styles.slotCardSelected]}
                  onPress={() => setSelectedTime(slot.time)}
                  activeOpacity={0.9}
                >
                  <Typography variant="body2" color={Colors.textSecondary}>
                    {slot.time}   {slot.hall}
                  </Typography>
                  <View style={styles.slotPreview}>{renderSeatMini()}</View>
                  <Typography variant="body2" color={Colors.secondaryLight}>
                    From {slot.price}$ or {slot.price * 50} bonus
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <Button
          label={'Select Seats'}
          onPress={() => navigation.navigate('PaymentScreen')}
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
    top:moderateScale(10)
  },
  title: {
    color: Colors.textPrimary,
    // marginBottom: moderateScale(2)
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(16),
    marginTop:moderateScale(70)
  },
  dateSection: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    marginBottom: verticalScale(8),
    color: '#000000',
  },
  datesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateButton: {
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(4),
    borderRadius: moderateScale(8),
    backgroundColor: Colors.gray30,
  },
  dateButtonSelected: {
    backgroundColor: Colors.buttonPrimary,
  },
  timeSection: {
    marginBottom: 32,
  },
  timeSlotsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  slotCard: {
    width: scale(280),
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: scale(12),
  },
  slotCardSelected: {
    borderColor: '#61C3F2',
    backgroundColor: '#F0F8FF',
  },
  slotPreview: {
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CFE8FF',
    padding: 8,
    backgroundColor: '#FAFDFF',
  },
  miniMapContainer: {
    alignSelf: 'stretch',
  },
  miniRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 4,
  },
  miniSeat: {
    width: 8,
    height: 8,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  miniAvailable: {
    backgroundColor: '#87CEEB',
  },
  miniUnavailable: {
    backgroundColor: '#DADADA',
  },
  seatMapContainer: {
    marginBottom: 24,
  },
  screenLabel: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666666',
  },
  seatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowLabel: {
    width: 30,
    textAlign: 'center',
    marginRight: 12,
  },
  seatsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  seat: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  seatRegular: {
    backgroundColor: '#87CEEB',
  },
  seatVip: {
    backgroundColor: '#6B46C1',
  },
  seatSelected: {
    backgroundColor: '#FFD700',
  },
  seatUnavailable: {
    backgroundColor: '#CCCCCC',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 2,
  },
  selectedSeatsContainer: {
    marginBottom: 24,
  },
  selectedSeatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  bottomContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
});

export default SeatSelectionScreen;
