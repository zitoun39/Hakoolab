import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { BaseCalculator } from '@/src/components/calculators/BaseCalculator';
import { Input } from '@/src/components/ui/Input';
import { Card } from '@/src/components/ui/Card';
import { useTheme } from '@/src/contexts/ThemeContext';
import { m3h_to_Ls, Ls_to_m3h, m3h_to_gpm, gpm_to_m3h } from '@/src/utils/conversions';
import { fmt } from '@/src/utils/format';
import { toNum } from '@/src/utils/validation';

type FlowUnit = 'm3h' | 'Ls' | 'gpm';

interface FlowValues {
  m3h: number; Ls: number; gpm: number;
}

const FLOW_FORMULA_INFO = {
  title: 'محول وحدات التدفق',
  formula: `1 m³/h = 0.278 L/s
1 L/s = 3.6 m³/h
1 GPM = 0.227 m³/h`
};

export default function FlowConverter() {
  const { theme } = useTheme();
  const [inputs, setInputs] = useState({ m3h: '10', Ls: '', gpm: '' });
  const [results, setResults] = useState<FlowValues | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeInput, setActiveInput] = useState<FlowUnit>('m3h');

  useEffect(() => {
    const { m3h, Ls, gpm } = inputs;
    let calculatedValues: FlowValues | null = null;
    
    try {
      if (activeInput === 'm3h' && m3h) {
        const value = toNum(m3h);
        if (value > 0) {
          calculatedValues = { m3h: value, Ls: m3h_to_Ls(value), gpm: m3h_to_gpm(value) };
        }
      } else if (activeInput === 'Ls' && Ls) {
        const value = toNum(Ls);
        if (value > 0) {
          calculatedValues = { m3h: Ls_to_m3h(value), Ls: value, gpm: m3h_to_gpm(Ls_to_m3h(value)) };
        }
      } else if (activeInput === 'gpm' && gpm) {
        const value = toNum(gpm);
        if (value > 0) {
          const m3hValue = gpm_to_m3h(value);
          calculatedValues = { m3h: m3hValue, Ls: m3h_to_Ls(m3hValue), gpm: value };
        }
      }
      setResults(calculatedValues);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'خطأ في الحساب');
      setResults(null);
    }
  }, [inputs, activeInput]);

  const handleInputChange = (unit: FlowUnit, value: string) => {
    if (unit !== activeInput) {
      setInputs({ m3h: unit === 'm3h' ? value : '', Ls: unit === 'Ls' ? value : '', gpm: unit === 'gpm' ? value : '' });
      setActiveInput(unit);
    } else {
      setInputs(prev => ({ ...prev, [unit]: value }));
    }
    setError(null);
  };

  return (
    <BaseCalculator
      title="محول وحدات التدفق"
      subtitle="تحويل سريع بين m³/h و L/s و GPM"
      isCalculating={false}
      error={error}
      formulaInfo={FLOW_FORMULA_INFO}
      favId="/calculators/conversions/flow"
      favName="محول وحدات التدفق"
      favRoute="/calculators/conversions/flow"
      favGroup="تحويلات"
    >
      <Card style={{ backgroundColor: theme.colors.info + '20', borderColor: theme.colors.info + '40', marginBottom: 16 }}>
        <Text style={[{ fontSize: 14, color: theme.colors.text, textAlign: 'right', lineHeight: 20, }]}>
          💡 أدخل قيمة واحدة وسيتم تحويل الباقي تلقائياً
        </Text>
      </Card>
      <Input
        label="متر مكعب في الساعة (m³/h)"
        value={inputs.m3h}
        onChangeText={(value) => handleInputChange('m3h', value)}
        placeholder="مثال: 10"
        keyboardType="numeric"
        containerStyle={{ marginBottom: 16, backgroundColor: activeInput === 'm3h' ? theme.colors.primary + '10' : undefined }}
      />
      <Input
        label="لتر في الثانية (L/s)"
        value={inputs.Ls}
        onChangeText={(value) => handleInputChange('Ls', value)}
        placeholder="مثال: 2.78"
        keyboardType="numeric"
        containerStyle={{ marginBottom: 16, backgroundColor: activeInput === 'Ls' ? theme.colors.primary + '10' : undefined }}
      />
      <Input
        label="جالون في الدقيقة (GPM)"
        value={inputs.gpm}
        onChangeText={(value) => handleInputChange('gpm', value)}
        placeholder="مثال: 44"
        keyboardType="numeric"
        containerStyle={{ marginBottom: 16, backgroundColor: activeInput === 'gpm' ? theme.colors.primary + '10' : undefined }}
      />
      {results && (
        <Card variant="elevated" style={{ marginTop: 8 }}>
          <Text style={[{ fontSize: 16, fontWeight: '600', color: theme.colors.text, textAlign: 'right', marginBottom: 12, }]}>
            نتائج التحويل
          </Text>
          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.colors.border, }}>
              <Text style={{ fontSize: 14, color: theme.colors.textSecondary, flex: 1, }}>m³/h (متر مكعب/ساعة)</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.primary, }}>{fmt(results.m3h)}</Text>
            </View>
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.colors.border, }}>
              <Text style={{ fontSize: 14, color: theme.colors.textSecondary, flex: 1, }}>L/s (لتر/ثانية)</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.primary, }}>{fmt(results.Ls)}</Text>
            </View>
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, }}>
              <Text style={{ fontSize: 14, color: theme.colors.textSecondary, flex: 1, }}>GPM (جالون/دقيقة)</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.colors.primary, }}>{fmt(results.gpm)}</Text>
            </View>
          </View>
        </Card>
      )}
    </BaseCalculator>
  );
}