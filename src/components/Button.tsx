import React, { FC } from 'react';
import { StyleProp, TextStyle, ViewStyle, Pressable, Text, ActivityIndicator } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Colors } from '../utils/colors';
import { Fonts } from '../utils/fonts';

interface iProps {
  label: string;
  loading?: boolean;
  onPress?: () => void;
  borderColor?: string;
  disabled?: boolean;
  activityIndicatorColor?: string;
  translationEnabled?: boolean;
  backgroundColor?: string;
  borderWidth?: number;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  paddingVertical?: number;
  paddingHorizontal?: number;
  lineHeight?: number;
}

const CustomButton: FC<iProps & TextStyle & StyleProp<ViewStyle>> = ({
  onPress,
  label,
  backgroundColor,
  borderWidth,
  borderColor,
  width,
  height,
  alignSelf,
  borderRadius,
  marginTop,
  marginBottom,
  marginRight,
  marginLeft,
  fontSize,
  color,
  fontFamily,
  loading,
  disabled,
  translationEnabled = true,
  paddingVertical,
  paddingHorizontal,
  lineHeight,
}) => {
  return (
    <Pressable
      onPress={disabled || loading ? undefined : onPress}
      disabled={disabled || !onPress || loading}
      style={({ pressed }) => ({
        backgroundColor: disabled ? Colors?.gray : backgroundColor || Colors?.primary,
        borderWidth: borderWidth,
        borderColor: borderColor || Colors?.white,
        width: width || '100%',
        height: height || 50,
        alignSelf: alignSelf || 'center',
        marginRight: marginRight,
        marginTop: marginTop,
        marginLeft: marginLeft,
        marginBottom: marginBottom,
        borderRadius: borderRadius || 10,
        paddingHorizontal: paddingHorizontal || moderateScale(16),
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.8 : 1,
      })}
    >
      {loading ? (
        <ActivityIndicator color={color || Colors?.white} />
      ) : (
        <Text
          maxFontSizeMultiplier={1}
          style={{
            fontSize: fontSize || moderateScale(16),
            color: color || Colors?.white,
            fontFamily: fontFamily || Fonts.bold,
            lineHeight: lineHeight,
            top:moderateScale(2),
          }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
};

export default CustomButton;

