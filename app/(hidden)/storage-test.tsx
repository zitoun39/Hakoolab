import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { BaseCalculator } from '@/src/components/calculators/BaseCalculator';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { useTheme } from '@/src/contexts/ThemeContext';
import { useFavoritesStore } from '@/src/stores/favoritesStore';
import { StorageDebugger } from '@/src/utils/storageDebug';

export default function StorageTestScreen() {
  const { theme } = useTheme();
  const { hasHydrated, favorites, error, clear } = useFavoritesStore();
  const [testResults, setTestResults] = useState<any>(null);
  const [storageInfo, setStorageInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Auto-load storage info on mount
    loadStorageInfo();
  }, []);

  const runStorageTest = async () => {
    setIsLoading(true);
    try {
      const result = await StorageDebugger.testAsyncStorage();
      setTestResults(result);
      
      if (!result.success) {
        Alert.alert(
          'مشكلة في التخزين',
          `فشل اختبار AsyncStorage: ${result.error}`,
          [{ text: 'موافق' }]
        );
      } else {
        Alert.alert(
          'نجح الاختبار',
          'AsyncStorage يعمل بشكل صحيح',
          [{ text: 'ممتاز' }]
        );
      }
    } catch (error: any) {
      Alert.alert('خطأ', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStorageInfo = async () => {
    try {
      const info = await StorageDebugger.getFavoritesStorageInfo();
      setStorageInfo(info);
    } catch (error) {
      console.error('Error loading storage info:', error);
    }
  };

  const clearStorage = async () => {
    Alert.alert(
      'مسح التخزين',
      'هل تريد مسح جميع بيانات التطبيق المحفوظة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'مسح',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageDebugger.clearAllAppStorage();
              await loadStorageInfo();
              Alert.alert('تم المسح', 'تم مسح جميع البيانات المحفوظة');
            } catch (error: any) {
              Alert.alert('خطأ', error.message);
            }
          }
        }
      ]
    );
  };

  const addTestFavorite = () => {
    const testItem = {
      key: `/test-${Date.now()}`,
      title: `اختبار ${new Date().toLocaleTimeString('ar')}`,
      route: '/test',
      group: 'اختبار'
    };
    
    useFavoritesStore.getState().toggle(testItem);
    setTimeout(loadStorageInfo, 100); // Reload info after a short delay
  };

  return (
    <BaseCalculator
      title="اختبار التخزين"
      subtitle="أداة تشخيص مشاكل حفظ المفضّلة"
      isCalculating={isLoading}
      error={error}
    >
      {/* Store Status */}
      <Card style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text, textAlign: 'right', marginBottom: 8 }}>
          حالة المتجر
        </Text>
        <View style={{ gap: 4 }}>
          <Text style={{ color: theme.colors.text, textAlign: 'right' }}>
            حالة التحميل: {hasHydrated ? '✅ محمّل' : '⏳ جاري التحميل'}
          </Text>
          <Text style={{ color: theme.colors.text, textAlign: 'right' }}>
            عدد المفضّلة: {Object.keys(favorites).length}
          </Text>
          {error && (
            <Text style={{ color: theme.colors.error, textAlign: 'right' }}>
              خطأ: {error}
            </Text>
          )}
        </View>
      </Card>

      {/* Storage Info */}
      {storageInfo && (
        <Card style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text, textAlign: 'right', marginBottom: 8 }}>
            معلومات التخزين
          </Text>
          <View style={{ gap: 4 }}>
            <Text style={{ color: theme.colors.text, textAlign: 'right' }}>
              موجود: {storageInfo.exists ? '✅ نعم' : '❌ لا'}
            </Text>
            <Text style={{ color: theme.colors.text, textAlign: 'right' }}>
              حجم البيانات: {storageInfo.size} حرف
            </Text>
            <Text style={{ color: theme.colors.text, textAlign: 'right' }}>
              المنصة: {storageInfo.platform}
            </Text>
            {storageInfo.parsedData && (
              <Text style={{ color: theme.colors.text, textAlign: 'right' }}>
                البيانات المحللة: {JSON.stringify(storageInfo.parsedData.state?.favorites || {}, null, 2)}
              </Text>
            )}
          </View>
        </Card>
      )}

      {/* Test Results */}
      {testResults && (
        <Card style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text, textAlign: 'right', marginBottom: 8 }}>
            نتائج الاختبار
          </Text>
          <Text style={{ 
            color: testResults.success ? theme.colors.success : theme.colors.error, 
            textAlign: 'right',
            fontSize: 14 
          }}>
            {testResults.success ? '✅ نجح الاختبار' : `❌ فشل: ${testResults.error}`}
          </Text>
        </Card>
      )}

      {/* Action Buttons */}
      <View style={{ gap: 12 }}>
        <Button
          title="اختبار AsyncStorage"
          onPress={runStorageTest}
          disabled={isLoading}
        />
        
        <Button
          title="إعادة تحميل معلومات التخزين"
          onPress={loadStorageInfo}
          variant="outline"
        />
        
        <Button
          title="إضافة مفضّلة تجريبية"
          onPress={addTestFavorite}
          variant="outline"
        />
        
        <Button
          title="مسح جميع البيانات"
          onPress={clearStorage}
          variant="outline"
          style={{ borderColor: theme.colors.error, backgroundColor: theme.colors.error + '10' }}
          textStyle={{ color: theme.colors.error }}
        />
      </View>
    </BaseCalculator>
  );
}