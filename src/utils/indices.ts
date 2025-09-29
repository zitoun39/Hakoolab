/**
 * Langelier Saturation Index: LSI = pH - pHs
 * Ryznar Stability Index: RSI = 2 * pHs - pH
 * pHs ≈ (9.3 + A + B) - (C + D)
 * A = (log10(TDS) - 1)/10   [TDS mg/L]
 * B = -13.12*log10(T+273) + 34.55   [T °C]
 * C = log10(Ca hardness as CaCO3 mg/L) - 0.4
 * D = log10(Alkalinity as CaCO3 mg/L)
 * ملاحظة: هذه تقديرات شائعة للاستخدام الميداني.
 */

import { mustPositive } from './validation';

function log10(x:number){ return Math.log10(mustPositive(x)); }

export function pHs(T_C:number, TDS_mgL:number, Ca_as_CaCO3_mgL:number, Alk_as_CaCO3_mgL:number){
  const A = (log10(TDS_mgL) - 1)/10;
  const B = -13.12*log10(T_C + 273) + 34.55;
  const C = log10(Ca_as_CaCO3_mgL) - 0.4;
  const D = log10(Alk_as_CaCO3_mgL);
  return (9.3 + A + B) - (C + D);
}

export function LSI(pH:number, T_C:number, TDS_mgL:number, Ca_as_CaCO3_mgL:number, Alk_as_CaCO3_mgL:number){
  return pH - pHs(T_C, TDS_mgL, Ca_as_CaCO3_mgL, Alk_as_CaCO3_mgL);
}

// Correct Ryznar Stability Index formula
export function RSI(pH: number, pHs_value: number) {
  return 2 * pHs_value - pH;
}

// Legacy function for backwards compatibility
export function RSI_from_LSI(lsi:number){ return 2 - lsi; }

// TODO: S&DSI, PSI لاحقاً بصيَغ موسعة مع ثوابت pK عند الطلب.
