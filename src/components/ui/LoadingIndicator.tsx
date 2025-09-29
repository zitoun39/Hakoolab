import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/src/contexts/ThemeContext';

interface LoadingIndicatorProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  overlay?: boolean;
  style?: ViewStyle;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'large',
  color,
  message,
  overlay = false,
  style,
}) => {
  const { theme } = useTheme();

  const resolvedColor = color || theme.colors.primary;

  const containerStyle: ViewStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    ...(overlay && {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.background + 'CC', // Semi-transparent
      zIndex: 1000,
    }),
  };

  return (
    <View style={[containerStyle, style]}>
      <ActivityIndicator size={size} color={resolvedColor} />
      {message && (
        <Text
          style={[
            styles.message,
            {
              color: theme.colors.textSecondary,
              marginTop: theme.spacing.md,
            },
          ]}
        >
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
});