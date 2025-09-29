import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { BaseCalculator } from '@/src/components/calculators/BaseCalculator';
import { Input, Card } from '@/src/components/ui';
import { useTheme } from '@/src/contexts/ThemeContext';
import { fmt } from '@/src/utils/format';
import { toNum } from '@/src/utils/validation';

const HARDNESS_FORMULA_INFO = {
  title: 'محول صلابة الماء',
  formula: `تحويلات صلابة الماء:

1 °dH = 17.848 mg/L as CaCO₃
1 °fH = 10 mg/L as CaCO₃
1 ppm ≈ 1 mg/L`
};

export default function HardnessConverterScreen() {
  const { theme } = useTheme();
  const [inputs, setInputs] = useState({
    value: '',
    inputUnit: 'mgL' as 'mgL' | 'dH' | 'fH' | 'ppm'
  });
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    const { value, inputUnit } = inputs;
    const numValue = toNum(value);

    if (numValue > 0) {
      let mgLValue: number;
      switch (inputUnit) {
        case 'mgL': case 'ppm': mgLValue = numValue; break;
        case 'dH': mgLValue = numValue * 17.848; break;
        case 'fH': mgLValue = numValue * 10; break;
        default: mgLValue = numValue;
      }
      const calculatedResults = {
        mgL: mgLValue, dH: mgLValue / 17.848, fH: mgLValue / 10, ppm: mgLValue,
      };
      setResults(calculatedResults);
    } else {
      setResults(null);
    }
  }, [inputs]);

  const handleInputChange = (field: keyof typeof inputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const getUnitOptions = () => [
    { key: 'mgL', label: 'mg/L as CaCO₃', description: 'مليغرام/لتر' },
    { key: 'dH', label: '°dH (German)', description: 'الدرجة الألمانية' },
    { key: 'fH', label: '°fH (French)', description: 'الدرجة الفرنسية' },
    { key: 'ppm', label: 'ppm', description: 'أجزاء بالمليون' },
  ];

  const getHardnessClassification = (mgL: number) => {
    if (mgL <= 60) return { level: 'ناعم جداً', color: theme.colors.success };
    if (mgL <= 120) return { level: 'ناعم', color: theme.colors.info };
    if (mgL <= 180) return { level: 'معتدل', color: '#f59e0b' };
    if (mgL <= 300) return { level: 'عالي', color: '#f97316' };
    return { level: 'عالي جداً', color: theme.colors.error };
  };

  const renderResults = () => {
    if (!results) return null;
    const classification = getHardnessClassification(results.mgL);
    return (
      <View style={{ gap: 12 }}>
        <Card style={{ backgroundColor: `${classification.color}20`, borderWidth: 1, borderColor: classification.color, }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: classification.color, textAlign: 'right', }}>
            تصنيف الماء: {classification.level}
          </Text>
        </Card>
        <Card variant="elevated">
          <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text, textAlign: 'right', marginBottom: 12, }}>
            نتائج التحويل:
          </Text>
          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between' }}><Text style={{ color: theme.colors.text, fontSize: 16 }}>mg/L as CaCO₃:</Text><Text style={{ color: theme.colors.primary, fontSize: 16, fontWeight: '600' }}>{fmt(results.mgL)}</Text></View>
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between' }}><Text style={{ color: theme.colors.text, fontSize: 16 }}>°dH (German):</Text><Text style={{ color: theme.colors.primary, fontSize: 16, fontWeight: '600' }}>{fmt(results.dH)}</Text></View>
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between' }}><Text style={{ color: theme.colors.text, fontSize: 16 }}>°fH (French):</Text><Text style={{ color: theme.colors.primary, fontSize: 16, fontWeight: '600' }}>{fmt(results.fH)}</Text></View>
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between' }}><Text style={{ color: theme.colors.text, fontSize: 16 }}>ppm:</Text><Text style={{ color: theme.colors.primary, fontSize: 16, fontWeight: '600' }}>{fmt(results.ppm)}</Text></View>
          </View>
        </Card>
      </View>
    );
  };

  return (
    <BaseCalculator
      title="محول صلابة الماء"
      subtitle="تحويل بين وحدات قياس صلابة الماء"
      formulaInfo={HARDNESS_FORMULA_INFO}
      results={renderResults()}
      favId="/calculators/hardness-converter"
      favName="محول صلابة الماء"
      favRoute="/calculators/hardness-converter"
      favGroup="تحويلات"
    >
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text, textAlign: 'right', marginBottom: 8, }}>
          وحدة القياس
        </Text>
        <View style={{ gap: 8 }}>
          {getUnitOptions().map(option => (
            <Card
              key={option.key}
              style={{
                backgroundColor: inputs.inputUnit === option.key ? `${theme.colors.primary}20` : theme.colors.surface,
                borderWidth: 1,
                borderColor: inputs.inputUnit === option.key ? theme.colors.primary : theme.colors.border,
                padding: 12,
              }}
              onPress={() => handleInputChange('inputUnit', option.key as any)}
            >
              <Text style={{ color: inputs.inputUnit === option.key ? theme.colors.primary : theme.colors.text, textAlign: 'right', fontWeight: inputs.inputUnit === option.key ? '600' : 'normal', fontSize: 16, }}>
                {option.label}
              </Text>
              <Text style={{ color: theme.colors.textSecondary, textAlign: 'right', fontSize: 12, marginTop: 2, }}>
                {option.description}
              </Text>
            </Card>
          ))}
        </View>
      </View>
      <Input
        label={`قيمة العسر (${getUnitOptions().find(u => u.key === inputs.inputUnit)?.label})`}
        value={inputs.value}
        onChangeText={(value) => handleInputChange('value', value)}
        placeholder="مثال: 150"
        helpText="أدخل قيمة صلابة الماء بالوحدة المختارة"
      />
    </BaseCalculator>
  );
}