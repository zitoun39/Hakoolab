import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { BaseCalculator } from '@/src/components/calculators/BaseCalculator';
import { Input, Card } from '@/src/components/ui';
import { useTheme } from '@/src/contexts/ThemeContext';
import { fmt } from '@/src/utils/format';
import { toNum } from '@/src/utils/validation';

const PRESSURE_FORMULA_INFO = {
  title: 'محول وحدات الضغط',
  formula: `تحويلات الضغط الشائعة:

1 bar = 100 kPa = 14.504 psi
1 atm = 1.01325 bar = 101.325 kPa
1 MPa = 10 bar = 1000 kPa
1 mmHg = 0.133322 kPa
1 m H₂O = 9.80665 kPa`
};

export default function PressureConverterScreen() {
  const { theme } = useTheme();
  const [inputs, setInputs] = useState({
    value: '',
    inputUnit: 'bar' as 'bar' | 'kPa' | 'psi' | 'atm' | 'MPa' | 'mmHg' | 'mH2O'
  });
  const [results, setResults] = useState<any>(null);

  const conversionFactors = {
    bar: 100, kPa: 1, psi: 6.89476, atm: 101.325, MPa: 1000, mmHg: 0.133322, mH2O: 9.80665,
  };

  useEffect(() => {
    const { value, inputUnit } = inputs;
    const numValue = toNum(value);

    if (numValue > 0) {
      const kPaValue = numValue * conversionFactors[inputUnit];
      const calculatedResults: Record<string, number> = {};
      Object.entries(conversionFactors).forEach(([unit, factor]) => {
        calculatedResults[unit] = kPaValue / factor;
      });
      setResults(calculatedResults);
    } else {
      setResults(null);
    }
  }, [inputs]);

  const handleInputChange = (field: keyof typeof inputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const getUnitOptions = () => [
    { key: 'bar', label: 'bar', description: 'بار - شائع في أنظمة الضغط' },
    { key: 'kPa', label: 'kPa', description: 'كيلو باسكال' },
    { key: 'psi', label: 'psi', description: 'رطل/بوصة مربعة' },
    { key: 'atm', label: 'atm', description: 'ضغط جوي معياري' },
    { key: 'MPa', label: 'MPa', description: 'ميغا باسكال' },
    { key: 'mmHg', label: 'mmHg', description: 'مليمتر زئبق' },
    { key: 'mH2O', label: 'm H₂O', description: 'متر عمود ماء' },
  ];

  const getPressureCategory = (barValue: number) => {
    if (barValue < 0.1) return { level: 'فراغ/تخلخل', color: theme.colors.info };
    if (barValue < 1) return { level: 'ضغط منخفض', color: theme.colors.success };
    if (barValue < 10) return { level: 'ضغط متوسط', color: '#f59e0b' };
    if (barValue < 100) return { level: 'ضغط عالي', color: '#f97316' };
    return { level: 'ضغط عالي جداً', color: theme.colors.error };
  };

  const renderResults = () => {
    if (!results) return null;
    const category = getPressureCategory(results.bar);
    return (
      <View style={{ gap: 12 }}>
        <Card style={{ backgroundColor: `${category.color}20`, borderWidth: 1, borderColor: category.color, }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: category.color, textAlign: 'right', }}>
            تصنيف الضغط: {category.level}
          </Text>
        </Card>
        <Card variant="elevated">
          <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text, textAlign: 'right', marginBottom: 12, }}>
            نتائج التحويل:
          </Text>
          <View style={{ gap: 8 }}>
            {getUnitOptions().map(option => (
              <View key={option.key} style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: theme.colors.text, fontSize: 15, flex: 1, textAlign: 'right' }}>{option.label}:</Text>
                <Text style={{ color: theme.colors.primary, fontSize: 16, fontWeight: '600', minWidth: 100, textAlign: 'left' }}>{fmt(results[option.key])}</Text>
              </View>
            ))}
          </View>
        </Card>
      </View>
    );
  };

  return (
    <BaseCalculator
      title="محول وحدات الضغط"
      subtitle="تحويل بين وحدات الضغط المختلفة المستخدمة في الهندسة"
      formulaInfo={PRESSURE_FORMULA_INFO}
      results={renderResults()}
      favId="/calculators/pressure-converter"
      favName="محول وحدات الضغط"
      favRoute="/calculators/pressure-converter"
      favGroup="تحويلات"
    >
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text, textAlign: 'right', marginBottom: 8, }}>
          وحدة القياس
        </Text>
        <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 }}>
          {getUnitOptions().map(option => (
            <Card
              key={option.key}
              style={{
                backgroundColor: inputs.inputUnit === option.key ? `${theme.colors.primary}20` : theme.colors.surface,
                borderWidth: 1,
                borderColor: inputs.inputUnit === option.key ? theme.colors.primary : theme.colors.border,
                padding: 8,
                minWidth: 80,
              }}
              onPress={() => handleInputChange('inputUnit', option.key as any)}
            >
              <Text style={{ color: inputs.inputUnit === option.key ? theme.colors.primary : theme.colors.text, textAlign: 'center', fontWeight: inputs.inputUnit === option.key ? '600' : 'normal', fontSize: 14, }}>
                {option.label}
              </Text>
            </Card>
          ))}
        </View>
      </View>
      <Input
        label={`قيمة الضغط (${inputs.inputUnit})`}
        value={inputs.value}
        onChangeText={(value) => handleInputChange('value', value)}
        placeholder="مثال: 5"
        helpText="أدخل قيمة الضغط بالوحدة المختارة"
      />
      <View style={{ marginTop: 16 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.textSecondary, textAlign: 'right', marginBottom: 8, }}>
          قيم شائعة:
        </Text>
        <View style={{ flexDirection: 'row-reverse', gap: 8, flexWrap: 'wrap' }}>
          {[{ label: 'ضغط جوي (1 atm)', value: '1', unit: 'atm' }, { label: 'شبكة المياه (3 bar)', value: '3', unit: 'bar' }, { label: 'RO عالي (70 bar)', value: '70', unit: 'bar' },].map((preset) => (
            <Card
              key={preset.label}
              style={{ padding: 8, backgroundColor: theme.colors.surfaceVariant, borderRadius: 8, }}
              onPress={() => { setInputs(prev => ({ ...prev, value: preset.value, inputUnit: preset.unit as any })); }}
            >
              <Text style={{ color: theme.colors.textSecondary, fontSize: 12, textAlign: 'center', }}>{preset.label}</Text>
            </Card>
          ))}
        </View>
      </View>
    </BaseCalculator>
  );
}