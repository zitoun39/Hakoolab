import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { BaseCalculator } from '@/src/components/calculators/BaseCalculator';
import { Input } from '@/src/components/ui/Input';
import { Card } from '@/src/components/ui/Card';
import { useTheme } from '@/src/contexts/ThemeContext';
import { fmt } from '@/src/utils/format';
import { toNum } from '@/src/utils/validation';

const OSMOTIC_FORMULA_INFO = {
  title: 'الضغط الأسموزي (van\'t Hoff)',
  formula: `π = i × M × R × T

حيث:
• π = الضغط الأسموزي (atm)
• i = معامل فانت هوف
• M = التركيز المولي (mol/L)
• R = ثابت الغازات (0.0821)
• T = درجة الحرارة (K)`
};

export default function OsmoticPressureCalculator() {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    molarity: '', temperature: '25', vantHoffFactor: '2'
  });
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  useEffect(() => {
    const { molarity, temperature, vantHoffFactor } = formData;
    const numMolarity = toNum(molarity);
    const numTemperature = toNum(temperature);
    const numVantHoffFactor = toNum(vantHoffFactor);

    if (numMolarity > 0 && numTemperature !== null && numVantHoffFactor > 0) {
      try {
        const R = 0.0821;
        const temperatureKelvin = numTemperature + 273.15;
        const osmoticPressureValue = numVantHoffFactor * numMolarity * R * temperatureKelvin;
        setResult(osmoticPressureValue);
        setError(null);
      } catch (e: any) {
        setError(e.message);
        setResult(null);
      }
    } else {
      setResult(null);
      setError(null);
    }
  }, [formData]);

  return (
    <BaseCalculator
      title="حاسبة الضغط الأسموزي"
      subtitle="حساب الضغط الأسموزي بمعادلة فانت هوف"
      isCalculating={false}
      error={error}
      formulaInfo={OSMOTIC_FORMULA_INFO}
      favId="/calculators/osmotic-pressure"
      favName="حاسبة الضغط الأسموزي"
      favRoute="/calculators/osmotic-pressure"
      favGroup="أنظمة عامة"
    >
      <Input
        label="التركيز المولي (M)"
        value={formData.molarity}
        onChangeText={(value) => handleInputChange('molarity', value)}
        placeholder="0.5"
        keyboardType="numeric"
        helpText="تركيز المحلول بوحدة mol/L"
        containerStyle={{ marginBottom: 16 }}
      />
      <Input
        label="درجة الحرارة (°C)"
        value={formData.temperature}
        onChangeText={(value) => handleInputChange('temperature', value)}
        placeholder="25"
        keyboardType="numeric"
        helpText="درجة الحرارة بالدرجة المئوية"
        containerStyle={{ marginBottom: 16 }}
      />
      <Input
        label="معامل فانت هوف (i)"
        value={formData.vantHoffFactor}
        onChangeText={(value) => handleInputChange('vantHoffFactor', value)}
        placeholder="2"
        keyboardType="numeric"
        helpText="عدد الجسيمات الناتجة عن ذوبان المركب"
        containerStyle={{ marginBottom: 16 }}
      />
      <View style={{ marginBottom: 16 }}>
        <Text style={[{ fontSize: 14, fontWeight: '600', color: theme.colors.textSecondary, textAlign: 'right', marginBottom: 8, }]}>
          معاملات شائعة:
        </Text>
        <View style={{ flexDirection: 'row-reverse', gap: 8, flexWrap: 'wrap' }}>
          {[{ label: 'غير متأينة (1)', value: '1' }, { label: 'NaCl (2)', value: '2' }, { label: 'CaCl₂ (3)', value: '3' }, { label: 'AlCl₃ (4)', value: '4' },].map((preset) => (
            <Card
              key={preset.value}
              style={{
                padding: 8,
                backgroundColor: formData.vantHoffFactor === preset.value ? theme.colors.primary + '20' : theme.colors.surfaceVariant,
                borderWidth: 1,
                borderColor: formData.vantHoffFactor === preset.value ? theme.colors.primary : theme.colors.border,
                minWidth: 80,
              }}
              onPress={() => handleInputChange('vantHoffFactor', preset.value)}
            >
              <Text style={{ color: formData.vantHoffFactor === preset.value ? theme.colors.primary : theme.colors.textSecondary, fontSize: 12, textAlign: 'center', fontWeight: formData.vantHoffFactor === preset.value ? '600' : 'normal', }}>
                {preset.label}
              </Text>
            </Card>
          ))}
        </View>
      </View>
      {result !== null && (
        <Card variant="elevated" style={{ marginTop: 8 }}>
          <Text style={[{ fontSize: 16, fontWeight: '600', color: theme.colors.text, textAlign: 'right', marginBottom: 12, }]}>
            نتيجة الحساب
          </Text>
          <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, backgroundColor: theme.colors.primary + '20', borderRadius: theme.radius.md, marginBottom: 8, paddingHorizontal: 12, }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.primary, flex: 1, }}>
              الضغط الأسموزي
            </Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.primary, }}>
              {fmt(result)} atm
            </Text>
          </View>
          <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, }}>
            <Text style={{ fontSize: 14, color: theme.colors.textSecondary, flex: 1, }}>
              بوحدة bar (تقريبي)
            </Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.text, }}>
              {fmt(result * 1.01325)} bar
            </Text>
          </View>
        </Card>
      )}
    </BaseCalculator>
  );
}