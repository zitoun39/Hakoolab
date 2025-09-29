import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { Screen, Button, Card, Input, LoadingIndicator } from '@/src/components/ui';
import { ThemeToggle } from '@/src/components/ui/ThemeToggle';
import { BaseCalculator } from '@/src/components/calculators';
import { useTheme } from '@/src/contexts/ThemeContext';

export default function TestComponentsScreen() {
  const { theme } = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTestCalculation = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('تم!', 'اختبار الحساب مكتمل');
    }, 2000);
  };

  const renderTestResults = () => (
    <View>
      <Card style={{ marginBottom: 16 }}>
        <Text style={{ color: theme.colors.text, fontSize: 16, textAlign: 'right' }}>
          نتيجة الاختبار: {inputValue || 'لا توجد قيمة'}
        </Text>
      </Card>
    </View>
  );

  return (
    <BaseCalculator
      title="اختبار المكونات الجديدة"
      subtitle="صفحة تجريبية للتحقق من عمل النظام الجديد"
      isCalculating={loading}
      results={inputValue ? renderTestResults() : undefined}
      formulaInfo={{
        title: 'اختبار النظام',
        formula: 'هذه صفحة اختبار للتحقق من:\n• نظام الألوان والمظهر\n• المكونات القابلة لإعادة الاستخدام\n• النماذج والأزرار\n• حالات التحميل'
      }}
    >
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Input Test */}
      <Input
        label="قيمة الاختبار"
        value={inputValue}
        onChangeText={setInputValue}
        placeholder="أدخل أي قيمة للاختبار"
        helpText="هذا مثال على النص المساعد"
        containerStyle={{ marginVertical: 16 }}
      />

      {/* Button Tests */}
      <View style={{ gap: 12, marginVertical: 16 }}>
        <Button
          title="اختبار الحساب"
          onPress={handleTestCalculation}
          variant="primary"
          disabled={!inputValue}
          loading={loading}
        />
        
        <View style={{ flexDirection: 'row-reverse', gap: 8 }}>
          <Button
            title="ثانوي"
            onPress={() => Alert.alert('اختبار', 'زر ثانوي')}
            variant="secondary"
            size="sm"
            style={{ flex: 1 }}
          />
          <Button
            title="محدد"
            onPress={() => Alert.alert('اختبار', 'زر محدد')}
            variant="outline"
            size="sm"
            style={{ flex: 1 }}
          />
          <Button
            title="شفاف"
            onPress={() => Alert.alert('اختبار', 'زر شفاف')}
            variant="ghost"
            size="sm"
            style={{ flex: 1 }}
          />
        </View>
      </View>

      {/* Card Tests */}
      <View style={{ gap: 12, marginVertical: 16 }}>
        <Card variant="default">
          <Text style={{ color: theme.colors.text, textAlign: 'right' }}>
            بطاقة افتراضية
          </Text>
        </Card>
        
        <Card variant="elevated">
          <Text style={{ color: theme.colors.text, textAlign: 'right' }}>
            بطاقة مرتفعة مع ظل
          </Text>
        </Card>
        
        <Card variant="outline">
          <Text style={{ color: theme.colors.text, textAlign: 'right' }}>
            بطاقة محددة
          </Text>
        </Card>
      </View>

      {/* Loading Test */}
      {loading && (
        <LoadingIndicator
          message="جاري المعالجة..."
          style={{ marginVertical: 16 }}
        />
      )}

      {/* Status */}
      <Card style={{ 
        backgroundColor: theme.colors.success + '20',
        borderWidth: 1,
        borderColor: theme.colors.success,
        marginTop: 16
      }}>
        <Text style={{ 
          color: theme.colors.success, 
          textAlign: 'right',
          fontWeight: '600'
        }}>
          ✅ جميع المكونات تعمل بشكل صحيح
        </Text>
      </Card>
    </BaseCalculator>
  );
}