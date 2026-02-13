/**
 * AI Financial Risk Radar - Risk scoring engine for middle-class India
 * Dimensions aligned to RBI household savings/debt context and common advisory norms
 */

const DIMENSIONS = [
  'Emergency Fund',
  'Debt Burden',
  'Savings Rate',
  'Insurance Cover',
  'Retirement Readiness',
  'Inflation Protection',
];

/**
 * Score 0–100 per dimension (100 = lowest risk, 0 = highest risk)
 * Radar displays "safety" so higher = better
 */
export function computeRiskScores(input) {
  const monthlyIncome = Number(input.monthlyIncome) || 0;
  const monthlyExpense = Number(input.monthlyExpense) || 0;
  const emergencyFund = Number(input.emergencyFund) || 0;
  const monthlyEMI = Number(input.monthlyEMI) || 0;
  const monthlySaving = Number(input.monthlySaving) || 0;
  const lifeCover = Number(input.lifeCover) || 0;
  const healthCover = Number(input.healthCover) || 0;
  const retirementCorpus = Number(input.retirementCorpus) || 0;
  const age = Number(input.age) || 30;
  const equityPercent = Number(input.equityPercent) || 0;

  const monthsOfExpense = monthlyExpense > 0 ? emergencyFund / monthlyExpense : 0;
  const emiToIncome = monthlyIncome > 0 ? (monthlyEMI / monthlyIncome) * 100 : 0;
  const savingsRate = monthlyIncome > 0 ? (monthlySaving / monthlyIncome) * 100 : 0;
  const lifeCoverYears = monthlyIncome > 0 ? lifeCover / (monthlyIncome * 12) : 0;
  const yearsToRetirement = Math.max(0, 58 - age); // assume 58 as retirement age
  const targetCorpus = monthlyExpense * 12 * 25; // 25x annual expense rule of thumb
  const retirementRatio = targetCorpus > 0 ? retirementCorpus / targetCorpus : 0;

  return {
    'Emergency Fund': scoreEmergencyFund(monthsOfExpense),
    'Debt Burden': scoreDebtBurden(emiToIncome),
    'Savings Rate': scoreSavingsRate(savingsRate),
    'Insurance Cover': scoreInsurance(lifeCoverYears, healthCover),
    'Retirement Readiness': scoreRetirement(retirementRatio, yearsToRetirement),
    'Inflation Protection': scoreInflationProtection(equityPercent, age),
  };
}

function scoreEmergencyFund(monthsOfExpense) {
  if (monthsOfExpense >= 9) return 100;
  if (monthsOfExpense >= 6) return 85;
  if (monthsOfExpense >= 4) return 65;
  if (monthsOfExpense >= 2) return 40;
  if (monthsOfExpense >= 1) return 20;
  return 5;
}

function scoreDebtBurden(emiToIncomePercent) {
  if (emiToIncomePercent <= 25) return 100;
  if (emiToIncomePercent <= 35) return 80;
  if (emiToIncomePercent <= 45) return 55;
  if (emiToIncomePercent <= 55) return 30;
  return Math.max(0, 20 - emiToIncomePercent / 5);
}

function scoreSavingsRate(percent) {
  if (percent >= 30) return 100;
  if (percent >= 20) return 85;
  if (percent >= 15) return 70;
  if (percent >= 10) return 50;
  if (percent >= 5) return 30;
  return Math.min(25, percent * 5);
}

function scoreInsurance(lifeCoverYears, healthCoverLakh) {
  const lifeScore = lifeCoverYears >= 12 ? 100 : lifeCoverYears >= 10 ? 85 : lifeCoverYears >= 7 ? 65 : lifeCoverYears >= 5 ? 45 : Math.min(40, lifeCoverYears * 8);
  const healthScore = healthCoverLakh >= 20 ? 100 : healthCoverLakh >= 10 ? 85 : healthCoverLakh >= 5 ? 65 : healthCoverLakh >= 3 ? 45 : Math.min(40, healthCoverLakh * 12);
  return Math.round((lifeScore + healthScore) / 2);
}

function scoreRetirement(retirementRatio, yearsToRetirement) {
  const targetRatio = Math.min(1, yearsToRetirement / 30);
  if (retirementRatio >= targetRatio * 1.2) return 100;
  if (retirementRatio >= targetRatio) return 80;
  if (retirementRatio >= targetRatio * 0.6) return 55;
  if (retirementRatio >= targetRatio * 0.3) return 35;
  return Math.min(30, retirementRatio * 80);
}

function scoreInflationProtection(equityPercent, age) {
  const idealEquity = Math.max(20, 100 - age);
  const diff = Math.abs(equityPercent - idealEquity);
  if (diff <= 10) return 100;
  if (diff <= 20) return 75;
  if (diff <= 30) return 50;
  return Math.max(15, 55 - diff);
}

export function getOverallGrade(scores) {
  const avg = Object.values(scores).reduce((a, b) => a + b, 0) / 6;
  if (avg >= 80) return { grade: 'A', label: 'Low risk', color: '#22c55e' };
  if (avg >= 65) return { grade: 'B', label: 'Moderate risk', color: '#84cc16' };
  if (avg >= 50) return { grade: 'C', label: 'Elevated risk', color: '#eab308' };
  if (avg >= 35) return { grade: 'D', label: 'High risk', color: '#f97316' };
  return { grade: 'E', label: 'Critical risk', color: '#ef4444' };
}

export function generateInsights(input, scores) {
  const insights = [];
  const s = scores;

  if (s['Emergency Fund'] < 50) {
    insights.push({
      type: 'warning',
      title: 'Low emergency buffer',
      text: 'Aim for at least 6 months of expenses in liquid savings (FD/savings account). Middle-class India is seeing rising household debt—your buffer is your first line of defence.',
    });
  }
  if (s['Debt Burden'] < 50) {
    insights.push({
      type: 'warning',
      title: 'High EMI burden',
      text: 'Keep total EMI under 35–40% of income. Consider prepaying high-cost debt (credit cards, personal loans) before adding new loans.',
    });
  }
  if (s['Savings Rate'] < 50) {
    insights.push({
      type: 'warning',
      title: 'Savings rate below par',
      text: 'Household savings rate in India has fallen. Try to save at least 20% of income; automate SIPs so savings happen before spending.',
    });
  }
  if (s['Insurance Cover'] < 50) {
    insights.push({
      type: 'warning',
      title: 'Insurance gap',
      text: 'Life cover should be 10–12× annual income; health cover at least ₹5–10 lakh for a family. Term plans are affordable and essential.',
    });
  }
  if (s['Retirement Readiness'] < 50) {
    insights.push({
      type: 'warning',
      title: 'Retirement corpus behind target',
      text: 'Use NPS, EPF, and PPF for tax-efficient long-term growth. Target 25× annual expenses by retirement—start early to benefit from compounding.',
    });
  }
  if (s['Inflation Protection'] < 50) {
    insights.push({
      type: 'info',
      title: 'Rebalance for inflation',
      text: 'A mix of equity (MF/ULIP) and fixed income helps beat inflation over time. Rule of thumb: (100 − age)% in equity, rest in debt/gold.',
    });
  }

  const strong = Object.entries(s).filter(([, v]) => v >= 75).map(([k]) => k);
  if (strong.length > 0) {
    insights.push({
      type: 'success',
      title: 'Your strengths',
      text: `${strong.join(', ')} ${strong.length === 1 ? 'is' : 'are'} in good shape. Build on these while you fix the weaker areas.`,
    });
  }

  return insights;
}

export { DIMENSIONS };
