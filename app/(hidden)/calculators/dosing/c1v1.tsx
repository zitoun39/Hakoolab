import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { BaseCalculator } from '@/src/components/calculators/BaseCalculator';
import { Input, Card, Button } from '@/src/components/ui';
import { useTheme } from '@/src/contexts/ThemeContext';
import { c1v1_c2v2 } from '@/src/utils/dosing';
import { fmt } from '@/src/utils/format';
import { toNum } from '@/src/utils/validation';

const C1V1_FORMULA_INFO = {
  title: 'قانون التخفيف C1V1 = C2V2',
  formula: `C1 × V1 = C2 × V2`
};

export default function C1V1CalculatorScreen() {
  const { theme } = useTheme();
  
  const [inputs, setInputs] = useState({
    C1: '12', V1: '', C2: '2', V2: '100'
  });
  
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof typeof inputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const calculate = () => {
    try {
      const inputValues = {
        C1: inputs.C1 ? toNum(inputs.C1) : undefined,
        V1: inputs.V1 ? toNum(inputs.V1) : undefined,
        C2: inputs.C2 ? toNum(inputs.C2) : undefined,
        V2: inputs.V2 ? toNum(inputs.V2) : undefined,
      };
      
      const definedCount = Object.values(inputValues).filter(v => v !== undefined).length;
      
      if (definedCount !== 3) {
        setError('يرجى إدخال 3 قيم بالضبط واترك الرابعة فارغة للحساب');
        return;
      }
      
      const result = c1v1_c2v2(inputValues);
      setResults(result);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'خطأ في الحساب');
      setResults(null);
    }
  };

  const renderResults = () => {
    if (!results) return null;
    return (
      <Card>
        <Text style={{ fontSize: 14, color: theme.colors.textSecondary, textAlign: 'right', marginBottom: 12, }}>
          النتيجة المحسوبة:
        </Text>
        <View style={{ gap: 8 }}>
          {'V1' in results && (<Text style={{ fontSize: 18, fontWeight: '600', color: theme.colors.primary, textAlign: 'right', }}>V1 = {fmt(results.V1, 'وحدة حجم')}</Text>)}
          {'V2' in results && (<Text style={{ fontSize: 18, fontWeight: '600', color: theme.colors.primary, textAlign: 'right', }}>V2 = {fmt(results.V2, 'وحدة حجم')}</Text>)}
          {'C1' in results && (<Text style={{ fontSize: 18, fontWeight: '600', color: theme.colors.primary, textAlign: 'right', }}>C1 = {fmt(results.C1, '%')}</Text>)}
          {'C2' in results && (<Text style={{ fontSize: 18, fontWeight: '600', color: theme.colors.primary, textAlign: 'right', }}>C2 = {fmt(results.C2, '%')}</Text>)}
        </View>
      </Card>
    );
  };

  return (
    <BaseCalculator
      title="C1V1 = C2V2 (تخفيف)"
      subtitle="حساب تخفيف المحاليل - أدخل 3 قيم واحسب الرابعة"
      error={error}
      results={renderResults()}
      formulaInfo={C1V1_FORMULA_INFO}
      warningMessage="تأكد من استخدام نفس وحدة الحجم (mL أو L) لكلا من V1 و V2."
      favId="/calculators/dosing/c1v1"
      favName="حاسبة C1V1 = C2V2"
      favRoute="/calculators/dosing/c1v1"
      favGroup="الجرعات"
    >
      <Input
        label="التركيز الأولي C1 (%)"
        value={inputs.C1}
        onChangeText={(value) => handleInputChange('C1', value)}
        placeholder="مثال: 12"
        containerStyle={{ marginBottom: 16 }}
        keyboardType="numeric"
      />
      <Input
        label="الحجم الأولي V1"
        value={inputs.V1}
        onChangeText={(value) => handleInputChange('V1', value)}
        placeholder="اتركه فارغاً إذا كان مجهولاً"
        containerStyle={{ marginBottom: 16 }}
        keyboardType="numeric"
      />
      <Input
        label="التركيز النهائي C2 (%)"
        value={inputs.C2}
        onChangeText={(value) => handleInputChange('C2', value)}
        placeholder="مثال: 2"
        containerStyle={{ marginBottom: 16 }}
        keyboardType="numeric"
      />
      <Input
        label="الحجم النهائي V2"
        value={inputs.V2}
        onChangeText={(value) => handleInputChange('V2', value)}
        placeholder="مثال: 100"
        containerStyle={{ marginBottom: 16 }}
        keyboardType="numeric"
      />
      <Button
        title="احسب"
        onPress={calculate}
        style={{ marginTop: 16 }}
      />
    </BaseCalculator>
  );
}