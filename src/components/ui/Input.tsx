import React from 'react';
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/src/contexts/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helpText?: string;
  containerStyle?: ViewStyle;
  variant?: 'default' | 'outline' | 'filled';
  size?: 'sm' | 'md' | 'lg';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
  containerStyle,
  variant = 'outline',
  size = 'md',
  style,
  ...props
}) => {
  const { theme } = useTheme();

  const getInputStyle = () => {
    const sizeStyles = {
      sm: { padding: theme.spacing.sm, fontSize: 14 },
      md: { padding: theme.spacing.md, fontSize: 16 },
      lg: { padding: theme.spacing.lg, fontSize: 18 },
    };

    const baseStyle = {
      borderRadius: theme.radius.md,
      color: theme.colors.text,
      textAlign: 'right' as const,
      ...sizeStyles[size],
    };

    switch (variant) {
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.surfaceVariant,
          borderWidth: 0,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: error ? theme.colors.error : theme.colors.border,
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: theme.colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: error ? theme.colors.error : theme.colors.border,
        };
    }
  };

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[getInputStyle(), style]}
        placeholderTextColor={theme.colors.textSecondary}
        keyboardType="decimal-pad"
        {...props}
      />
      {error && (
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
      {helpText && !error && (
        <Text style={[styles.helpText, { color: theme.colors.textSecondary }]}>
          {helpText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'right',
  },
  error: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  helpText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
});