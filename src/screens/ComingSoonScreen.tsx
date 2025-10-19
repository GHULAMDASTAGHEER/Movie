import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '../components';
import { Colors } from '../utils/colors';
import { Fonts } from '../utils/fonts';
import { moderateScale, verticalScale } from 'react-native-size-matters';

const ComingSoonScreen = () => {
  return (
    <View style={styles.container}>
      <Typography 
        style={styles.text}
        variant="h2"
      >
        This feature is coming soon
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
  },
  text: {
    color: Colors.text,
    textAlign: 'center',
    fontFamily: Fonts.semiBold,
    fontSize: moderateScale(20),
  },
});

export default ComingSoonScreen;

