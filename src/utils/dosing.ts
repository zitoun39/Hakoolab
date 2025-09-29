import { mustPositive } from './validation';

/** تخفيف بسيط: C1 V1 = C2 V2  — أعِد V1 أو V2 حسب المجهول */
export function c1v1_c2v2({ C1, V1, C2, V2 }:{C1?:number;V1?:number;C2?:number;V2?:number}) {
  const known = { C1, V1, C2, V2 };
  const count = Object.values(known).filter(v => typeof v === 'number').length;
  if (count !== 3) throw new Error('حدد ثلاثة متغيرات واحسب الرابع');
  if (C1 !== undefined && V1 !== undefined && C2 !== undefined) return { V2: (C1*V1)/C2 };
  if (C1 !== undefined && V2 !== undefined && C2 !== undefined) return { V1: (C2*V2)/C1 };
  if (V1 !== undefined && V2 !== undefined && C2 !== undefined) return { C1: (C2*V2)/V1 };
  if (C1 !== undefined && V1 !== undefined && V2 !== undefined) return { C2: (C1*V1)/V2 };
  throw new Error('مدخلات غير صالحة');
}

/** تحويلات أساسية: % وزنية ↔ molarity/normality (تقريبي حسب التكافؤ) */
export function wtPercent_to_M(
  wt_percent:number, density_solution_g_per_ml:number, MW_g_per_mol:number
){
  const g_per_L = mustPositive(density_solution_g_per_ml,'الكثافة')*1000 * (mustPositive(wt_percent,'%')/100);
  return g_per_L / mustPositive(MW_g_per_mol,'الكتلة المولية');
}

export function M_to_wtPercent(M:number, density_solution_g_per_ml:number, MW_g_per_mol:number){
  const g_solute_per_L = mustPositive(M,'M')*mustPositive(MW_g_per_mol,'MW');
  const g_solution_per_L = mustPositive(density_solution_g_per_ml,'الكثافة')*1000;
  return (g_solute_per_L/g_solution_per_L)*100;
}

export const normality_from_M = (M:number, equivalence:number) => mustPositive(M,'M')*mustPositive(equivalence,'تكافؤ');
export const M_from_normality = (N:number, equivalence:number) => mustPositive(N,'N')/mustPositive(equivalence,'تكافؤ');

/** حساب معدل ضخ جرعة الكلور
 * Q_dose (L/h) = (Dose × Q_water × 1000) / C_stock
 * C_stock (mg/L) = density × available_percent × 1e6
 */
export function chlorineDosePumpFlow_Lph(
  flowRate_m3h: number,
  targetDose_mgL: number,
  availableChlorine_percent: number,
  solutionDensity_g_per_mL = 1.2
) {
  const Q_water = mustPositive(flowRate_m3h, 'معدل التدفق');
  const dose = mustPositive(targetDose_mgL, 'الجرعة المستهدفة');
  const avail = mustPositive(availableChlorine_percent, 'نسبة الكلور الفعال') / 100;
  const density = mustPositive(solutionDensity_g_per_mL, 'كثافة المحلول');
  
  // تركيز المحلول الأساسي (mg/L)
  const C_stock_mgL = density * 1000 * avail * 1000; // g/L * mg/g
  
  // معدل ضخ الجرعة (L/h)
  const Q_dose_Lph = (dose * Q_water * 1000) / C_stock_mgL;
  
  return {
    C_stock_mgL,
    Q_dose_Lph
  };
}

/** حساب معدل ضخ جرعة الأحماض/القلويات
 * Q_chem (L/h) = (ΔAlk_mg/L ÷ 50) × (Q_water ÷ N)
 * حيث:
 * - ΔAlk_mg/L: التغيير المطلوب في القلوية (mg/L as CaCO3)
 * - Q_water: معدل تدفق الماء (m³/h)
 * - N: Normality للمحلول الكيميائي
 */
export function acidAlkaliDose_Lph(
  flowRate_m3h: number,
  deltaAlk_mgL_asCaCO3: number,
  normality: number
) {
  const Q_water = mustPositive(flowRate_m3h, 'معدل التدفق');
  const deltaAlk = mustPositive(deltaAlk_mgL_asCaCO3, 'التغيير في القلوية');
  const N = mustPositive(normality, 'Normality');
  
  // تحويل من mg/L as CaCO3 إلى meq/L
  const deltaAlk_meqL = deltaAlk / 50;
  
  // حساب معدل ضخ المحلول الكيميائي (L/h)
  const Q_chem_Lph = (deltaAlk_meqL * Q_water) / N;
  
  return {
    Q_chem_Lph
  };
}
