/**
 * مرجع عام: Hydraulic Institute, Crane TP-410 (معادلات شائعة)
 * جميع الوحدات بالـ SI ما لم يُذكر خلاف ذلك.
 */

import { mustPositive } from './validation';

export type Fluid = {
  rho: number;   // كثافة (kg/m3)
  mu?: number;   // لزوجة ديناميكية (Pa·s) (اختياري)
  g?: number;    // تسارع الجاذبية (m/s2) افتراضي 9.80665
};

const G = 9.80665;

/** Water Horsepower (WHP) = ρ * g * Q * H / 1000 (kW) */
export function waterHP_kW(Q_m3h: number, H_m: number, fluid: Fluid = { rho: 998, g: G }): number {
  const Q = mustPositive(Q_m3h, 'التدفق m3/h') / 3600; // m3/s
  const g = fluid.g ?? G;
  return (fluid.rho * g * Q * mustPositive(H_m, 'الرفع m')) / 1000; // kW
}

/** Brake HP (BHP) = WHP / η_pump / η_mech  (kW at shaft) */
export function brakeHP_kW(whp_kW: number, pumpEff = 0.75, mechEff = 0.98): number {
  return mustPositive(whp_kW, 'WHP kW') / (mustPositive(pumpEff, 'كفاءة المضخة') * mustPositive(mechEff, 'الكفاءة الميكانيكية'));
}

/** تحويل kW → HP ميكانيكي */
export const kW_to_HP = (kW: number) => kW * 1.34102209;
/** تحويل HP → kW */
export const HP_to_kW = (hp: number) => hp / 1.34102209;

/** استهلاك طاقة (kWh) = P(kW) * t(h) */
export const energy_kWh = (power_kW: number, hours: number) => mustPositive(power_kW,'القدرة kW') * mustPositive(hours,'الزمن h');

/** تكلفة الطاقة = kWh * سعر التعرفة */
export const energy_cost = (kWh: number, tariff_per_kWh: number) => mustPositive(kWh,'kWh') * mustPositive(tariff_per_kWh,'تعرفة');

/** سرعة في الأنبوب v = Q / A */
export function pipeVelocity_mps(Q_m3h: number, D_mm: number) {
  const Q = mustPositive(Q_m3h, 'التدفق m3/h') / 3600; // m3/s
  const D = mustPositive(D_mm, 'القطر mm') / 1000;     // m
  const A = Math.PI * (D ** 2) / 4;
  return Q / A; // m/s
}

/** Hazen–Williams headloss per length (متر لكل متر) ثم إجمالي */
export function hazenWilliamsHeadLoss(HW_C: number, Q_m3h: number, D_mm: number, L_m: number) {
  // الصيغة في SI التقريبية: hf = 10.67 * L * Q^1.852 / (C^1.852 * D^4.87)
  // حيث Q (m3/s), D (m)
  const Q = mustPositive(Q_m3h,'Q m3/h')/3600;
  const D = mustPositive(D_mm,'D mm')/1000;
  const C = mustPositive(HW_C,'C');
  const hf = 10.67 * mustPositive(L_m,'L m') * (Q ** 1.852) / ((C ** 1.852) * (D ** 4.87));
  return hf; // m
}

/** Darcy–Weisbach headloss: hf = f * (L/D) * (v^2 / 2g) */
export function darcyWeisbachHeadLoss(f: number, Q_m3h: number, D_mm: number, L_m: number, g = G) {
  const v = pipeVelocity_mps(Q_m3h, D_mm);
  const D = D_mm/1000;
  return mustPositive(f,'معامل الإحتكاك') * (mustPositive(L_m,'L') / D) * (v*v / (2*g));
}

/** فواقد موضعية: ΣK * v^2/(2g) */
export function minorLossesHead(sumK: number, Q_m3h: number, D_mm: number, g = G) {
  const v = pipeVelocity_mps(Q_m3h, D_mm);
  return mustPositive(sumK,'مجموع K') * (v*v) / (2*g);
}

