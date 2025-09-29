import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { BaseCalculator } from '@/src/components/calculators/BaseCalculator';
import { Input, Card } from '@/src/components/ui';
import { useTheme } from '@/src/contexts/ThemeContext';
import { LSI, RSI_from_LSI, pHs } from '@/src/utils/indices';
import { fmt } from '@/src/utils/format';
import { toNum } from '@/src/utils/validation';

const LSI_RSI_FORMULA_INFO = {
  title: 'مؤشرا لانجليير وريزنر للتشبع',
  formula: `LSI = pH - pHs
RSI = 2 × pHs - pH`
};

export default function LSIRSICalculatorScreen() {
  const { theme } = useTheme();
  
  const [inputs, setInputs] = useState({
    pH: '7.8', temperature: '25', tds: '500', calciumHardness: '120', alkalinity: '100'
  });
  
  const [results, setResults] = useState<{
    lsi: number; rsi: number; pHs: number; lsiInterpretation: string; rsiInterpretation: string;
  } | null>(null);
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { pH, temperature, tds, calciumHardness, alkalinity } = inputs;
    const values = {
      pH: toNum(pH), temperature: toNum(temperature), tds: toNum(tds),
      calciumHardness: toNum(calciumHardness), alkalinity: toNum(alkalinity)
    };

    if (Object.values(values).every(v => typeof v === 'number' && v > 0)) {
      try {
        const lsiValue = LSI(values.pH, values.temperature, values.tds, values.calciumHardness, values.alkalinity);
        const rsiValue = RSI_from_LSI(lsiValue);
        const pHsValue = pHs(values.temperature, values.tds, values.calciumHardness, values.alkalinity);

        let lsiInterpretation: string;
        if (lsiValue > 0.1) lsiInterpretation = 'الماء له قابلية للترسيب';
        else if (lsiValue < -0.1) lsiInterpretation = 'الماء له قابلية للتآكل';
        else lsiInterpretation = 'الماء متوازن';
        
        let rsiInterpretation: string;
        if (rsiValue < 6.5) rsiInterpretation = 'الماء له قابلية للترسيب';
        else if (rsiValue > 7.5) rsiInterpretation = 'الماء له قابلية للتآكل';
        else rsiInterpretation = 'الماء متوازن';

        setResults({ lsi: lsiValue, rsi: rsiValue, pHs: pHsValue, lsiInterpretation, rsiInterpretation });
        setError(null);
      } catch (e: any) {
        setError(e?.message ?? 'خطأ في الحساب');
        setResults(null);
      }
    } else {
      setResults(null);
      setError(null);
    }
  }, [inputs]);

  const handleInputChange = (field: keyof typeof inputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const getInterpretationColor = (interpretation: string) => {
    if (interpretation.includes('ترسيب')) return theme.colors.error;
    if (interpretation.includes('تآكل')) return '#ea580c';
    return theme.colors.success;
  };

  const renderResults = () => {
    if (!results) return null;
    return (
      <View style={{ gap: 16 }}>
        <Card>
          <Text style={{ fontSize: 14, color: theme.colors.textSecondary, textAlign: 'right', marginBottom: 4, }}>مؤشر لانجليير (LSI)</Text>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: theme.colors.primary, textAlign: 'right', marginBottom: 8, }}>{fmt(results.lsi)}</Text>
          <Card style={{ backgroundColor: `${getInterpretationColor(results.lsiInterpretation)}20`, borderWidth: 1, borderColor: getInterpretationColor(results.lsiInterpretation), }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: getInterpretationColor(results.lsiInterpretation), textAlign: 'right', }}>{results.lsiInterpretation}</Text>
          </Card>
        </Card>
        <Card>
          <Text style={{ fontSize: 14, color: theme.colors.textSecondary, textAlign: 'right', marginBottom: 4, }}>مؤشر ريزنر (RSI)</Text>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: theme.colors.primary, textAlign: 'right', marginBottom: 8, }}>{fmt(results.rsi)}</Text>
          <Card style={{ backgroundColor: `${getInterpretationColor(results.rsiInterpretation)}20`, borderWidth: 1, borderColor: getInterpretationColor(results.rsiInterpretation), }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: getInterpretationColor(results.rsiInterpretation), textAlign: 'right', }}>{results.rsiInterpretation}</Text>
          </Card>
        </Card>
        <Card>
          <Text style={{ fontSize: 14, color: theme.colors.textSecondary, textAlign: 'right', marginBottom: 4, }}>pH التشبع (pHs)</Text>
          <Text style={{ fontSize: 24, fontWeight: '600', color: theme.colors.text, textAlign: 'right', }}>{fmt(results.pHs)}</Text>
        </Card>
      </View>
    );
  };

  return (
    <BaseCalculator
      title="مؤشرا لانجليير وريزنر"
      subtitle="حساب قابلية الماء للترسيب أو التآكل (LSI & RSI)"
      error={error}
      results={renderResults()}
      formulaInfo={LSI_RSI_FORMULA_INFO}
      warningMessage="هذه النتائج تقديرية. يُنصح بإجراء تحاليل مختبرية للتأكد من دقة القياسات."
      favId="/calculators/indices/lsi"
      favName="مؤشرا لانجليير وريزنر"
      favRoute="/calculators/indices/lsi"
      favGroup="مؤشرات المياه"
    >
      <Input label="قيمة الأس الهيدروجيني (pH)" value={inputs.pH} onChangeText={(value) => handleInputChange('pH', value)} placeholder="مثال: 7.8" containerStyle={{ marginBottom: 16 }} keyboardType="numeric" />
      <Input label="درجة الحرارة (°C)" value={inputs.temperature} onChangeText={(value) => handleInputChange('temperature', value)} placeholder="مثال: 25" containerStyle={{ marginBottom: 16 }} keyboardType="numeric" />
      <Input label="مجموع الأملاح الذائبة (mg/L)" value={inputs.tds} onChangeText={(value) => handleInputChange('tds', value)} placeholder="مثال: 500" containerStyle={{ marginBottom: 16 }} keyboardType="numeric" />
      <Input label="عسر الكالسيوم (mg/L as CaCO₃)" value={inputs.calciumHardness} onChangeText={(value) => handleInputChange('calciumHardness', value)} placeholder="مثال: 120" containerStyle={{ marginBottom: 16 }} keyboardType="numeric" />
      <Input label="القلوية الكلية (mg/L as CaCO₃)" value={inputs.alkalinity} onChangeText={(value) => handleInputChange('alkalinity', value)} placeholder="مثال: 100" keyboardType="numeric" />
    </BaseCalculator>
  );
}