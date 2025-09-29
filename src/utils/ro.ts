import { mustPositive } from './validation';

/** Recovery % = Permeate / Feed ×100 */
export const recoveryPct = (Qp: number, Qf: number) => (mustPositive(Qp,'Qp')/mustPositive(Qf,'Qf'))*100;

/** Salt Rejection % = (1 - Cp/Cf)*100  (تركيز ككتلة أو TDS) */
export const saltRejectionPct = (Cp: number, Cf: number) => (1 - mustPositive(Cp,'Cp')/mustPositive(Cf,'Cf'))*100;

/** Flux LMH = (Qp [L/h]) / A[m2]  — أو تحويل من m3/h */
export function flux_LMH(Qp_m3h: number, area_m2: number) {
  return (mustPositive(Qp_m3h,'Qp')*1000) / mustPositive(area_m2,'المساحة');
}

/** Concentration Factor (CF) = Cf_brine / Cf_feed ≈ 1/(1 - R) (R كنسبة عشرية) */
export const concentrationFactor = (recovery_percent: number) => 1/(1 - mustPositive(recovery_percent,'Recovery')/100);

/** توازن TDS بسيط: Qf*Cf = Qp*Cp + Qb*Cb  مع Qb = Qf - Qp */
export function brineTDS_simple(Qf:number, Cf:number, Qp:number, Cp:number) {
  const Qb = mustPositive(Qf,'Qf') - mustPositive(Qp,'Qp');
  if (Qb <= 0) throw new Error('التغذية يجب أن تكون أكبر من النفاذ');
  const Cb = (Qf*Cf - Qp*Cp)/Qb;
  return { Qb, Cb };
}

/** ضغط أسموزي تقريبي: π ≈ i * R * T * M  (Van’t Hoff)
 * نقرب M من TDS (kg/m3) / MW_eq (kg/mol). لمياه مالحة: خذ i≈2, MW≈0.05844 (NaCl).
 */
export function osmoticPressure_bar(TDS_mgL: number, T_K: number, i = 2, MW_kg_per_mol = 0.05844) {
  const R = 0.08314; // bar·L/(mol·K)
  const TDS_kg_m3 = mustPositive(TDS_mgL,'TDS')/1000; // g/L ⇒ kg/m3 /1000؟ (1 g/L = 1 kg/m3) وهنا mg/L /1000 = g/L
  const g_per_L = TDS_mgL/1000;
  const mol_per_L = g_per_L / (MW_kg_per_mol*1000); // kg/mol ⇒ g/mol ×0.001
  return i * R * mustPositive(T_K,'T') * mol_per_L;
}

/** SEC تقريبي = P_input(kW) / Qp(m3/h)  (kWh/m3) */
export function SEC_kWh_per_m3(PkW: number, Qp_m3h: number) {
  return mustPositive(PkW,'P')/mustPositive(Qp_m3h,'Qp');
}
