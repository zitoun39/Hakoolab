import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@/src/contexts/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const { theme } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const sizeStyles = {
      sm: { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.md },
      md: { paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.lg },
      lg: { paddingVertical: theme.spacing.lg, paddingHorizontal: theme.spacing.xl },
    };

    const baseStyle: ViewStyle = {
      borderRadius: theme.radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: iconPosition === 'right' ? 'row-reverse' : 'row',
      opacity: disabled || loading ? 0.6 : 1,
      ...sizeStyles[size],
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.secondary,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.primary,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const sizeStyles = {
      sm: { fontSize: 14 },
      md: { fontSize: 16 },
      lg: { fontSize: 18 },
    };

    const baseTextStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
      ...sizeStyles[size],
    };

    switch (variant) {
      case 'primary':
      case 'secondary':
        return {
          ...baseTextStyle,
          color: '#ffffff',
        };
      case 'outline':
      case 'ghost':
        return {
          ...baseTextStyle,
          color: theme.colors.primary,
        };
      default:
        return baseTextStyle;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' || variant === 'secondary' ? '#ffffff' : theme.colors.primary} 
        />
      );
    }

    return (
      <>
        {icon && iconPosition === 'left' && (
          <React.Fragment>
            {icon}
            <View style={{ width: theme.spacing.sm }} />
          </React.Fragment>
        )}
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        {icon && iconPosition === 'right' && (
          <React.Fragment>
            <View style={{ width: theme.spacing.sm }} />
            {icon}
          </React.Fragment>
        )}
      </>
    );
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Add any additional styles if needed
});