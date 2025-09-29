import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { BaseCalculator } from '@/src/components/calculators/BaseCalculator';
import { Input } from '@/src/components/ui/Input';
import { Card } from '@/src/components/ui/Card';
import { useTheme } from '@/src/contexts/ThemeContext';
import { fmt } from '@/src/utils/format';
import { toNum } from '@/src/utils/validation';

type VolumeFlowUnit = "m3s" | "m3hr" | "Ls" | "gpm";

interface ConversionResult {
  unit: string;
  value: string;
  label: string;
}

const volumeFlowUnits: { [key in VolumeFlowUnit]: { label: string; toM3s: number } } = {
  m3s: { label: "متر مكعب/ثانية (m³/s)", toM3s: 1 },
  m3hr: { label: "متر مكعب/ساعة (m³/hr)", toM3s: 1/3600 },
  Ls: { label: "لتر/ثانية (L/s)", toM3s: 0.001 },
  gpm: { label: "جالون في الدقيقة GPM (US)", toM3s: 0.00006309 },
};

const VOLUME_FLOW_FORMULA_INFO = {
  title: 'محول وحدات تدفق الحجم',
  formula: `1 m³/s = 3600 m³/hr
1 m³/s = 1000 L/s
1 GPM (US) = 0.00006309 m³/s`
};

export default function VolumeFlowConverter() {
  const { theme } = useTheme();
  const [value, setValue] = useState<string>("");
  const [inputUnit, setInputUnit] = useState<VolumeFlowUnit>("m3hr");
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const calculateConversions = (inputValue: string, fromUnit: VolumeFlowUnit) => {
    const numValue = toNum(inputValue);
    
    if (numValue === null || inputValue.trim() === "") {
      setResults([]);
      setError(null);
      return;
    }

    if (numValue <= 0) {
      setResults([]);
      setError("يجب أن تكون القيمة موجبة");
      return;
    }

    try {
      const m3sValue = numValue * volumeFlowUnits[fromUnit].toM3s;
      const conversions: ConversionResult[] = [];
      Object.entries(volumeFlowUnits).forEach(([unit, config]) => {
        if (unit !== fromUnit) {
          const convertedValue = m3sValue / config.toM3s;
          conversions.push({
            unit,
            value: fmt(convertedValue),
            label: config.label,
          });
        }
      });
      setResults(conversions);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setResults([]);
    }
  };

  useEffect(() => {
    calculateConversions(value, inputUnit);
  }, [value, inputUnit]);

  const handleValueChange = (inputValue: string) => {
    setValue(inputValue);
    setError(null);
  };

  return (
    <BaseCalculator
      title="محول وحدات تدفق الحجم"
      subtitle="تحويل بين وحدات قياس معدل التدفق الحجمي"
      isCalculating={false}
      error={error}
      formulaInfo={VOLUME_FLOW_FORMULA_INFO}
      favId="/calculators/volume-flow-converter"
      favName="محول تدفق الحجم"
      favRoute="/calculators/volume-flow-converter"
      favGroup="تحويلات"
    >
      <Input
        label="القيمة المدخلة"
        value={value}
        onChangeText={handleValueChange}
        placeholder="أدخل معدل التدفق"
        keyboardType="numeric"
        containerStyle={{ marginBottom: 16 }}
      />
      <Card style={{ marginBottom: 16 }}>
        <Text style={[{ fontSize: 16, fontWeight: '600', color: theme.colors.text, textAlign: 'right', marginBottom: 12, }]}>
          اختر الوحدة:
        </Text>
        <View style={{ flexDirection: 'column', gap: 8 }}>
          {Object.entries(volumeFlowUnits).map(([unit, config]) => (
            <Card
              key={unit}
              style={{ padding: 12, backgroundColor: inputUnit === unit ? theme.colors.primary + '20' : theme.colors.surfaceVariant, borderWidth: 1, borderColor: inputUnit === unit ? theme.colors.primary : theme.colors.border, }}
              onPress={() => setInputUnit(unit as VolumeFlowUnit)}
            >
              <Text style={{ color: inputUnit === unit ? theme.colors.primary : theme.colors.textSecondary, fontSize: 14, textAlign: 'right', fontWeight: inputUnit === unit ? '600' : 'normal', }}>
                {config.label}
              </Text>
            </Card>
          ))}
        </View>
      </Card>
      {results.length > 0 && (
        <>
          <Text style={[{ fontSize: 16, fontWeight: '600', color: theme.colors.text, textAlign: 'right', marginBottom: 12, marginTop: 16, }]}>
            النتائج المحولة:
          </Text>
          {results.map((result, index) => (
            <Card key={index} variant="elevated" style={{ marginBottom: 8 }}>
              <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, }}>
                <Text style={{ fontSize: 14, color: theme.colors.textSecondary, flex: 1, textAlign: 'right', }}>
                  {result.label}
                </Text>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.primary, }}>
                  {result.value}
                </Text>
              </View>
            </Card>
          ))}
        </>
      )}
    </BaseCalculator>
  );
}