import React from 'react';
import { View, ViewStyle, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/src/contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outline';
  padding?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  onTouchEnd?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  padding = 'md',
  onPress,
  onTouchEnd,
}) => {
  const { theme } = useTheme();

  const getCardStyle = () => {
    const baseStyle = {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing[padding],
    };

    switch (variant) {
      case 'elevated':
        return { ...baseStyle, ...theme.shadows.md };
      case 'outline':
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      default:
        return baseStyle;
    }
  };

  const Component = (onPress || onTouchEnd ? TouchableOpacity : View) as React.ComponentType<any>;
  
  return (
    <Component 
      style={[getCardStyle(), style]} 
      onPress={onPress}
      onTouchEnd={onTouchEnd}
      activeOpacity={onPress || onTouchEnd ? 0.7 : 1}
    >
      {children}
    </Component>
  );
};

const styles = StyleSheet.create({
  // Add any additional styles if needed
});