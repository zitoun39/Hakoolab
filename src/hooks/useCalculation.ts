import { useState, useCallback } from 'react';
import { Alert } from 'react-native';

type CalculationFunction<TInputs, TOutputs> = (inputs: TInputs) => TOutputs | Promise<TOutputs>;

interface UseCalculationOptions<TInputs> {
  validateInputs?: (inputs: TInputs) => string | null;
  onSuccess?: (outputs: any) => void;
  onError?: (error: string) => void;
}

export function useCalculation<TInputs, TOutputs>(
  calculationFn: CalculationFunction<TInputs, TOutputs>,
  options?: UseCalculationOptions<TInputs>
) {
  const [isCalculating, setIsCalculating] = useState(false);
  const [outputs, setOutputs] = useState<TOutputs | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(async (inputs: TInputs) => {
    try {
      setIsCalculating(true);
      setError(null);

      // Validate inputs if validator provided
      if (options?.validateInputs) {
        const validationError = options.validateInputs(inputs);
        if (validationError) {
          throw new Error(validationError);
        }
      }

      // Perform calculation
      const result = await calculationFn(inputs);
      setOutputs(result);
      options?.onSuccess?.(result);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
      setError(errorMessage);
      options?.onError?.(errorMessage);
      Alert.alert('خطأ في الحساب', errorMessage);
    } finally {
      setIsCalculating(false);
    }
  }, [calculationFn, options]);

  const reset = useCallback(() => {
    setOutputs(null);
    setError(null);
    setIsCalculating(false);
  }, []);

  return {
    calculate,
    reset,
    isCalculating,
    outputs,
    error,
    hasOutputs: outputs !== null,
  };
}

// Specific calculation hooks
export function useTDSCalculation() {
  return useCalculation(
    ({ value, inputUnit, factor }: { value: number; inputUnit: 'tds' | 'conductivity'; factor: number }) => {
      if (!value || !factor || factor === 0) {
        throw new Error('يرجى إدخال قيم صحيحة');
      }

      let result: { value: number; unit: string };
      
      if (inputUnit === 'conductivity') {
        // EC to TDS: TDS (ppm) = EC (µS/cm) * K
        result = {
          value: value * factor,
          unit: 'ppm'
        };
      } else {
        // TDS to EC: EC (µS/cm) = TDS (ppm) / K
        result = {
          value: value / factor,
          unit: 'µS/cm'
        };
      }

      return result;
    },
    {
      validateInputs: ({ value, factor }) => {
        if (!value || value <= 0) return 'يرجى إدخال قيمة صحيحة أكبر من الصفر';
        if (!factor || factor <= 0) return 'يرجى إدخال معامل تحويل صحيح أكبر من الصفر';
        return null;
      }
    }
  );
}

export function useLSICalculation() {
  return useCalculation(
    ({ pH, temperature, tds, calciumHardness, alkalinity }: {
      pH: number;
      temperature: number;
      tds: number;
      calciumHardness: number;
      alkalinity: number;
    }) => {
      // Calculate intermediate factors
      const A = (Math.log10(tds) - 1) / 10;
      const B = -13.12 * Math.log10(temperature + 273) + 34.55;
      const C = Math.log10(calciumHardness) - 0.4;
      const D = Math.log10(alkalinity);

      // Calculate pHs
      const pHs = (9.3 + A + B) - (C + D);

      // Calculate LSI
      const lsi = pH - pHs;

      let interpretation: string;
      if (lsi > 0.1) {
        interpretation = "الماء له قابلية للترسيب";
      } else if (lsi < -0.1) {
        interpretation = "الماء له قابلية للتآكل";
      } else {
        interpretation = "الماء متوازن";
      }

      return {
        lsi: Number(lsi.toFixed(3)),
        pHs: Number(pHs.toFixed(3)),
        interpretation,
      };
    },
    {
      validateInputs: ({ pH, temperature, tds, calciumHardness, alkalinity }) => {
        if (!pH || pH < 0 || pH > 14) return 'قيمة pH يجب أن تكون بين 0 و 14';
        if (!temperature || temperature < -50 || temperature > 100) return 'درجة الحرارة يجب أن تكون بين -50 و 100°C';
        if (!tds || tds <= 0) return 'قيمة TDS يجب أن تكون أكبر من الصفر';
        if (!calciumHardness || calciumHardness <= 0) return 'عسر الكالسيوم يجب أن يكون أكبر من الصفر';
        if (!alkalinity || alkalinity <= 0) return 'القلوية يجب أن تكون أكبر من الصفر';
        return null;
      }
    }
  );
}