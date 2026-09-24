export interface LDInputs {
  startDate: string;
  endDate: string;
  amount: number | '';
  contractRef?: string;
}

export interface DerivationStep {
  stepNumber: number;
  title: string;
  formula: string;
  calculation: string;
  result: string;
  ruleReference?: string;
  note?: string;
}

export interface LDCalculationResult {
  startDate: string;
  endDate: string;
  totalDelayDays: number;
  calculatedDelayWeeks: number;
  roundedWeeks: number;
  rawPercentage: number;
  applicablePercentage: number;
  isCapped: boolean;
  contractAmount: number;
  finalLDAmount: number;
  netPayableAmount: number;
  derivationSteps: DerivationStep[];
  isEarlyOrOnTime: boolean;
}

export interface CalculationHistoryItem {
  id: string;
  timestamp: number;
  contractRef: string;
  inputs: {
    startDate: string;
    endDate: string;
    amount: number;
  };
  result: LDCalculationResult;
}
