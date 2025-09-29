import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Moon, Sun, Monitor } from 'lucide-react-native';
import { useTheme } from '@/src/contexts/ThemeContext';
import { Button } from './Button';
import { Card } from './Card';

export const ThemeToggle: React.FC = () => {
  const { theme, themeMode, setThemeMode, isDark } = useTheme();

  const themeOptions = [
    { mode: 'light' as const, label: 'فاتح', icon: <Sun size={16} color={theme.colors.text} /> },
    { mode: 'dark' as const, label: 'داكن', icon: <Moon size={16} color={theme.colors.text} /> },
    { mode: 'auto' as const, label: 'تلقائي', icon: <Monitor size={16} color={theme.colors.text} /> },
  ];

  return (
    <Card style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        وضع المظهر
      </Text>
      <View style={styles.buttonContainer}>
        {themeOptions.map((option) => (
          <Button
            key={option.mode}
            title={option.label}
            onPress={() => setThemeMode(option.mode)}
            variant={themeMode === option.mode ? 'primary' : 'outline'}
            size="sm"
            icon={option.icon}
            iconPosition="right"
            style={styles.themeButton}
          />
        ))}
      </View>
      <Text style={[styles.currentMode, { color: theme.colors.textSecondary }]}>
        الوضع الحالي: {isDark ? 'داكن' : 'فاتح'}
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row-reverse',
    gap: 8,
    marginBottom: 8,
  },
  themeButton: {
    flex: 1,
  },
  currentMode: {
    fontSize: 12,
    textAlign: 'right',
  },
});