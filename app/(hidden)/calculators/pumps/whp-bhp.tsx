import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { BaseCalculator } from '@/src/components/calculators/BaseCalculator';
import { Input } from '@/src/components/ui/Input';
import { Card } from '@/src/components/ui/Card';
import { useTheme } from '@/src/contexts/ThemeContext';
import { fmt } from '@/src/utils/format';
import { toNum } from '@/src/utils/validation';
import { waterHP_kW, brakeHP_kW, kW_to_HP } from '@/src/utils/engineering';

const WHP_BHP_FORMULA_INFO = {
  title: 'قدرة المضخة (WHP/BHP)',
  formula: `WHP = (ρ × g × Q × H) / 1000
BHP = WHP / (ηpump × ηmech)`
};

export default function WHPBHPCalculator() {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    Q: '50', H: '40', eta: '0.75', mech: '0.98'
  });
  const [results, setResults] = useState<{ whp_kW: number; bhp_kW: number; bhp_HP: number; } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  useEffect(() => {
    const { Q, H, eta, mech } = formData;
    const values = { Q: toNum(Q), H: toNum(H), eta: toNum(eta), mech: toNum(mech) };

    if (values.Q > 0 && values.H > 0 && values.eta > 0 && values.eta <= 1 && values.mech > 0 && values.mech <= 1) {
      try {
        const whp_kW = waterHP_kW(values.Q, values.H);
        const bhp_kW = brakeHP_kW(whp_kW, values.eta, values.mech);
        const bhp_HP = kW_to_HP(bhp_kW);
        setResults({ whp_kW, bhp_kW, bhp_HP });
        setError(null);
      } catch (e: any) {
        setError(e.message);
        setResults(null);
      }
    } else {
      setResults(null);
      setError(null);
    }
  }, [formData]);

  return (
    <BaseCalculator
      title="قدرة المضخة (WHP/BHP)"
      subtitle="حساب القدرة المائية وقدرة العمود للمضخة"
      isCalculating={false}
      error={error}
      formulaInfo={WHP_BHP_FORMULA_INFO}
      favId="/calculators/pumps/whp-bhp"
      favName="قدرة المضخة (WHP/BHP)"
      favRoute="/calculators/pumps/whp-bhp"
      favGroup="مضخات"
    >
      <Input
        label="التدفق (m³/h)"
        value={formData.Q}
        onChangeText={(value) => handleInputChange('Q', value)}
        placeholder="50"
        keyboardType="numeric"
        containerStyle={{ marginBottom: 16 }}
      />
      <Input
        label="الرفع الإجمالي (m)"
        value={formData.H}
        onChangeText={(value) => handleInputChange('H', value)}
        placeholder="40"
        keyboardType="numeric"
        containerStyle={{ marginBottom: 16 }}
      />
      <Input
        label="كفاءة المضخة"
        value={formData.eta}
        onChangeText={(value) => handleInputChange('eta', value)}
        placeholder="0.75"
        keyboardType="numeric"
        containerStyle={{ marginBottom: 16 }}
      />
      <Input
        label="الكفاءة الميكانيكية"
        value={formData.mech}
        onChangeText={(value) => handleInputChange('mech', value)}
        placeholder="0.98"
        keyboardType="numeric"
        containerStyle={{ marginBottom: 16 }}
      />
      {results && (
        <Card variant="elevated" style={{ marginTop: 8 }}>
          <Text style={[{ fontSize: 16, fontWeight: '600', color: theme.colors.text, textAlign: 'right', marginBottom: 12, }]}>
            نتائج حساب القدرة
          </Text>
          <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.colors.border, }}>
            <Text style={{ fontSize: 14, color: theme.colors.textSecondary, flex: 1, }}>القدرة المائية (WHP)</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.info || theme.colors.primary, }}>{fmt(results.whp_kW)} kW</Text>
          </View>
          <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.colors.border, }}>
            <Text style={{ fontSize: 14, color: theme.colors.textSecondary, flex: 1, }}>قدرة العمود (BHP)</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.primary, }}>{fmt(results.bhp_kW)} kW</Text>
          </View>
          <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, }}>
            <Text style={{ fontSize: 14, color: theme.colors.textSecondary, flex: 1, }}>قدرة العمود (BHP)</Text>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.success || theme.colors.primary, }}>{fmt(results.bhp_HP)} HP</Text>
          </View>
        </Card>
      )}
      <View style={{ marginTop: 16 }}>
        <Text style={[{ fontSize: 14, fontWeight: '600', color: theme.colors.textSecondary, textAlign: 'right', marginBottom: 8, }]}>
          قيم نموذجية للكفاءة:
        </Text>
        <View style={{ flexDirection: 'row-reverse', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {[{ label: 'مضخة صغيرة (65%)', eta: '0.65', mech: '0.97' }, { label: 'مضخة متوسطة (75%)', eta: '0.75', mech: '0.98' }, { label: 'مضخة عالية الكفاءة (85%)', eta: '0.85', mech: '0.98' },].map((preset) => (
            <Card
              key={preset.label}
              style={{ padding: 8, backgroundColor: theme.colors.surfaceVariant, borderRadius: theme.radius.sm, minWidth: 100, }}
              onTouchEnd={() => { handleInputChange('eta', preset.eta); handleInputChange('mech', preset.mech); }}
            >
              <Text style={{ color: theme.colors.textSecondary, fontSize: 11, textAlign: 'center', lineHeight: 14, }}>{preset.label}</Text>
            </Card>
          ))}
        </View>
      </View>
      <Card style={{ backgroundColor: theme.colors.warning + '20', borderColor: theme.colors.warning + '40', marginTop: 8 }}>
        <Text style={[{ fontSize: 14, fontWeight: '600', color: theme.colors.warningText, textAlign: 'right', marginBottom: 8, }]}>
          ⚠️ ملاحظات مهمة:
        </Text>
        <Text style={[{ fontSize: 12, color: theme.colors.warningText, textAlign: 'right', lineHeight: 18, }]}>
          • هذه القيم تقديرية - راجع منحنى المضخة للدقة.{"\n"}
          • كفاءة المضخة تتغير حسب نقطة التشغيل.{"\n"}
          • أضف 10-20% لقدرة المحرك لضمان التشغيل الآمن.{"\n"}
          • راع عوامل الخدمة والبيئة في اختيار المحرك.
        </Text>
      </Card>
    </BaseCalculator>
  );
}