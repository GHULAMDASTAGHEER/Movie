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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../utils/colors';
import { Movie } from '../types/movie';
import { Image } from '../components';
import { IMAGES } from '../assets';
import { Fonts } from '../utils/fonts';

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
  const [selectedHall, setSelectedHall] = useState('Hall 1');
  const navigation = useNavigation();
  const route = useRoute();
  const { movie } = route.params as RouteParams;

  const dates = ['5 Mar', '6 Mar', '7 Mar', '8 Mar', '9 Mar'];
  const timeSlots = [
    { time: '12:30', hall: 'Cinetech + Hall 1', price: 50 },
    { time: '13:30', hall: 'Cinetech + Hall 1', price: 75 },
    { time: '15:00', hall: 'Cinetech + Hall 2', price: 60 },
  ];
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
                <View style={{flexDirection: 'column',}}>
                 <Typography variant="subTitle" weight='500' color={Colors.textPrimary}>
                    {slot.time}  <Typography variant="subTitle" weight='500' color={Colors.gray20}>
                   {slot.hall}
                  </Typography>
                </Typography>
                <TouchableOpacity
                  key={slot.time}
                  style={[styles.slotCard, selectedTime === slot.time && styles.slotCardSelected]}
                  onPress={() => {
                    setSelectedTime(slot.time);
                    setSelectedHall(slot.hall);
                  }}
                  activeOpacity={0.9}
                >
                 <Image
                 source={IMAGES.Seat}
                 style={{width:moderateScale(144), height:moderateScale(113), alignSelf:'center'}}
                 />
                
                </TouchableOpacity>
                <Typography variant="subTitle" weight='500' color={'#202C43'}
                style={{marginTop:moderateScale(8)}}>
                    From {slot.price}$ or {slot.price * 50} bonus
                  </Typography>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <Button
          label={'Select Seats'}
          onPress={() => navigation.navigate('PaymentScreen', {
            movie,
            selectedSeats: [],
            selectedDate,
            selectedTime,
            selectedHall,
            totalPrice: 0,
          })}
          fontSize={moderateScale(14)}
          fontFamily={Fonts.semiBold}
          backgroundColor={Colors.buttonPrimary}
          marginBottom={moderateScale(20)}
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
    width: moderateScale(245),
    padding: 16,
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: moderateScale(5),
  },
  slotCardSelected: {
    borderColor: '#61C3F2',
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
  bottomContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.background,
  },
});

export default SeatSelectionScreen;
