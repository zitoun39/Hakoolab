import createContextHook from "@nkzw/create-context-hook";
import { useState, useCallback, useMemo } from "react";

// Atomic weights map for molecular weight calculation
const atomicWeights: { [key: string]: number } = {
  H: 1.008,
  He: 4.003,
  Li: 6.94,
  Be: 9.012,
  B: 10.81,
  C: 12.011,
  N: 14.007,
  O: 15.999,
  F: 18.998,
  Ne: 20.180,
  Na: 22.990,
  Mg: 24.305,
  Al: 26.982,
  Si: 28.085,
  P: 30.974,
  S: 32.06,
  Cl: 35.45,
  Ar: 39.948,
  K: 39.098,
  Ca: 40.078,
  Sc: 44.956,
  Ti: 47.867,
  V: 50.942,
  Cr: 51.996,
  Mn: 54.938,
  Fe: 55.845,
  Co: 58.933,
  Ni: 58.693,
  Cu: 63.546,
  Zn: 65.38,
  Ga: 69.723,
  Ge: 72.630,
  As: 74.922,
  Se: 78.971,
  Br: 79.904,
  Kr: 83.798,
  Rb: 85.468,
  Sr: 87.62,
  Y: 88.906,
  Zr: 91.224,
  Nb: 92.906,
  Mo: 95.95,
  Tc: 98,
  Ru: 101.07,
  Rh: 102.906,
  Pd: 106.42,
  Ag: 107.868,
  Cd: 112.411,
  In: 114.818,
  Sn: 118.710,
  Sb: 121.760,
  Te: 127.60,
  I: 126.904,
  Xe: 131.293,
  Cs: 132.905,
  Ba: 137.327,
  La: 138.905,
  Ce: 140.116,
  Pr: 140.908,
  Nd: 144.242,
  Pm: 145,
  Sm: 150.36,
  Eu: 151.964,
  Gd: 157.25,
  Tb: 158.925,
  Dy: 162.500,
  Ho: 164.930,
  Er: 167.259,
  Tm: 168.934,
  Yb: 173.045,
  Lu: 174.967,
  Hf: 178.49,
  Ta: 180.948,
  W: 183.84,
  Re: 186.207,
  Os: 190.23,
  Ir: 192.217,
  Pt: 195.084,
  Au: 196.967,
  Hg: 200.592,
  Tl: 204.38,
  Pb: 207.2,
  Bi: 208.980,
  Po: 209,
  At: 210,
  Rn: 222,
  Fr: 223,
  Ra: 226,
  Ac: 227,
  Th: 232.038,
  Pa: 231.036,
  U: 238.029,
};

interface TDSConverterState {
  value: string;
  inputUnit: "tds" | "conductivity";
  conversionFactor: string;
  result: string;
}

interface HardnessConverterState {
  value: string;
  inputUnit: "mgL" | "dH" | "fH" | "ppm";
  results: {
    mgL: string;
    dH: string;
    fH: string;
    ppm: string;
  };
}

interface LSICalculatorState {
  pH: string;
  temperature: string;
  tds: string;
  calciumHardness: string;
  alkalinity: string;
  lsi: string;
  interpretation: string;
}

interface MolecularWeightState {
  formula: string;
  molecularWeight: string;
  error: string;
}

interface OsmoticPressureState {
  molarity: string;
  temperature: string;
  vantHoffFactor: string;
  osmoticPressure: string;
}

interface CalculatorContextType {
  tdsConverter: TDSConverterState;
  setTDSConverter: (state: Partial<TDSConverterState>) => void;
  hardnessConverter: HardnessConverterState;
  setHardnessConverter: (state: Partial<HardnessConverterState>) => void;
  lsiCalculator: LSICalculatorState;
  setLSICalculator: (state: Partial<LSICalculatorState>) => void;
  molecularWeight: MolecularWeightState;
  setMolecularWeight: (state: Partial<MolecularWeightState>) => void;
  osmoticPressure: OsmoticPressureState;
  setOsmoticPressure: (state: Partial<OsmoticPressureState>) => void;
  calculateTDS: (value: string, inputUnit: "tds" | "conductivity", factor: string) => void;
  calculateHardness: (value: string, inputUnit: "mgL" | "dH" | "fH" | "ppm") => void;
  calculateLSI: (pH: string, temp: string, tds: string, calcium: string, alkalinity: string) => void;
  calculateMolecularWeight: (formula: string) => void;
  calculateOsmoticPressure: (molarity: string, temperature: string, vantHoffFactor: string) => void;
}

