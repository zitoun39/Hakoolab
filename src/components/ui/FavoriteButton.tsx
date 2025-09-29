import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavoritesStore, Calculator } from '@/src/stores/favoritesStore';

// واجهة الخصائص
interface FavoriteButtonProps {
  calculator: Calculator;
  size?: number;
  variant?: string; // <-- تمت إضافة هذه الخاصية هنا
}

export const FavoriteButton = ({ calculator, size = 28 }: FavoriteButtonProps) => {
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorited = useFavoritesStore((state) => state.isFavorite(calculator.id));

  const handlePress = () => {
    toggleFavorite(calculator);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.button}>
      <Ionicons
        name={isFavorited ? 'heart' : 'heart-outline'}
        size={size}
        color={isFavorited ? '#E91E63' : '#8E8E93'}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FavoriteButton;