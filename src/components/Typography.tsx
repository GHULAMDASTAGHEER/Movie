import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Fonts } from '../utils/fonts';
import { Colors } from '../utils/colors';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body1' | 'body2' | 'caption' | 'subTitle';
  color?: string;
  weight?: 'normal' | 'bold' | '600' | '700';
}

const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  color = Colors.textPrimary,
  weight = 'normal',
  style,
  children,
  ...props
}) => {
  const getFontSize = () => {
    switch (variant) {
      case 'h1': return moderateScale(32);
      case 'h2': return moderateScale(24);
      case 'h3': return moderateScale(20);
      case 'h4': return moderateScale(18);
      case 'body1': return moderateScale(16);
      case 'body2': return moderateScale(14);
      case 'caption': return moderateScale(12);
      case 'subTitle': return moderateScale(12);
      default: return moderateScale(16);
    }
  };

  const getFontWeight = () => {
    switch (weight) {
      case 'bold': return 'bold';
      case '600': return '600';
      case '700': return '700';
      default: return 'normal';
    }
  };

  const getFontFamily = () => {
    switch (weight) {
      case 'bold': return Fonts.bold;
      case '600': return Fonts.semiBold;
      case '700': return Fonts.bold;
      default: return Fonts.regular;
    }
  };

  return (
    <Text
      style={[
        styles.text,
        {
          fontSize: getFontSize(),
          fontWeight: getFontWeight(),
          color,
          fontFamily: getFontFamily(),
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: Fonts.regular,
  },
});

export default Typography;
