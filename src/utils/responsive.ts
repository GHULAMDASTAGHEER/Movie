import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export const Responsive = {
  // Font sizes
  fontSize: {
    h1: moderateScale(32),
    h2: moderateScale(24),
    h3: moderateScale(20),
    body1: moderateScale(16),
    body2: moderateScale(14),
    caption: moderateScale(12),
  },

  // Spacing
  spacing: {
    xs: scale(4),
    sm: scale(8),
    md: scale(16),
    lg: scale(24),
    xl: scale(32),
  },

  // Vertical spacing
  verticalSpacing: {
    xs: verticalScale(4),
    sm: verticalScale(8),
    md: verticalScale(16),
    lg: verticalScale(24),
    xl: verticalScale(32),
  },

  // Border radius
  borderRadius: {
    sm: moderateScale(4),
    md: moderateScale(8),
    lg: moderateScale(12),
    xl: moderateScale(16),
  },

  // Image sizes
  imageSizes: {
    poster: {
      width: scale(120),
      height: verticalScale(180),
    },
    backdrop: {
      width: '100%' as const,
      height: verticalScale(200),
    },
    profile: {
      width: scale(40),
      height: verticalScale(40),
    },
    icon: {
      width: scale(24),
      height: verticalScale(24),
    },
  },

  // Button sizes
  buttonSizes: {
    small: {
      paddingVertical: verticalScale(8),
      paddingHorizontal: scale(16),
    },
    medium: {
      paddingVertical: verticalScale(12),
      paddingHorizontal: scale(20),
    },
    large: {
      paddingVertical: verticalScale(16),
      paddingHorizontal: scale(24),
    },
  },
};
