import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { BaseCalculator } from '@/src/components/calculators/BaseCalculator';
import { Input } from '@/src/components/ui/Input';
import { Card } from '@/src/components/ui/Card';
import { useTheme } from '@/src/contexts/ThemeContext';
import { fmt } from '@/src/utils/format';
import { toNum } from '@/src/utils/validation';

type TemperatureUnit = 'C' | 'F' | 'K';

interface ConversionResult {
  unit: TemperatureUnit;
  value: number;
  label: string;
}

const temperatureUnits: { [key in TemperatureUnit]: string } = {
  C: 'درجة مئوية (°C)', F: 'فهرنهايت (°F)', K: 'كلفن (K)',
};

const convertTemperature = (value: number, fromUnit: TemperatureUnit, toUnit: TemperatureUnit): number => {
  if (fromUnit === toUnit) return value;
  let celsius: number;
  switch (fromUnit) {
    case 'C': celsius = value; break;
    case 'F': celsius = (value - 32) * 5/9; break;
    case 'K': celsius = value - 273.15; break;
    default: celsius = value;
  }
  switch (toUnit) {
    case 'C': return celsius;
    case 'F': return (celsius * 9/5) + 32;
    case 'K': return celsius + 273.15;
    default: return celsius;
  }
};

const TEMPERATURE_FORMULA_INFO = {
  title: 'محول درجة الحرارة',
  formula: `F = (C × 9/5) + 32
C = (F - 32) × 5/9
K = C + 273.15
C = K - 273.15`
};

export default function TemperatureConverter() {
  const { theme } = useTheme();
  const [value, setValue] = useState<string>('');
  const [inputUnit, setInputUnit] = useState<TemperatureUnit>('C');
  const [results, setResults] = useState<ConversionResult[]>([]);

  const calculateConversions = (inputValue: string, fromUnit: TemperatureUnit) => {
    const numValue = toNum(inputValue);
    
    if (!numValue && numValue !== 0) {
      setResults([]);
      return;
    }

    const conversions: ConversionResult[] = [];

    Object.entries(temperatureUnits).forEach(([unit, label]) => {
      if (unit !== fromUnit) {
        const convertedValue = convertTemperature(numValue, fromUnit, unit as TemperatureUnit);
        conversions.push({
          unit: unit as TemperatureUnit,
          value: convertedValue,
          label,
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
      title="محول درجة الحرارة"
      subtitle="تحويل سريع بين وحدات درجة الحرارة"
      formulaInfo={TEMPERATURE_FORMULA_INFO}
      favId="/calculators/temperature-converter"
      favName="محول درجة الحرارة"
      favRoute="/calculators/temperature-converter"
      favGroup="تحويلات"
    >
      <View style={{ marginBottom: 16 }}>
        <Text style={[{ fontSize: 16, fontWeight: '600', color: theme.colors.text, textAlign: 'right', marginBottom: 8 }]}>
          نوع الوحدة
        </Text>
        <View style={{ flexDirection: 'row-reverse', gap: 8, marginBottom: 16 }}>
          {Object.entries(temperatureUnits).map(([unit, label]) => (
            <Card
              key={unit}
              style={{
                flex: 1,
                backgroundColor: inputUnit === unit ? theme.colors.primary + '20' : theme.colors.surface,
                borderWidth: 1,
                borderColor: inputUnit === unit ? theme.colors.primary : theme.colors.border,
                padding: 12,
              }}
              onPress={() => setInputUnit(unit as TemperatureUnit)}
            >
              <Text style={{ color: inputUnit === unit ? theme.colors.primary : theme.colors.text, textAlign: 'center', fontWeight: inputUnit === unit ? '600' : 'normal', fontSize: 12, }}>
                {label}
              </Text>
            </Card>
          ))}
        </View>
      </View>
      <Input
        label={`القيمة (${temperatureUnits[inputUnit]})`}
        value={value}
        onChangeText={setValue}
        placeholder="مثال: 25"
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
          مراجع درجة الحرارة الشائعة:
        </Text>
        <Text style={[{ fontSize: 12, color: theme.colors.warningText, textAlign: 'right', lineHeight: 18, }]}>
          • نقطة تجمد الماء: 0°C = 32°F = 273.15K{"\n"}
          • نقطة غليان الماء: 100°C = 212°F = 373.15K{"\n"}
          • درجة حرارة الجسم: 37°C = 98.6°F = 310.15K{"\n"}
          • الصفر المطلق: -273.15°C = -459.67°F = 0K
        </Text>
      </Card>
    </BaseCalculator>
  );
}