import { DerivationStep, LDCalculationResult } from '../types/calculator';

/**
 * Calculates Liquidated Damages strictly adhering to contractual delay rules:
 * 1. Delay measured between Start Date and End Date.
 * 2. Partial weeks are rounded UP to the next complete week (e.g. 0.6 wk -> 1 wk).
 * 3. 1 week = 0.5% LD.
 * 4. Partial additional weeks are treated as complete weeks (e.g. 1 wk + 1 day = 8 days -> 2 wks).
 * 5. LD percentage maximum cap of 10.0% (reached at 20 weeks).
 * 6. LD Amount = Amount × Applicable % / 100.
 * Currency is strictly INR (₹) everywhere.
 */
export function calculateLD(
  startDateStr: string,
  endDateStr: string,
  amount: number
): LDCalculationResult | null {
  if (!startDateStr || !endDateStr || isNaN(amount) || amount < 0) {
    return null;
  }

  // Parse YYYY-MM-DD safely in UTC to avoid daylight saving shifts
  const [sY, sM, sD] = startDateStr.split('-').map(Number);
  const [eY, eM, eD] = endDateStr.split('-').map(Number);

  if (!sY || !sM || !sD || !eY || !eM || !eD) {
    return null;
  }

  const startUtc = Date.UTC(sY, sM - 1, sD);
  const endUtc = Date.UTC(eY, eM - 1, eD);

  const diffMs = endUtc - startUtc;
  const rawDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const isEarlyOrOnTime = rawDays <= 0;
  const totalDelayDays = Math.max(0, rawDays);

  // Exact calculated delay in weeks
  const calculatedDelayWeeks = totalDelayDays / 7;

  // Rounding up partial weeks
  // Rules 2 & 4: Any fraction of a week rounds up to the next whole week
  const roundedWeeks = totalDelayDays === 0 ? 0 : Math.ceil(totalDelayDays / 7);

  // 1 week = 0.5% LD (Rule 3)
  const rawPercentage = roundedWeeks * 0.5;

  // Cap at 10.0% (Rule 5)
  const maxCap = 10.0;
  const isCapped = rawPercentage > maxCap;
  const applicablePercentage = Math.min(maxCap, rawPercentage);

  // Liquidated Damages Amount = Amount * (Applicable % / 100) (Rule 6)
  const finalLDAmount = (amount * applicablePercentage) / 100;
  const netPayableAmount = Math.max(0, amount - finalLDAmount);

  // Transparent step-by-step derivation
  const derivationSteps: DerivationStep[] = [
    {
      stepNumber: 1,
      title: 'Determine Total Delay in Days',
      formula: 'Delay Days = End Date - Start Date',
      calculation: `${endDateStr} - ${startDateStr} = ${rawDays} day${rawDays === 1 ? '' : 's'}`,
      result: `${totalDelayDays} day${totalDelayDays === 1 ? '' : 's'} delay`,
      note: isEarlyOrOnTime
        ? 'Project completed on or before scheduled start/contractual date. No delay liquidated damages apply.'
        : undefined,
    },
    {
      stepNumber: 2,
      title: 'Calculate Exact Weeks of Delay',
      formula: 'Exact Delay Weeks = Total Delay Days / 7',
      calculation: `${totalDelayDays} days ÷ 7 days/week = ${calculatedDelayWeeks.toFixed(4)} weeks`,
      result: `${calculatedDelayWeeks.toFixed(2)} weeks`,
      ruleReference: 'Rule 1: Calculation considers the number of weeks between dates.',
    },
    {
      stepNumber: 3,
      title: 'Apply Round-Up Rule for Partial Weeks',
      formula: 'Rounded-Up Weeks = ⌈Delay Days / 7⌉',
      calculation:
        totalDelayDays === 0
          ? '0 weeks (No delay)'
          : `⌈${calculatedDelayWeeks.toFixed(4)} weeks⌉ = ${roundedWeeks} complete week${roundedWeeks === 1 ? '' : 's'}`,
      result: `${roundedWeeks} week${roundedWeeks === 1 ? '' : 's'}`,
      ruleReference:
        'Rules 2 & 4: Partial weeks are rounded up to the next complete week (e.g. 0.6 wk → 1 wk; 1 wk + 1 day → 2 wks).',
      note:
        totalDelayDays > 0 && totalDelayDays % 7 !== 0
          ? `Contains a partial week of ${totalDelayDays % 7} day(s), treated as 1 full week.`
          : undefined,
    },
    {
      stepNumber: 4,
      title: 'Compute Liquidated Damages Rate',
      formula: 'Raw LD % = Rounded Weeks × 0.5%',
      calculation: `${roundedWeeks} weeks × 0.5% per week = ${rawPercentage.toFixed(2)}%`,
      result: `${rawPercentage.toFixed(2)}%`,
      ruleReference: 'Rule 3: 1 week = 0.5% liquidated damages.',
    },
    {
      stepNumber: 5,
      title: 'Apply Statutory LD Cap (10% Maximum)',
      formula: 'Applicable % = min(Raw LD %, 10.0%)',
      calculation: isCapped
        ? `min(${rawPercentage.toFixed(2)}%, 10.0%) = 10.00% (Cap Reached)`
        : `min(${rawPercentage.toFixed(2)}%, 10.0%) = ${applicablePercentage.toFixed(2)}%`,
      result: `${applicablePercentage.toFixed(2)}%${isCapped ? ' (Capped at 10%)' : ''}`,
      ruleReference: 'Rule 5: Liquidated damages percentage has a maximum limit of 10%.',
      note: isCapped
        ? `Raw damages (${rawPercentage.toFixed(2)}% across ${roundedWeeks} weeks) exceeded the contractual limit. The penalty is capped at 10.00% (equivalent to 20 weeks).`
        : `Within statutory maximum limit (maximum allowable is 10.00%).`,
    },
    {
      stepNumber: 6,
      title: 'Calculate Final Liquidated Damages Amount',
      formula: 'LD Amount = Amount × (Applicable % / 100)',
      calculation: `${formatCurrency(amount)} × (${applicablePercentage.toFixed(2)} ÷ 100) = ${formatCurrency(finalLDAmount)}`,
      result: `${formatCurrency(finalLDAmount)}`,
      ruleReference: 'Rule 6: Liquidated Damages Amount = Amount × Applicable Percentage / 100',
    },
    {
      stepNumber: 7,
      title: 'Net Adjusted Contract Amount',
      formula: 'Net Payable = Contract Amount - LD Amount',
      calculation: `${formatCurrency(amount)} - ${formatCurrency(finalLDAmount)} = ${formatCurrency(netPayableAmount)}`,
      result: `${formatCurrency(netPayableAmount)}`,
      note: 'Amount payable to contractor/supplier after liquidated damages deduction.',
    },
  ];

  return {
    startDate: startDateStr,
    endDate: endDateStr,
    totalDelayDays,
    calculatedDelayWeeks: Number(calculatedDelayWeeks.toFixed(4)),
    roundedWeeks,
    rawPercentage: Number(rawPercentage.toFixed(2)),
    applicablePercentage: Number(applicablePercentage.toFixed(2)),
    isCapped,
    contractAmount: amount,
    finalLDAmount: Number(finalLDAmount.toFixed(2)),
    netPayableAmount: Number(netPayableAmount.toFixed(2)),
    derivationSteps,
    isEarlyOrOnTime,
  };
}

export function formatNumber(val: number): string {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

export function formatCurrency(val: number): string {
  return `₹ ${formatNumber(val)}`;
}

export function formatDatePretty(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return dateStr;
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
