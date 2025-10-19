import React from 'react';
import { Image as RNImage, ImageProps as RNImageProps, StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

interface ImageProps extends RNImageProps {
}

const Image: React.FC<ImageProps> = ({
  style,
  ...props
}) => {  

  return (
    <RNImage
      style={[styles.image, style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
  },
});

export default Image;
