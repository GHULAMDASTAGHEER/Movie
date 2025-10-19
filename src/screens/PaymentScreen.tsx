import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Typography from '../components/Typography';
import Button from '../components/Button';
import { Movie, Seat } from '../types/movie';

interface RouteParams {
  movie: Movie;
  selectedSeats: Seat[];
  selectedDate: string;
  selectedTime: string;
  totalPrice: number;
}

const PaymentScreen: React.FC = () => {
  const [processing, setProcessing] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { movie, selectedSeats, selectedDate, selectedTime, totalPrice } = route.params as RouteParams;

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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h2" weight="bold" style={styles.title}>
          Payment
        </Typography>
      </View>

      <View style={styles.content}>
        <View style={styles.movieInfo}>
          <Typography variant="h3" weight="bold" style={styles.movieTitle}>
            {movie.title}
          </Typography>
          <Typography variant="body1" color="#666666">
            {selectedDate} | {selectedTime}
          </Typography>
        </View>

        <View style={styles.seatsInfo}>
          <Typography variant="h3" weight="bold" style={styles.sectionTitle}>
            Selected Seats
          </Typography>
          {selectedSeats.map((seat) => (
            <View key={seat.id} style={styles.seatItem}>
              <Typography variant="body1">
                Row {seat.row}, Seat {seat.number} - {seat.type.toUpperCase()}
              </Typography>
              <Typography variant="body1" weight="bold">
                ${seat.type === 'vip' ? '150' : '50'}
              </Typography>
            </View>
          ))}
        </View>

        <View style={styles.totalContainer}>
          <Typography variant="h2" weight="bold">
            Total: ${totalPrice}
          </Typography>
        </View>

        <View style={styles.paymentSection}>
          <Typography variant="h3" weight="bold" style={styles.sectionTitle}>
            Payment Method
          </Typography>
          <View style={styles.paymentMethod}>
            <Typography variant="body1">💳 Credit Card ending in 1234</Typography>
          </View>
        </View>

        <Button
          title={processing ? 'Processing...' : 'Complete Payment'}
          onPress={handlePayment}
          variant="primary"
          disabled={processing}
          style={styles.paymentButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    color: '#000000',
  },
  content: {
    paddingHorizontal: 16,
  },
  movieInfo: {
    marginBottom: 32,
  },
  movieTitle: {
    color: '#000000',
    marginBottom: 8,
  },
  seatsInfo: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
    color: '#000000',
  },
  seatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 2,
    borderTopColor: '#E0E0E0',
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
    marginBottom: 32,
  },
  paymentSection: {
    marginBottom: 32,
  },
  paymentMethod: {
    padding: 16,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  paymentButton: {
    marginBottom: 32,
  },
});

export default PaymentScreen;
