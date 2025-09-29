import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { BaseCalculator } from '@/src/components/calculators/BaseCalculator';
import { Input } from '@/src/components/ui/Input';
import { Card } from '@/src/components/ui/Card';
import { useTheme } from '@/src/contexts/ThemeContext';
import { fmt } from '@/src/utils/format';
import { toNum } from '@/src/utils/validation';

type MassUnit = 'kg' | 'g' | 'mg' | 'lb' | 'oz' | 'ton';

interface ConversionResult {
  unit: MassUnit;
  value: number;
  label: string;
}

const massUnits: { [key in MassUnit]: { label: string; toKilograms: number } } = {
  kg: { label: 'كيلوغرام (kg)', toKilograms: 1 },
  g: { label: 'غرام (g)', toKilograms: 0.001 },
  mg: { label: 'مليغرام (mg)', toKilograms: 0.000001 },
  ton: { label: 'طن (ton)', toKilograms: 1000 },
  lb: { label: 'رطل (lb)', toKilograms: 0.453592 },
  oz: { label: 'أونصة (oz)', toKilograms: 0.0283495 },
};

const MASS_FORMULA_INFO = {
  title: 'محول الكتلة',
  formula: `معاملات التحويل القياسية:

1 طن = 1000 كيلوغرام
1 كيلوغرام = 1000 غرام
1 غرام = 1000 مليغرام
1 رطل = 0.453592 كيلوغرام`
};

export default function MassConverter() {
  const { theme } = useTheme();
  const [value, setValue] = useState<string>('');
  const [inputUnit, setInputUnit] = useState<MassUnit>('kg');
  const [results, setResults] = useState<ConversionResult[]>([]);

  const calculateConversions = (inputValue: string, fromUnit: MassUnit) => {
    const numValue = toNum(inputValue);
    
    if (!numValue && numValue !== 0) {
      setResults([]);
      return;
    }

    const kilogramsValue = numValue * massUnits[fromUnit].toKilograms;
    const conversions: ConversionResult[] = [];

    Object.entries(massUnits).forEach(([unit, config]) => {
      if (unit !== fromUnit) {
        const convertedValue = kilogramsValue / config.toKilograms;
        conversions.push({
          unit: unit as MassUnit,
          value: convertedValue,
          label: config.label,
        });
      }
    });

    setResults(conversions);
  };

  useEffect(() => {
    calculateConversions(value, inputUnit);
  }, [value, inputUnit]);

  return (
    <BaseCalculator
      title="محول الكتلة"
      subtitle="تحويل سريع بين وحدات الكتلة المختلفة"
      formulaInfo={MASS_FORMULA_INFO}
      favId="/calculators/mass-converter"
      favName="محول الكتلة"
      favRoute="/calculators/mass-converter"
      favGroup="تحويلات"
    >
      <View style={{ marginBottom: 16 }}>
        <Text style={[{ fontSize: 16, fontWeight: '600', color: theme.colors.text, textAlign: 'right', marginBottom: 8 }]}>
          نوع الوحدة
        </Text>
        <View style={{ flexDirection: 'row-reverse', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {Object.entries(massUnits).map(([unit, config]) => (
            <Card
              key={unit}
              style={{
                backgroundColor: inputUnit === unit ? theme.colors.primary + '20' : theme.colors.surface,
                borderWidth: 1,
                borderColor: inputUnit === unit ? theme.colors.primary : theme.colors.border,
                padding: 10,
                minWidth: 70,
              }}
              onPress={() => setInputUnit(unit as MassUnit)}
            >
              <Text style={{ color: inputUnit === unit ? theme.colors.primary : theme.colors.text, textAlign: 'center', fontWeight: inputUnit === unit ? '600' : 'normal', fontSize: 12, }}>
                {unit === 'ton' ? 'طن' : config.label.split(' ')[0]}
              </Text>
            </Card>
          ))}
        </View>
      </View>
      <Input
        label={`القيمة (${massUnits[inputUnit].label})`}
        value={value}
        onChangeText={setValue}
        placeholder="مثال: 1"
        keyboardType="numeric"
        containerStyle={{ marginBottom: 16 }}
      />
      {results.length > 0 && (
        <Card variant="elevated" style={{ marginTop: 8 }}>
          <Text style={[{ fontSize: 16, fontWeight: '600', color: theme.colors.text, textAlign: 'right', marginBottom: 12, }]}>
            النتائج المحولة
          </Text>
          {results.map((result, index) => (
            <View key={index} style={{
              flexDirection: 'row-reverse',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 8,
              borderBottomWidth: index < results.length - 1 ? 1 : 0,
              borderBottomColor: theme.colors.border,
            }}>
              <Text style={{ fontSize: 14, color: theme.colors.textSecondary, flex: 1, }}>
                {result.label}
              </Text>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.primary, }}>
                {fmt(result.value)}
              </Text>
            </View>
          ))}
        </Card>
      )}
      <Card style={{ backgroundColor: theme.colors.warning + '20', borderColor: theme.colors.warning + '40', marginTop: 16 }}>
        <Text style={[{ fontSize: 14, fontWeight: '600', color: theme.colors.warningText, textAlign: 'right', marginBottom: 8, }]}>
          كتل شائعة في معالجة المياه:
        </Text>
        <Text style={[{ fontSize: 12, color: theme.colors.warningText, textAlign: 'right', lineHeight: 18, }]}>
          • شيوال أسمنت: 25-50 كيلوغرام{"\n"}
          • جرعة كلور نموذجية: 1-5 mg/L{"\n"}
          • مادة مخثرة نموذجية: 100-200 غرام{"\n"}
          • أكياس بوليمر: 1-25 طن
        </Text>
      </Card>
    </BaseCalculator>
  );
}