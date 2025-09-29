// أطوال/مساحات/حجوم
export const m_to_mm = (m:number)=> m*1000;
export const mm_to_m = (mm:number)=> mm/1000;

export const m3h_to_Ls = (m3h:number)=> m3h*1000/3600;
export const Ls_to_m3h = (Ls:number)=> Ls*3.6;
export const m3h_to_gpm = (m3h:number)=> m3h*440.0/100; // ≈ 1 m3/h = 4.402 gpm
export const gpm_to_m3h = (gpm:number)=> gpm/4.402;

export const C_to_F = (c:number)=> c*9/5 + 32;
export const F_to_C = (f:number)=> (f-32)*5/9;

/** موصلية↔TDS (عامل تقريبي 0.5..0.7، نأخذ 0.65 افتراضياً) */
export const EC_uScm_to_TDS_mgL = (EC:number, factor=0.65)=> EC*factor;
export const TDS_mgL_to_EC_uScm = (TDS:number, factor=0.65)=> TDS/factor;

/** صلابة: mg/L as CaCO3 ↔ °dH ↔ meq/L */
export const mgL_CaCO3_to_dH = (mgL:number)=> mgL/17.848;
export const dH_to_mgL_CaCO3 = (dH:number)=> dH*17.848;
export const mgL_CaCO3_to_meqL = (mgL:number)=> mgL/50.0;
export const meqL_to_mgL_CaCO3 = (meq:number)=> meq*50.0;
