// Common calculation input/output types
export interface CalculationInputs {
  [key: string]: string | number | boolean;
}

export interface CalculationOutputs {
  [key: string]: string | number | boolean;
}

// TDS Calculator Types
export interface TDSInputs extends CalculationInputs {
  value: number;
  inputUnit: 'tds' | 'conductivity';
  conversionFactor: number;
}

export interface TDSOutputs extends CalculationOutputs {
  result: number;
  unit: string;
  formula: string;
}

// LSI Calculator Types
export interface LSIInputs extends CalculationInputs {
  pH: number;
  temperature: number;
  tds: number;
  calciumHardness: number;
  alkalinity: number;
}

export interface LSIOutputs extends CalculationOutputs {
  lsi: number;
  pHs: number;
  interpretation: string;
  category: 'scaling' | 'corrosive' | 'balanced';
}

// Chlorine Dosing Types
export interface ChlorineDoseInputs extends CalculationInputs {
  flowRate: number; // m3/h
  targetDose: number; // mg/L
  availableChlorine: number; // %
  solutionDensity: number; // g/mL
}

export interface ChlorineDoseOutputs extends CalculationOutputs {
  stockConcentration: number; // mg/L
  doseFlowRate: number; // L/h
  dailyConsumption: number; // L/day
}

// Pump Power Types
export interface PumpPowerInputs extends CalculationInputs {
  flowRate: number; // m3/h
  head: number; // m
  efficiency: number; // %
  fluidDensity: number; // kg/m3
}

export interface PumpPowerOutputs extends CalculationOutputs {
  waterPower: number; // kW
  brakePower: number; // kW
  motorPower: number; // kW (with motor efficiency)
  current: number; // A (3-phase)
}

// RO System Types
export interface ROInputs extends CalculationInputs {
  feedFlow: number; // m3/h
  feedTDS: number; // mg/L
  permeateFlow: number; // m3/h
  permeateTDS: number; // mg/L
  membraneArea: number; // m2
}

export interface ROOutputs extends CalculationOutputs {
  recovery: number; // %
  saltRejection: number; // %
  concentrationFactor: number;
  flux: number; // LMH
  brineFlow: number; // m3/h
  brineTDS: number; // mg/L
}

// Unit conversion types
export interface ConversionInputs extends CalculationInputs {
  value: number;
  fromUnit: string;
  toUnit: string;
}

export interface ConversionOutputs extends CalculationOutputs {
  convertedValue: number;
  fromUnit: string;
  toUnit: string;
  conversionFactor: number;
}

// Error types
export interface CalculationError {
  code: string;
  message: string;
  field?: string;
}

// Validation types
export type ValidationResult = {
  isValid: boolean;
  errors: CalculationError[];
};

// Formula information
export interface FormulaInfo {
  title: string;
  description: string;
  formula: string;
  variables: Array<{
    symbol: string;
    description: string;
    unit: string;
  }>;
  notes?: string[];
  references?: string[];
}

// Calculator metadata
export interface CalculatorMeta {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  tags: string[];
  version: string;
  lastUpdated: string;
  formula?: FormulaInfo;
}

// History and favorites
export interface CalculationRecord {
  id: string;
  calculatorId: string;
  inputs: CalculationInputs;
  outputs: CalculationOutputs;
  timestamp: number;
  isFavorite?: boolean;
  notes?: string;
}

// App configuration
export interface AppConfig {
  language: 'ar' | 'en';
  theme: 'light' | 'dark' | 'auto';
  decimalPlaces: number;
  defaultUnits: {
    pressure: 'bar' | 'psi' | 'kPa';
    flow: 'm3h' | 'Ls' | 'gpm';
    temperature: 'C' | 'F';
    concentration: 'mgL' | 'ppm' | 'percent';
  };
  notifications: {
    enabled: boolean;
    reminders: boolean;
  };
}

// User preferences
export interface UserPreferences extends AppConfig {
  favoriteCalculators: string[];
  recentCalculators: string[];
  customFormulas: FormulaInfo[];
}