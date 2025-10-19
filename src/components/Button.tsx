import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Typography from './Typography';
import { Colors } from '../utils/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: moderateScale(8),
      alignItems: 'center',
      justifyContent: 'center',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? Colors.lightGray : Colors.secondary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? Colors.lightGray : Colors.primary,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: moderateScale(1),
          borderColor: disabled ? Colors.lightGray : Colors.secondary,
        };
      default:
        return baseStyle;
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return { 
          paddingVertical: verticalScale(8), 
          paddingHorizontal: scale(16) 
        };
      case 'large':
        return { 
          paddingVertical: verticalScale(16), 
          paddingHorizontal: scale(24) 
        };
      default:
        return { 
          paddingVertical: verticalScale(12), 
          paddingHorizontal: scale(20) 
        };
    }
  };

  const getTextColor = (): string => {
    if (disabled) return Colors.gray;
    if (variant === 'outline') return Colors.secondary;
    return Colors.textWhite;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), getSizeStyle(), style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Typography
        variant="body1"
        color={getTextColor()}
        weight="600"
        style={styles.buttonText}
      >
        {title}
      </Typography>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    textAlign: 'center',
  },
});

export default Button;
