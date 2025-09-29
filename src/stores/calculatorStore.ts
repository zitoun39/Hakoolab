import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CalculatorType = 
  | 'tds' 
  | 'hardness' 
  | 'lsi' 
  | 'molecular-weight' 
  | 'osmotic-pressure'
  | 'chlorine-dose'
  | 'c1v1'
  | 'whp-bhp'
  | 'tdh'
  | 'three-phase'
  | 'ro-basics';

export type CalculatorState = {
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  isCalculating: boolean;
  error: string | null;
  lastCalculated: number;
};

type CalculatorStore = {
  calculators: Record<CalculatorType, CalculatorState>;
  
  // Actions
  setInputs: (type: CalculatorType, inputs: Record<string, any>) => void;
  setOutputs: (type: CalculatorType, outputs: Record<string, any>) => void;
  setCalculating: (type: CalculatorType, isCalculating: boolean) => void;
  setError: (type: CalculatorType, error: string | null) => void;
  resetCalculator: (type: CalculatorType) => void;
  
  // History
  addToHistory: (type: CalculatorType, record: {
    inputs: Record<string, any>;
    outputs: Record<string, any>;
    timestamp: number;
  }) => void;
  
  // Selectors (using subscribeWithSelector)
  getCalculator: (type: CalculatorType) => CalculatorState;
};

const defaultCalculatorState: CalculatorState = {
  inputs: {},
  outputs: {},
  isCalculating: false,
  error: null,
  lastCalculated: 0,
};

export const useCalculatorStore = create<CalculatorStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        calculators: {} as Record<CalculatorType, CalculatorState>,

        setInputs: (type, inputs) => 
          set((state) => ({
            calculators: {
              ...state.calculators,
              [type]: {
                ...state.calculators[type] || defaultCalculatorState,
                inputs: { ...state.calculators[type]?.inputs, ...inputs },
                error: null, // Clear error when inputs change
              }
            }
          })),

        setOutputs: (type, outputs) => 
          set((state) => ({
            calculators: {
              ...state.calculators,
              [type]: {
                ...state.calculators[type] || defaultCalculatorState,
                outputs,
                lastCalculated: Date.now(),
                isCalculating: false,
              }
            }
          })),

        setCalculating: (type, isCalculating) => 
          set((state) => ({
            calculators: {
              ...state.calculators,
              [type]: {
                ...state.calculators[type] || defaultCalculatorState,
                isCalculating,
              }
            }
          })),

        setError: (type, error) => 
          set((state) => ({
            calculators: {
              ...state.calculators,
              [type]: {
                ...state.calculators[type] || defaultCalculatorState,
                error,
                isCalculating: false,
              }
            }
          })),

        resetCalculator: (type) => 
          set((state) => ({
            calculators: {
              ...state.calculators,
              [type]: defaultCalculatorState,
            }
          })),

        addToHistory: (type, record) => {
          // This could be extended to store calculation history
          // For now, we just update the lastCalculated timestamp
          set((state) => ({
            calculators: {
              ...state.calculators,
              [type]: {
                ...state.calculators[type] || defaultCalculatorState,
                lastCalculated: record.timestamp,
              }
            }
          }));
        },

        getCalculator: (type) => 
          get().calculators[type] || defaultCalculatorState,
      }),
      {
        name: 'calculator-store',
        storage: createJSONStorage(() => AsyncStorage),
        // Only persist inputs and outputs, not loading states
        partialize: (state) => ({
          calculators: Object.entries(state.calculators).reduce(
            (acc, [key, value]) => ({
              ...acc,
              [key]: {
                inputs: value.inputs,
                outputs: value.outputs,
                lastCalculated: value.lastCalculated,
                isCalculating: false,
                error: null,
              }
            }),
            {} as Record<CalculatorType, CalculatorState>
          )
        }),
      }
    )
  )
);

// Custom hooks for specific calculators
export const useTDSCalculator = () => {
  const calculator = useCalculatorStore((state) => state.getCalculator('tds'));
  const setInputs = useCalculatorStore((state) => state.setInputs);
  const setOutputs = useCalculatorStore((state) => state.setOutputs);
  const setCalculating = useCalculatorStore((state) => state.setCalculating);
  const setError = useCalculatorStore((state) => state.setError);

  return {
    ...calculator,
    setInputs: (inputs: Record<string, any>) => setInputs('tds', inputs),
    setOutputs: (outputs: Record<string, any>) => setOutputs('tds', outputs),
    setCalculating: (isCalculating: boolean) => setCalculating('tds', isCalculating),
    setError: (error: string | null) => setError('tds', error),
  };
};

export const useLSICalculator = () => {
  const calculator = useCalculatorStore((state) => state.getCalculator('lsi'));
  const setInputs = useCalculatorStore((state) => state.setInputs);
  const setOutputs = useCalculatorStore((state) => state.setOutputs);
  const setCalculating = useCalculatorStore((state) => state.setCalculating);
  const setError = useCalculatorStore((state) => state.setError);

  return {
    ...calculator,
    setInputs: (inputs: Record<string, any>) => setInputs('lsi', inputs),
    setOutputs: (outputs: Record<string, any>) => setOutputs('lsi', outputs),
    setCalculating: (isCalculating: boolean) => setCalculating('lsi', isCalculating),
    setError: (error: string | null) => setError('lsi', error),
  };
};

// Add more specific calculator hooks as needed...