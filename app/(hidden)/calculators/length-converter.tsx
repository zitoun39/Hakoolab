import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { BaseCalculator } from '@/src/components/calculators/BaseCalculator';
import { Input } from '@/src/components/ui/Input';
import { Card } from '@/src/components/ui/Card';
import { useTheme } from '@/src/contexts/ThemeContext';
import { fmt } from '@/src/utils/format';
import { toNum } from '@/src/utils/validation';

type LengthUnit = 'm' | 'cm' | 'mm' | 'km' | 'inch' | 'ft';

interface ConversionResult {
  unit: LengthUnit;
  value: number;
  label: string;
}

const lengthUnits: { [key in LengthUnit]: { label: string; toMeters: number } } = {
  km: { label: 'كيلومتر (km)', toMeters: 1000 },
  m: { label: 'متر (m)', toMeters: 1 },
  cm: { label: 'سنتيمتر (cm)', toMeters: 0.01 },
  mm: { label: 'مليمتر (mm)', toMeters: 0.001 },
  inch: { label: 'بوصة (inch)', toMeters: 0.0254 },
  ft: { label: 'قدم (ft)', toMeters: 0.3048 },
};

const LENGTH_FORMULA_INFO = {
  title: 'محول وحدات الطول',
  formula: `معاملات التحويل القياسية:

1 كيلومتر = 1000 متر
1 متر = 100 سنتيمتر
1 متر = 1000 مليمتر
1 بوصة = 2.54 سنتيمتر
1 قدم = 12 بوصة = 30.48 سنتيمتر`
};

export default function LengthConverter() {
  const { theme } = useTheme();
  const [value, setValue] = useState<string>('');
  const [inputUnit, setInputUnit] = useState<LengthUnit>('m');
  const [results, setResults] = useState<ConversionResult[]>([]);

  const calculateConversions = (inputValue: string, fromUnit: LengthUnit) => {
    const numValue = toNum(inputValue);
    
    if (!numValue && numValue !== 0) {
      setResults([]);
      return;
    }

    const metersValue = numValue * lengthUnits[fromUnit].toMeters;
    const conversions: ConversionResult[] = [];

    Object.entries(lengthUnits).forEach(([unit, config]) => {
      if (unit !== fromUnit) {
        const convertedValue = metersValue / config.toMeters;
        conversions.push({
          unit: unit as LengthUnit,
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
      title="محول وحدات الطول"
      subtitle="تحويل سريع بين وحدات الطول المختلفة"
      formulaInfo={LENGTH_FORMULA_INFO}
      favId="/calculators/length-converter"
      favName="محول وحدات الطول"
      favRoute="/calculators/length-converter"
      favGroup="تحويلات"
    >
      <View style={{ marginBottom: 16 }}>
        <Text style={[{ fontSize: 16, fontWeight: '600', color: theme.colors.text, textAlign: 'right', marginBottom: 8 }]}>
          نوع الوحدة
        </Text>
        <View style={{ flexDirection: 'row-reverse', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {Object.entries(lengthUnits).map(([unit, config]) => (
            <Card
              key={unit}
              style={{
                backgroundColor: inputUnit === unit ? theme.colors.primary + '20' : theme.colors.surface,
                borderWidth: 1,
                borderColor: inputUnit === unit ? theme.colors.primary : theme.colors.border,
                padding: 10,
                minWidth: 60,
              }}
              onPress={() => setInputUnit(unit as LengthUnit)}
            >
              <Text style={{ color: inputUnit === unit ? theme.colors.primary : theme.colors.text, textAlign: 'center', fontWeight: inputUnit === unit ? '600' : 'normal', fontSize: 12, }}>
                {unit}
              </Text>
            </Card>
          ))}
        </View>
      </View>
      <Input
        label={`القيمة (${lengthUnits[inputUnit].label})`}
        value={value}
        onChangeText={setValue}
        placeholder="مثال: 100"
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
          أطوال شائعة في معالجة المياه:
        </Text>
        <Text style={[{ fontSize: 12, color: theme.colors.warningText, textAlign: 'right', lineHeight: 18, }]}>
          • قطر أنبوب منزلي: 0.5-2 بوصة (13-50 مم){"\n"}
          • قطر أنبوب رئيسي: 6-12 بوصة (150-300 مم){"\n"}
          • عمق بئر متوسط: 30-100 متر{"\n"}
          • طول شبكة توزيع: 1-10 كيلومتر
        </Text>
      </Card>
    </BaseCalculator>
  );
}