import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { BaseCalculator } from '@/src/components/calculators/BaseCalculator';
import { Input, Card, Button } from '@/src/components/ui';
import { useTheme } from '@/src/contexts/ThemeContext';
import { threePhaseCurrent_A, apparentPower_kVA, realPower_kW } from '@/src/utils/engineering';
import { fmt } from '@/src/utils/format';
import { toNum } from '@/src/utils/validation';

const THREE_PHASE_FORMULA_INFO = {
  title: 'حسابات التيار الثلاثي الطور',
  formula: `I = P / (√3 × V × pf × η)
kVA = V × I × √3 / 1000
kW = kVA × pf`
};

export default function ThreePhaseCalculatorScreen() {
  const { theme } = useTheme();
  
  const [inputs, setInputs] = useState({
    powerKW: '22', voltage: '400', powerFactor: '0.85', efficiency: '0.92'
  });
  
  const [results, setResults] = useState<{ current: number; kVA: number; realPower: number; } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof typeof inputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const calculate = () => {
    try {
      const P = toNum(inputs.powerKW);
      const V = toNum(inputs.voltage);
      const pf = toNum(inputs.powerFactor);
      const eff = toNum(inputs.efficiency);
      
      if (!P || !V || !pf || !eff) {
        setError('يرجى إدخال جميع القيم المطلوبة');
        return;
      }
      
      if (pf > 1 || eff > 1) {
        setError('عامل القدرة والكفاءة يجب أن تكون أقل من أو تساوي 1');
        return;
      }
      
      const current = threePhaseCurrent_A(P, V, pf, eff);
      const kVA = apparentPower_kVA(V, current);
      const realPower = realPower_kW(kVA, pf);
      
      setResults({ current, kVA, realPower });
      setError(null);
    } catch (e: any) {
      setError(e.message || 'خطأ في الحساب');
      setResults(null);
    }
  };

  const renderResults = () => {
    if (!results) return null;
    return (
      <View style={{ gap: 12 }}>
        <Card>
          <Text style={{ fontSize: 14, color: theme.colors.textSecondary, textAlign: 'right', marginBottom: 8, }}>
            النتائج:
          </Text>
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 16, color: theme.colors.text, textAlign: 'right', }}>التيار التقريبي: {fmt(results.current, 'A')}</Text>
            <Text style={{ fontSize: 16, color: theme.colors.text, textAlign: 'right', }}>القدرة الظاهرية: {fmt(results.kVA, 'kVA')}</Text>
            <Text style={{ fontSize: 16, color: theme.colors.text, textAlign: 'right', }}>القدرة الفعّالة (عند pf): {fmt(results.realPower, 'kW')}</Text>
          </View>
        </Card>
        <Card style={{ backgroundColor: `${theme.colors.warning}20`, }}>
          <Text style={{ fontSize: 14, color: theme.colors.warning, textAlign: 'right', lineHeight: 20, }}>
            استخدم هذه النتائج للتقدير الأولي وحجم القاطع والكابل.
          </Text>
        </Card>
      </View>
    );
  };

  return (
    <BaseCalculator
      title="تيار 3 فاز والقدرة الظاهرية"
      subtitle="حساب التيار والقدرة الظاهرية حسب PF والكفاءة"
      error={error}
      results={renderResults()}
      formulaInfo={THREE_PHASE_FORMULA_INFO}
      warningMessage="تأكد من صحة قيم عامل القدرة والكفاءة. استشر مهندس كهربائي."
      favId="/calculators/electrical/three-phase"
      favName="حاسبة التيار ثلاثي الطور"
      favRoute="/calculators/electrical/three-phase"
      favGroup="الكهربائية"
    >
      <Input
        label="القدرة على العمود (kW)"
        value={inputs.powerKW}
        onChangeText={(value) => handleInputChange('powerKW', value)}
        placeholder="مثال: 22"
        containerStyle={{ marginBottom: 16 }}
        keyboardType="numeric"
      />
      <Input
        label="الجهد (V)"
        value={inputs.voltage}
        onChangeText={(value) => handleInputChange('voltage', value)}
        placeholder="مثال: 400"
        containerStyle={{ marginBottom: 16 }}
        keyboardType="numeric"
      />
      <Input
        label="عامل القدرة (pf)"
        value={inputs.powerFactor}
        onChangeText={(value) => handleInputChange('powerFactor', value)}
        placeholder="مثال: 0.85"
        containerStyle={{ marginBottom: 16 }}
        keyboardType="numeric"
      />
      <Input
        label="الكفاءة (η)"
        value={inputs.efficiency}
        onChangeText={(value) => handleInputChange('efficiency', value)}
        placeholder="مثال: 0.92"
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