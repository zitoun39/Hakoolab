import React from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@/src/contexts/ThemeContext';

interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  padding?: boolean;
  safeArea?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  showsVerticalScrollIndicator?: boolean;
  statusBarStyle?: 'light' | 'dark';
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  scrollable = false,
  padding = true,
  safeArea = true,
  style,
  contentContainerStyle,
  showsVerticalScrollIndicator = false,
  statusBarStyle,
}) => {
  const { theme, isDark } = useTheme();

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: theme.colors.background,
  };

  const contentStyle: ViewStyle = {
    ...(padding && { padding: theme.spacing.md }),
    ...contentContainerStyle,
  };

  const statusBarStyleResolved = statusBarStyle || (isDark ? 'light' : 'dark');

  const renderContent = () => {
    if (scrollable) {
      return (
        <ScrollView
          style={[containerStyle, style]}
          contentContainerStyle={contentStyle}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      );
    }

    return (
      <View style={[containerStyle, style]}>
        <View style={contentStyle}>
          {children}
        </View>
      </View>
    );
  };

  if (safeArea) {
    return (
      <>
        <StatusBar
          barStyle={`${statusBarStyleResolved}-content`}
          backgroundColor={theme.colors.background}
        />
        <SafeAreaView style={containerStyle}>
          {renderContent()}
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <StatusBar
        barStyle={`${statusBarStyleResolved}-content`}
        backgroundColor={theme.colors.background}
      />
      {renderContent()}
    </>
  );
};

const styles = StyleSheet.create({
  // Add any additional styles if needed
});