export const [CalculatorProvider, useCalculator] = createContextHook<CalculatorContextType>(() => {
  const [tdsConverter, setTDSConverterState] = useState<TDSConverterState>({
    value: "",
    inputUnit: "conductivity",
    conversionFactor: "0.64",
    result: "",
  });

  const [hardnessConverter, setHardnessConverterState] = useState<HardnessConverterState>({
    value: "",
    inputUnit: "mgL",
    results: {
      mgL: "",
      dH: "",
      fH: "",
      ppm: "",
    },
  });

  const [lsiCalculator, setLSICalculatorState] = useState<LSICalculatorState>({
    pH: "",
    temperature: "",
    tds: "",
    calciumHardness: "",
    alkalinity: "",
    lsi: "",
    interpretation: "",
  });

  const [molecularWeight, setMolecularWeightState] = useState<MolecularWeightState>({
    formula: "",
    molecularWeight: "",
    error: "",
  });

  const [osmoticPressure, setOsmoticPressureState] = useState<OsmoticPressureState>({
    molarity: "",
    temperature: "",
    vantHoffFactor: "1",
    osmoticPressure: "",
  });

  const setTDSConverter = useCallback((newState: Partial<TDSConverterState>) => {
    setTDSConverterState(prev => ({ ...prev, ...newState }));
  }, []);

  const setHardnessConverter = useCallback((newState: Partial<HardnessConverterState>) => {
    setHardnessConverterState(prev => ({ ...prev, ...newState }));
  }, []);

  const setLSICalculator = useCallback((newState: Partial<LSICalculatorState>) => {
    setLSICalculatorState(prev => ({ ...prev, ...newState }));
  }, []);

  const setMolecularWeight = useCallback((newState: Partial<MolecularWeightState>) => {
    setMolecularWeightState(prev => ({ ...prev, ...newState }));
  }, []);

  const setOsmoticPressure = useCallback((newState: Partial<OsmoticPressureState>) => {
    setOsmoticPressureState(prev => ({ ...prev, ...newState }));
  }, []);

  const calculateTDS = useCallback((value: string, inputUnit: "tds" | "conductivity", factor: string) => {
    const numValue = parseFloat(value);
    const numFactor = parseFloat(factor);
    
    if (isNaN(numValue) || isNaN(numFactor) || numFactor === 0) {
      setTDSConverterState(prev => ({ ...prev, result: "" }));
      return;
    }

    let result: string;
    if (inputUnit === "conductivity") {
      // EC to TDS: TDS (ppm) = EC (µS/cm) * K
      const tdsValue = numValue * numFactor;
      result = `${tdsValue.toFixed(2)} ppm`;
    } else {
      // TDS to EC: EC (µS/cm) = TDS (ppm) / K
      const ecValue = numValue / numFactor;
      result = `${ecValue.toFixed(2)} µS/cm`;
    }

    setTDSConverterState(prev => ({ ...prev, result }));
  }, []);

  const calculateHardness = useCallback((value: string, inputUnit: "mgL" | "dH" | "fH" | "ppm") => {
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
      setHardnessConverterState(prev => ({
        ...prev,
        results: { mgL: "", dH: "", fH: "", ppm: "" }
      }));
      return;
    }

    // Convert input to mg/L first (base unit)
    let mgLValue: number;
    switch (inputUnit) {
      case "mgL":
        mgLValue = numValue;
        break;
      case "dH":
        mgLValue = numValue * 17.8;
        break;
      case "fH":
        mgLValue = numValue * 10;
        break;
      case "ppm":
        mgLValue = numValue;
        break;
      default:
        mgLValue = numValue;
    }

    // Convert from mg/L to all other units
    const results = {
      mgL: mgLValue.toFixed(2),
      dH: (mgLValue / 17.8).toFixed(2),
      fH: (mgLValue / 10).toFixed(2),
      ppm: mgLValue.toFixed(2),
    };

    setHardnessConverterState(prev => ({ ...prev, results }));
  }, []);

  const calculateLSI = useCallback((pH: string, temp: string, tds: string, calcium: string, alkalinity: string) => {
    const numPH = parseFloat(pH);
    const numTemp = parseFloat(temp);
    const numTDS = parseFloat(tds);
    const numCalcium = parseFloat(calcium);
    const numAlkalinity = parseFloat(alkalinity);

    if (isNaN(numPH) || isNaN(numTemp) || isNaN(numTDS) || isNaN(numCalcium) || isNaN(numAlkalinity)) {
      setLSICalculatorState(prev => ({ ...prev, lsi: "", interpretation: "" }));
      return;
    }

    // Calculate intermediate factors
    const A = (Math.log10(numTDS) - 1) / 10;
    const B = -13.12 * Math.log10(numTemp + 273) + 34.55;
    const C = Math.log10(numCalcium) - 0.4;
    const D = Math.log10(numAlkalinity);

    // Calculate pHs
    const pHs = (9.3 + A + B) - (C + D);

    // Calculate LSI
    const lsiValue = numPH - pHs;

    let interpretation: string;
    if (lsiValue > 0.1) {
      interpretation = "الماء له قابلية للترسيب";
    } else if (lsiValue < -0.1) {
      interpretation = "الماء له قابلية للتآكل";
    } else {
      interpretation = "الماء متوازن";
    }

    setLSICalculatorState(prev => ({
      ...prev,
      lsi: lsiValue.toFixed(3),
      interpretation,
    }));
  }, []);



  const calculateMolecularWeight = useCallback((formula: string) => {
    if (!formula.trim()) {
      setMolecularWeightState(prev => ({ ...prev, molecularWeight: "", error: "" }));
      return;
    }

    try {
      // Parse the chemical formula
      const regex = /([A-Z][a-z]?)(\d*)/g;
      let match;
      let totalWeight = 0;
      let hasValidElements = false;

      while ((match = regex.exec(formula)) !== null) {
        const element = match[1];
        const count = match[2] ? parseInt(match[2]) : 1;

        if (atomicWeights[element]) {
          totalWeight += atomicWeights[element] * count;
          hasValidElements = true;
        } else {
          setMolecularWeightState(prev => ({
            ...prev,
            molecularWeight: "",
            error: `عنصر غير معروف: ${element}`,
          }));
          return;
        }
      }

      if (!hasValidElements) {
        setMolecularWeightState(prev => ({
          ...prev,
          molecularWeight: "",
          error: "صيغة كيميائية غير صحيحة",
        }));
        return;
      }

      setMolecularWeightState(prev => ({
        ...prev,
        molecularWeight: totalWeight.toFixed(3),
        error: "",
      }));
    } catch {
      setMolecularWeightState(prev => ({
        ...prev,
        molecularWeight: "",
        error: "خطأ في تحليل الصيغة الكيميائية",
      }));
    }
  }, []);

  const calculateOsmoticPressure = useCallback((molarity: string, temperature: string, vantHoffFactor: string) => {
    const numMolarity = parseFloat(molarity);
    const numTemperature = parseFloat(temperature);
    const numVantHoffFactor = parseFloat(vantHoffFactor);

    if (isNaN(numMolarity) || isNaN(numTemperature) || isNaN(numVantHoffFactor)) {
      setOsmoticPressureState(prev => ({ ...prev, osmoticPressure: "" }));
      return;
    }

    // van't Hoff equation: Π = i * M * R * T
    // R = 0.0821 L·atm/(mol·K)
    // T in Kelvin = T(°C) + 273.15
    const R = 0.0821;
    const temperatureKelvin = numTemperature + 273.15;
    const osmoticPressureValue = numVantHoffFactor * numMolarity * R * temperatureKelvin;

    setOsmoticPressureState(prev => ({
      ...prev,
      osmoticPressure: osmoticPressureValue.toFixed(3),
    }));
  }, []);

  return useMemo(() => ({
    tdsConverter,
    setTDSConverter,
    hardnessConverter,
    setHardnessConverter,
    lsiCalculator,
    setLSICalculator,
    molecularWeight,
    setMolecularWeight,
    osmoticPressure,
    setOsmoticPressure,
    calculateTDS,
    calculateHardness,
    calculateLSI,
    calculateMolecularWeight,
    calculateOsmoticPressure,
  }), [
    tdsConverter,
    setTDSConverter,
    hardnessConverter,
    setHardnessConverter,
    lsiCalculator,
    setLSICalculator,
    molecularWeight,
    setMolecularWeight,
    osmoticPressure,
    setOsmoticPressure,
    calculateTDS,
    calculateHardness,
    calculateLSI,
    calculateMolecularWeight,
    calculateOsmoticPressure,
  ]);
});