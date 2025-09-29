import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { BaseCalculator } from '@/src/components/calculators/BaseCalculator';
import { Input } from '@/src/components/ui/Input';
import { Card } from '@/src/components/ui/Card';
import { useTDSCalculation } from '@/src/hooks/useCalculation';
import { useTDSCalculator } from '@/src/stores/calculatorStore';
import { useTheme } from '@/src/contexts/ThemeContext';
import { fmt } from '@/src/utils/format';
import { toNum } from '@/src/utils/validation';

const TDS_FORMULA_INFO = {
  title: 'محول TDS والناقلية الكهربائية',
  formula: `TDS (mg/L) = EC (µS/cm) × K`
};

export default function TDSConverterImproved() {
  const { theme } = useTheme();
  const { inputs, setInputs } = useTDSCalculator();
  const { calculate, isCalculating, outputs: calcOutputs, error } = useTDSCalculation();

  const [formData, setFormData] = useState({
    value: inputs.value?.toString() || '',
    inputUnit: inputs.inputUnit || 'conductivity',
    conversionFactor: inputs.conversionFactor?.toString() || '0.65',
  });

  useEffect(() => {
    const { value, inputUnit, conversionFactor } = formData;
    const numValue = toNum(value);
    const numFactor = toNum(conversionFactor);

    if (numValue > 0 && numFactor > 0) {
      calculate({
        value: numValue,
        inputUnit: inputUnit as 'tds' | 'conductivity',
        factor: numFactor,
      });
      setInputs({
        value: numValue,
        inputUnit,
        conversionFactor: numFactor,
      });
    }
  }, [formData, calculate, setInputs]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getUnitLabel = () => {
    return formData.inputUnit === 'conductivity' 
      ? 'الناقلية الكهربائية (µS/cm)'
      : 'مجموع الأملاح الذائبة (mg/L)';
  };

  const getResultLabel = () => {
    return formData.inputUnit === 'conductivity'
      ? 'مجموع الأملاح الذائبة'
      : 'الناقلية الكهربائية';
  };

  return (
    <BaseCalculator
      title="محول TDS والناقلية الكهربائية"
      subtitle="تحويل سريع بين TDS والناقلية الكهربائية"
      isCalculating={isCalculating}
      error={error}
      formulaInfo={TDS_FORMULA_INFO}
      favId="/calculators/tds-converter-improved"
      favName="محول TDS والناقلية الكهربائية"
      favRoute="/calculators/tds-converter-improved"
      favGroup="تحويلات"
    >
      <View style={{ marginBottom: 16 }}>
        <Text style={[{ fontSize: 16, fontWeight: '600', color: theme.colors.text, textAlign: 'right', marginBottom: 8 }]}>
          نوع القياس
        </Text>
        <View style={{ flexDirection: 'row-reverse', gap: 8, marginBottom: 16 }}>
          {[{ key: 'conductivity', label: 'ناقلية → TDS' }, { key: 'tds', label: 'TDS → ناقلية' }].map(option => (
            <Card
              key={option.key}
              style={{
                flex: 1,
                backgroundColor: formData.inputUnit === option.key ? theme.colors.primary + '20' : theme.colors.surface,
                borderWidth: 1,
                borderColor: formData.inputUnit === option.key ? theme.colors.primary : theme.colors.border,
                padding: 12,
              }}
              onTouchEnd={() => handleInputChange('inputUnit', option.key as any)}
            >
              <Text style={{ color: formData.inputUnit === option.key ? theme.colors.primary : theme.colors.text, textAlign: 'center', fontWeight: formData.inputUnit === option.key ? '600' : 'normal', }}>
                {option.label}
              </Text>
            </Card>
          ))}
        </View>
      </View>
      <Input
        label={getUnitLabel()}
        value={formData.value}
        onChangeText={(value) => handleInputChange('value', value)}
        placeholder="مثال: 500"
        containerStyle={{ marginBottom: 16 }}
      />
      <Input
        label="معامل التحويل (K)"
        value={formData.conversionFactor}
        onChangeText={(value) => handleInputChange('conversionFactor', value)}
        placeholder="0.65"
        helpText="معامل التحويل النموذجي بين 0.5 و 0.8"
        containerStyle={{ marginBottom: 16 }}
      />
      {calcOutputs && (
        <Card variant="elevated" style={{ marginTop: 8 }}>
          <Text style={[{ fontSize: 16, fontWeight: '600', color: theme.colors.text, textAlign: 'right', marginBottom: 8, }]}>
            {getResultLabel()}
          </Text>
          <Text style={[{ fontSize: 24, fontWeight: 'bold', color: theme.colors.primary, textAlign: 'right', }]}>
            {fmt(calcOutputs.value, calcOutputs.unit)}
          </Text>
        </Card>
      )}
      <View style={{ marginTop: 16 }}>
        <Text style={[{ fontSize: 14, fontWeight: '600', color: theme.colors.textSecondary, textAlign: 'right', marginBottom: 8, }]}>
          معاملات تحويل شائعة:
        </Text>
        <View style={{ flexDirection: 'row-reverse', gap: 8, flexWrap: 'wrap' }}>
          {[{ label: 'مياه طبيعية (0.65)', value: '0.65' }, { label: 'مياه البحر (0.8)', value: '0.8' }, { label: 'مياه مقطرة (0.5)', value: '0.5' },].map((preset) => (
            <Card
              key={preset.value}
              style={{ padding: 8, backgroundColor: theme.colors.surfaceVariant, borderRadius: theme.radius.sm, }}
              onTouchEnd={() => handleInputChange('conversionFactor', preset.value)}
            >
              <Text style={{ color: theme.colors.textSecondary, fontSize: 12, textAlign: 'center', }}>
                {preset.label}
              </Text>
            </Card>
          ))}
        </View>
      </View>
    </BaseCalculator>
  );
}