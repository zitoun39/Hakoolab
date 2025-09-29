import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { BaseCalculator } from '@/src/components/calculators/BaseCalculator';
import { Input } from '@/src/components/ui/Input';
import { Card } from '@/src/components/ui/Card';
import { useTheme } from '@/src/contexts/ThemeContext';
import { fmt } from '@/src/utils/format';
import { toNum } from '@/src/utils/validation';
import { affinityBySpeed, affinityByDiameter } from '@/src/utils/engineering';

const AFFINITY_FORMULA_INFO = {
  title: 'قوانين التقارب (Affinity Laws)',
  formula: `تغيير السرعة: Q₂/Q₁ = N₂/N₁ | H₂/H₁ = (N₂/N₁)² | P₂/P₁ = (N₂/N₁)³
تغيير القطر: Q₂/Q₁ = (D₂/D₁)³ | H₂/H₁ = (D₂/D₁)² | P₂/P₁ = (D₂/D₁)⁵`
};

export default function AffinityLawsCalculator() {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    Q1: '60', H1: '40', P1: '22', N1: '50', N2: '45', D1: '200', D2: '180'
  });
  const [results, setResults] = useState<{
    speed: { Q2: number; H2: number; P2: number };
    diameter: { Q2: number; H2: number; P2: number };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  useEffect(() => {
    const { Q1, H1, P1, N1, N2, D1, D2 } = formData;
    const values = { Q1: toNum(Q1), H1: toNum(H1), P1: toNum(P1), N1: toNum(N1), N2: toNum(N2), D1: toNum(D1), D2: toNum(D2) };

    if (values.Q1 > 0 && values.H1 > 0 && values.P1 > 0 && values.N1 > 0 && values.N2 > 0 && values.D1 > 0 && values.D2 > 0) {
      try {
        const speedResults = affinityBySpeed(values.Q1, values.H1, values.P1, values.N1, values.N2);
        const diameterResults = affinityByDiameter(values.Q1, values.H1, values.P1, values.D1, values.D2);
        setResults({ speed: speedResults, diameter: diameterResults });
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
      title="قوانين التقارب (Affinity Laws)"
      subtitle="حساب أداء المضخة مع تغيير السرعة أو القطر"
      isCalculating={false}
      error={error}
      formulaInfo={AFFINITY_FORMULA_INFO}
      favId="/calculators/pumps/affinity"
      favName="قوانين التقارب للمضخات"
      favRoute="/calculators/pumps/affinity"
      favGroup="المضخات"
    >
      <View style={{ marginBottom: 20 }}>
        <Text style={[{ fontSize: 16, fontWeight: '600', color: theme.colors.text, textAlign: 'right', marginBottom: 12 }]}>
          نقطة التشغيل الأولى (المرجع)
        </Text>
        <Input label="التدفق Q₁ (m³/h)" value={formData.Q1} onChangeText={(value) => handleInputChange('Q1', value)} placeholder="60" keyboardType="numeric" containerStyle={{ marginBottom: 12 }} />
        <Input label="الرفع H₁ (m)" value={formData.H1} onChangeText={(value) => handleInputChange('H1', value)} placeholder="40" keyboardType="numeric" containerStyle={{ marginBottom: 12 }} />
        <Input label="القدرة P₁ (kW)" value={formData.P1} onChangeText={(value) => handleInputChange('P1', value)} placeholder="22" keyboardType="numeric" containerStyle={{ marginBottom: 12 }} />
      </View>
      <View style={{ marginBottom: 20 }}>
        <Text style={[{ fontSize: 16, fontWeight: '600', color: theme.colors.text, textAlign: 'right', marginBottom: 12 }]}>
          تغيير السرعة
        </Text>
        <Input label="السرعة الأولى N₁ (Hz أو نسبة)" value={formData.N1} onChangeText={(value) => handleInputChange('N1', value)} placeholder="50" keyboardType="numeric" containerStyle={{ marginBottom: 12 }} />
        <Input label="السرعة الجديدة N₂ (Hz أو نسبة)" value={formData.N2} onChangeText={(value) => handleInputChange('N2', value)} placeholder="45" keyboardType="numeric" containerStyle={{ marginBottom: 12 }} />
      </View>
      <View style={{ marginBottom: 20 }}>
        <Text style={[{ fontSize: 16, fontWeight: '600', color: theme.colors.text, textAlign: 'right', marginBottom: 12 }]}>
          تغيير القطر
        </Text>
        <Input label="القطر الأول D₁ (mm)" value={formData.D1} onChangeText={(value) => handleInputChange('D1', value)} placeholder="200" keyboardType="numeric" containerStyle={{ marginBottom: 12 }} />
        <Input label="القطر الجديد D₂ (mm)" value={formData.D2} onChangeText={(value) => handleInputChange('D2', value)} placeholder="180" keyboardType="numeric" containerStyle={{ marginBottom: 12 }} />
      </View>
      {results && (
        <>
          <Card variant="elevated" style={{ marginTop: 8, marginBottom: 12 }}>
            <Text style={[{ fontSize: 16, fontWeight: '600', color: theme.colors.text, textAlign: 'right', marginBottom: 12, }]}>
              نتائج تغيير السرعة
            </Text>
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.colors.border, }}><Text style={{ fontSize: 14, color: theme.colors.textSecondary, flex: 1, }}>التدفق الجديد Q₂</Text><Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.primary, }}>{fmt(results.speed.Q2)} m³/h</Text></View>
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.colors.border, }}><Text style={{ fontSize: 14, color: theme.colors.textSecondary, flex: 1, }}>الرفع الجديد H₂</Text><Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.primary, }}>{fmt(results.speed.H2)} m</Text></View>
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, }}><Text style={{ fontSize: 14, color: theme.colors.textSecondary, flex: 1, }}>القدرة الجديدة P₂</Text><Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.success || theme.colors.primary, }}>{fmt(results.speed.P2)} kW</Text></View>
          </Card>
          <Card variant="elevated" style={{ marginTop: 8 }}>
            <Text style={[{ fontSize: 16, fontWeight: '600', color: theme.colors.text, textAlign: 'right', marginBottom: 12, }]}>
              نتائج تغيير القطر
            </Text>
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.colors.border, }}><Text style={{ fontSize: 14, color: theme.colors.textSecondary, flex: 1, }}>التدفق الجديد Q₂</Text><Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.primary, }}>{fmt(results.diameter.Q2)} m³/h</Text></View>
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.colors.border, }}><Text style={{ fontSize: 14, color: theme.colors.textSecondary, flex: 1, }}>الرفع الجديد H₂</Text><Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.primary, }}>{fmt(results.diameter.H2)} m</Text></View>
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, }}><Text style={{ fontSize: 14, color: theme.colors.textSecondary, flex: 1, }}>القدرة الجديدة P₂</Text><Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.success || theme.colors.primary, }}>{fmt(results.diameter.P2)} kW</Text></View>
          </Card>
        </>
      )}
      <Card style={{ backgroundColor: theme.colors.warning + '20', borderColor: theme.colors.warning + '40', marginTop: 16 }}>
        <Text style={[{ fontSize: 14, fontWeight: '600', color: theme.colors.warningText, textAlign: 'right', marginBottom: 8, }]}>
          ⚠️ ملاحظات هندسية مهمة:
        </Text>
        <Text style={[{ fontSize: 12, color: theme.colors.warningText, textAlign: 'right', lineHeight: 18, }]}>
          • هذه القوانين تقريبية وتفترض ثبات الكفاءة.{"\n"}
          • يجب مراجعة منحنى المضخة للتأكد من النقطة التشغيلية.{"\n"}
          • لا تستخدم خارج النطاق الآمن للمضخة (10%-110% من BEP).
        </Text>
      </Card>
    </BaseCalculator>
  );
}