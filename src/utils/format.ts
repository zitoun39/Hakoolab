// تنسيق أرقام موحد: منزلتان + وحدة اختيارية
export const fmt = (value: number, unit?: string) => {
  const n = new Intl.NumberFormat('ar-DZ', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(value);
  return unit ? `${n} ${unit}` : n;
};