/** TDH = Static + Friction + Minor (+ Velocity head إن أردت) */
export function totalDynamicHead({
  staticHead_m,
  frictionHead_m,
  minorHead_m,
  includeVelocityHead = false,
  Q_m3h = 0,
  D_mm = 0,
  g = G
}: {
  staticHead_m: number; frictionHead_m: number; minorHead_m: number;
  includeVelocityHead?: boolean; Q_m3h?: number; D_mm?: number; g?: number;
}) {
  let tdh = mustPositive(staticHead_m,'الرفع الساكن') + Math.max(0, frictionHead_m) + Math.max(0, minorHead_m);
  if (includeVelocityHead && Q_m3h > 0 && D_mm > 0) {
    const v = pipeVelocity_mps(Q_m3h, D_mm);
    tdh += (v*v)/(2*g);
  }
  return tdh;
}

/** قوانين التقارب (السرعة): Q∝N, H∝N^2, P∝N^3  وأيضاً مع القطر */
export function affinityBySpeed(Q1:number,H1:number,P1:number, N1:number, N2:number) {
  const r = mustPositive(N2,'N2')/mustPositive(N1,'N1');
  return { Q2: Q1*r, H2: H1*r*r, P2: P1*r*r*r };
}
export function affinityByDiameter(Q1:number,H1:number,P1:number, D1:number, D2:number) {
  const r = mustPositive(D2,'D2')/mustPositive(D1,'D1');
  return { Q2: Q1*(r**3), H2: H1*(r**2), P2: P1*(r**5) };
}

/** NPSH Available ~ (Patm + P_surface)/ρg + z_suction - (Pv/ρg) - losses */
export function npshAvailable({
  patm_kPa = 101.325, psurf_kPa = 0, pvap_kPa, rho = 998, z_suction_m = 0, suctionLoss_m = 0, g = G
}: {
  patm_kPa?: number; psurf_kPa?: number; pvap_kPa: number; rho?: number; z_suction_m?: number; suctionLoss_m?: number; g?: number;
}) {
  const head_atm = (patm_kPa*1000)/(rho*(g));     // m
  const head_surf= (psurf_kPa*1000)/(rho*(g));    // m
  const head_vap = (pvap_kPa*1000)/(rho*(g));     // m
  return head_atm + head_surf + z_suction_m - head_vap - Math.max(0,suctionLoss_m);
}

/** كهرباء: تيار 3 فاز I = P(kW)*1000 / (√3 * V * PF * η) */
export function threePhaseCurrent_A(PkW: number, V_line: number, pf = 0.85, eff = 0.92) {
  return (mustPositive(PkW,'P kW')*1000) / (Math.sqrt(3)*mustPositive(V_line,'V')*mustPositive(pf,'pf')*mustPositive(eff,'η'));
}

/** قدرة ظاهرة/فعالة */
export const apparentPower_kVA = (V_line:number, I_A:number) => (Math.sqrt(3)*mustPositive(V_line,'V')*mustPositive(I_A,'I'))/1000;
export const realPower_kW = (kVA:number, pf:number) => mustPositive(kVA,'kVA')*mustPositive(pf,'pf');

/** هبوط جهد تقريبي: ΔV% ≈ (√3 * I * (R cosφ + X sinφ) * L) / (V * 1000) ×100
 * هنا نبسّط: نستخدم مقاومية موصلة النحاس/الألومنيوم (Ω·mm²/km) وقطاع S (mm²)
 */
export function voltageDropPercent({
  I_A, L_m, V_line, cosphi = 0.85, R_ohm_per_km, X_ohm_per_km
}: {
  I_A:number; L_m:number; V_line:number; cosphi?:number; R_ohm_per_km:number; X_ohm_per_km:number;
}) {
  const L_km = mustPositive(L_m,'طول')/1000;
  const sinphi = Math.sqrt(1 - Math.min(1, cosphi*cosphi));
  const dV = Math.sqrt(3)*I_A*(R_ohm_per_km*cosphi + X_ohm_per_km*sinphi)*L_km;
  return (dV / mustPositive(V_line,'V'))*100;
}

/** تقدير أولي لمقطع الكابل بالاعتماد على كثافة تيار مسموحة (A/mm2) */
export function cableSizeEstimate_mm2(I_A:number, currentDensity_A_per_mm2 = 3) {
  return mustPositive(I_A,'I')/mustPositive(currentDensity_A_per_mm2,'كثافة تيار');
}
