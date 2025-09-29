import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { BaseCalculator } from '@/src/components/calculators/BaseCalculator';
import { Input, Card } from '@/src/components/ui';
import { useTheme } from '@/src/contexts/ThemeContext';
import { chlorineDosePumpFlow_Lph } from '@/src/utils/dosing';
import { fmt } from '@/src/utils/format';
import { toNum } from '@/src/utils/validation';

const CHLORINE_FORMULA_INFO = {
  title: 'جرعة الكلور — الشرح',
  formula: `Q_dose = Dose × 1000 × Q_water / C_stock`
};

export default function ChlorineDoseCalculator() {
  const { theme } = useTheme();
  const [inputs, setInputs] = useState({
    flow: '20', dose: '2', avail: '12.5', dens: '1.20'
  });
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { flow, dose, avail, dens } = inputs;
    const values = {
      flow: toNum(flow), dose: toNum(dose), avail: toNum(avail), dens: toNum(dens) || 1.2
    };

    if (values.flow > 0 && values.dose > 0 && values.avail > 0) {
      try {
        const result = chlorineDosePumpFlow_Lph(values.flow, values.dose, values.avail, values.dens);
        setResults(result);
        setError(null);
      } catch (e: any) {
        setError(e.message);
        setResults(null);
      }
    }
  }, [inputs]);

  const handleInputChange = (field: keyof typeof inputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const renderResults = () => {
    if (!results) return null;
    return (
      <View style={{ gap: 12 }}>
        <Card>
          <Text style={{ color: theme.colors.text, fontSize: 16, textAlign: 'right', marginBottom: 8 }}>
            تركيز المحلول: {fmt(results.C_stock_mgL)} mg/L
          </Text>
          <Text style={{ color: theme.colors.text, fontSize: 16, textAlign: 'right' }}>
            تدفق مضخة الجرعات: {fmt(results.Q_dose_Lph)} L/h
          </Text>
        </Card>
      </View>
    );
  };

  return (
    <BaseCalculator
      title="جرعة الكلور / الهيبو"
      subtitle="حساب معدل حقن محلول NaOCl"
      error={error}
      results={renderResults()}
      formulaInfo={CHLORINE_FORMULA_INFO}
      warningMessage="• راقب الكلور المتبقي الحر واضبط الجرعة تدريجياً. • لا تستخدم المضخة بأقل من 20%. • تحقق من توافق المواد (PVC/PE أفضل)."
      favId="/calculators/dosing/chlorine-dose-improved"
      favName="حاسبة جرعة الكلور محسّنة"
      favRoute="/calculators/dosing/chlorine-dose-improved"
      favGroup="الجرعات"
    >
      <Input
        label="تدفق الماء (m³/h)"
        value={inputs.flow}
        onChangeText={(value) => handleInputChange('flow', value)}
        placeholder="مثال: 20"
        containerStyle={{ marginBottom: 16 }}
      />
      <Input
        label="الجرعة المستهدفة (mg/L)"
        value={inputs.dose}
        onChangeText={(value) => handleInputChange('dose', value)}
        placeholder="مثال: 2"
        containerStyle={{ marginBottom: 16 }}
      />
      <Input
        label="Available % (الكلور الفعّال)"
        value={inputs.avail}
        onChangeText={(value) => handleInputChange('avail', value)}
        placeholder="مثال: 12.5"
        containerStyle={{ marginBottom: 16 }}
      />
      <Input
        label="كثافة المحلول (g/mL)"
        value={inputs.dens}
        onChangeText={(value) => handleInputChange('dens', value)}
        placeholder="مثال: 1.20"
      />
    </BaseCalculator>
  );
}