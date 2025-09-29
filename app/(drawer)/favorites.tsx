import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  Alert, 
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useFavoritesStore, Calculator as FavoriteItem } from '@/src/stores/favoritesStore';
// --- الخطوة 1: استيراد زر المفضلة ---
import { FavoriteButton } from '@/src/components/ui/FavoriteButton';

export default function FavoritesScreen() {
  const { theme } = useTheme();
  
  const favorites = useFavoritesStore((s) => s.favorites);
  const clearFavorites = useFavoritesStore((s) => s.clearFavorites);

  const handlePress = (item: FavoriteItem) => {
    router.push(item.route as any);
  };

  const handleClearAll = () => {
    Alert.alert(
      'مسح جميع المفضّلة',
      'هل أنت متأكد؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'مسح الكل', style: 'destructive', onPress: clearFavorites }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.fullScreen, { backgroundColor: theme.colors.background }]}>
      <FlatList
        // ListHeaderComponent لوضع العنوان في الأعلى
        ListHeaderComponent={() => (
          <View style={[styles.headerContainer, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.headerContent}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>الحاسبات المفضّلة</Text>
                {favorites.length > 0 && (
                  <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
                    {favorites.length} حاسبة مفضّلة
                  </Text>
                )}
              </View>
              {favorites.length > 0 && (
                <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
                  <Text style={{ color: theme.colors.error }}>مسح الكل</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        
        data={favorites}
        keyExtractor={(item) => item.id}

        // --- الخطوة 2: تعديل renderItem لإضافة الزر الجديد ---
        renderItem={({ item }) => (
          <View style={[styles.itemOuterContainer]}>
            <TouchableOpacity onPress={() => handlePress(item)} style={styles.itemTouchable}>
                <Text style={[styles.itemTitle, { color: theme.colors.text }]}>{item.name}</Text>
                <Feather name="chevron-left" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            {/* هذا هو الزر الجديد الذي طلبته */}
            <FavoriteButton calculator={item} size={22} />
          </View>
        )}
        
        // ListEmptyComponent عندما تكون القائمة فارغة
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Feather name="star" size={48} color={theme.colors.textSecondary} style={{ marginBottom: 16 }} />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>لا توجد عناصر مفضلة بعد</Text>
          </View>
        )}
        contentContainerStyle={styles.listContentContainer}
      />
    </SafeAreaView>
  );
}

// --- الخطوة 3: تحديث الأنماط لتناسب التصميم الجديد ---
const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24, // زيادة المسافة السفلية
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'right'
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign: 'right',
    marginTop: 4
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FF3B3020',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 100, // لإبعاده عن العنوان
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  listContentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  // حاوية جديدة لكل عنصر لتفصل بين زر التفضيل وباقي العنصر
  itemOuterContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
    borderColor: '#E0E0E0', // لون إطار موحد
    paddingLeft: 8, // مسافة لزر التفضيل
  },
  // الجزء القابل للضغط من العنصر (يأخذك للحاسبة)
  itemTouchable: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  itemTitle: {
    flex: 1, // يأخذ كل المساحة المتاحة
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
    marginRight: 8,
  },
});