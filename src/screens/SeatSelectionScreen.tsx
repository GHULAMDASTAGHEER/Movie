import React, { useState } from 'react';
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
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { movie } = route.params as RouteParams;

  const dates = ['5 Mar', '6 Mar', '7 Mar', '8 Mar', '9 Mar'];
  const timeSlots = [
    { time: '12:30', hall: 'Cinetech + Hall 1', price: 50 },
    { time: '13:30', hall: 'Cinetech', price: 75 },
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

  const [seats] = useState<Seat[]>(generateSeats());

  const handleSeatPress = (seat: Seat) => {
    if (!seat.available) return;

    setSelectedSeats(prev => {
      const isSelected = prev.some(s => s.id === seat.id);
      if (isSelected) {
        return prev.filter(s => s.id !== seat.id);
      } else {
        return [...prev, { ...seat, selected: true }];
      }
    });
  };

  const removeSeat = (seatId: string) => {
    setSelectedSeats(prev => prev.filter(s => s.id !== seatId));
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => {
      return total + (seat.type === 'vip' ? 150 : 50);
    }, 0);
  };

  const handleProceedToPay = () => {
    if (selectedSeats.length === 0) {
      return;
    }
    (navigation as any).navigate('Payment', {
      movie,
      selectedSeats,
      selectedDate,
      selectedTime,
      totalPrice: getTotalPrice(),
    });
  };

  const getSeatStyle = (seat: Seat) => {
    if (!seat.available) return styles.seatUnavailable;
    if (selectedSeats.some(s => s.id === seat.id)) return styles.seatSelected;
    if (seat.type === 'vip') return styles.seatVip;
    return styles.seatRegular;
  };

  const renderSeatMap = () => {
    const rows = Array.from({ length: 14 }, (_, i) => i + 1);
    
    return (
      <View style={styles.seatMapContainer}>
        <Typography variant="h3" weight="bold" style={styles.screenLabel}>
          SCREEN
        </Typography>
        
        {rows.map(row => {
          const rowSeats = seats.filter(seat => seat.row === row);
          return (
            <View key={row} style={styles.seatRow}>
              <Typography variant="body2" style={styles.rowLabel}>
                {row}
              </Typography>
              <View style={styles.seatsContainer}>
                {rowSeats.map(seat => (
                  <TouchableOpacity
                    key={seat.id}
                    style={[styles.seat, getSeatStyle(seat)]}
                    onPress={() => handleSeatPress(seat)}
                  />
                ))}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderLegend = () => (
    <View style={styles.legend}>
      <View style={styles.legendItem}>
        <View style={[styles.legendColor, styles.seatSelected]} />
        <Typography variant="body2">Selected</Typography>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendColor, styles.seatUnavailable]} />
        <Typography variant="body2">Not available</Typography>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendColor, styles.seatVip]} />
        <Typography variant="body2">VIP (150$)</Typography>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendColor, styles.seatRegular]} />
        <Typography variant="body2">Regular (50$)</Typography>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h2" weight="bold" style={styles.title}>
          {movie.title}
        </Typography>
        <Typography variant="body1" color="#666666">
          March 5, 2021 | 12:30 Hall 1
        </Typography>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.dateSection}>
          <Typography variant="h3" weight="bold" style={styles.sectionTitle}>
            Date
          </Typography>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.datesContainer}>
              {dates.map((date) => (
                <TouchableOpacity
                  key={date}
                  style={[
                    styles.dateButton,
                    selectedDate === date && styles.dateButtonSelected,
                  ]}
                  onPress={() => setSelectedDate(date)}
                >
                  <Typography
                    variant="body1"
                    color={selectedDate === date ? '#FFFFFF' : '#000000'}
                  >
                    {date}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.timeSection}>
          <Typography variant="h3" weight="bold" style={styles.sectionTitle}>
            Time
          </Typography>
          <View style={styles.timeSlots}>
            {timeSlots.map((slot) => (
              <TouchableOpacity
                key={slot.time}
                style={[
                  styles.timeSlot,
                  selectedTime === slot.time && styles.timeSlotSelected,
                ]}
                onPress={() => setSelectedTime(slot.time)}
              >
                <Typography variant="h3" weight="bold">
                  {slot.time}
                </Typography>
                <Typography variant="body2" color="#666666">
                  {slot.hall}
                </Typography>
                <Typography variant="body2" color="#007AFF">
                  From {slot.price}$ or {slot.price * 50} bonus
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {renderSeatMap()}
        {renderLegend()}

        {selectedSeats.length > 0 && (
          <View style={styles.selectedSeatsContainer}>
            <Typography variant="h3" weight="bold" style={styles.sectionTitle}>
              Selected Seats
            </Typography>
            {selectedSeats.map((seat) => (
              <View key={seat.id} style={styles.selectedSeatItem}>
                <Typography variant="body1">
                  {seat.row}/{seat.number} row X
                </Typography>
                <TouchableOpacity onPress={() => removeSeat(seat.id)}>
                  <Typography variant="body1" color="#FF0000">✕</Typography>
                </TouchableOpacity>
              </View>
            ))}
            <View style={styles.totalContainer}>
              <Typography variant="h3" weight="bold">
                Total Price
              </Typography>
              <Typography variant="h3" weight="bold" color="#007AFF">
                $ {getTotalPrice()}
              </Typography>
            </View>
          </View>
        )}
      </ScrollView>

      {selectedSeats.length > 0 && (
        <View style={styles.bottomContainer}>
          <Button
            title="Proceed to pay"
            onPress={handleProceedToPay}
            variant="primary"
            style={styles.proceedButton}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(60),
    paddingBottom: verticalScale(20),
  },
  title: {
    color: '#000000',
    marginBottom: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(16),
  },
  dateSection: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    marginBottom: verticalScale(12),
    color: '#000000',
  },
  datesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  dateButtonSelected: {
    backgroundColor: '#007AFF',
  },
  timeSection: {
    marginBottom: 32,
  },
  timeSlots: {
    gap: 12,
  },
  timeSlot: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  timeSlotSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
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
  proceedButton: {
    width: '100%',
  },
});

export default SeatSelectionScreen;
