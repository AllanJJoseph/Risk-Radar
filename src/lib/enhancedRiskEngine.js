/**
 * Enhanced Risk Engine with Predictive Analytics and Advanced Features
 * All 10 advanced features for Financial Risk Radar
 */

import { computeRiskScores, getOverallGrade, DIMENSIONS } from './riskEngine.js';

// Feature 1: Future Risk Forecast (Predictive Mode)
export function forecastFutureRisk(currentData, monthsAhead = 6) {
  const {
    monthlyIncome = 0,
    monthlyExpense = 0,
    emergencyFund = 0,
    monthlyEMI = 0,
    monthlySaving = 0,
    age = 30,
  } = currentData;

  // Projections
  const inflationRate = 0.05; // 5% annual inflation
  const expenseGrowth = (inflationRate / 12) * monthsAhead;
  const projectedExpense = monthlyExpense * (1 + expenseGrowth);
  
  // Savings projection (assume consistent saving)
  const projectedSavings = monthlySaving * monthsAhead;
  const projectedEmergencyFund = emergencyFund + projectedSavings;
  const projectedMonthsOfExpense = projectedExpense > 0 
    ? projectedEmergencyFund / projectedExpense 
    : 0;

  // EMI burden projection (assume income grows slower than expenses)
  const incomeGrowth = (0.03 / 12) * monthsAhead; // 3% annual
  const projectedIncome = monthlyIncome * (1 + incomeGrowth);
  const projectedEMIBurden = projectedIncome > 0 
    ? (monthlyEMI / projectedIncome) * 100 
    : 0;

  const projectedData = {
    ...currentData,
    monthlyExpense: projectedExpense,
    emergencyFund: projectedEmergencyFund,
    monthlyIncome: projectedIncome,
    age: age + (monthsAhead / 12),
  };

  const currentScores = computeRiskScores(currentData);
  const projectedScores = computeRiskScores(projectedData);

  const warnings = [];
  if (projectedMonthsOfExpense < 2) {
    const monthsUntil = Math.ceil((2 * projectedExpense - projectedEmergencyFund) / monthlySaving);
    warnings.push({
      type: 'critical',
      message: `Emergency buffer drops to ${projectedMonthsOfExpense.toFixed(1)} months in ${monthsAhead} months.`,
      timeline: `${monthsUntil} months until critical threshold`,
    });
  }

  return {
    monthsAhead,
    currentScores,
    projectedScores,
    projectedData,
    warnings,
    changes: DIMENSIONS.map(dim => ({
      dimension: dim,
      current: currentScores[dim],
      projected: projectedScores[dim],
      change: projectedScores[dim] - currentScores[dim],
    })),
  };
}

// Feature 2: Behavioral Spending Risk Detector
export function detectBehavioralRisks(history) {
  if (!history || history.length < 2) {
    return { detected: false, insights: [] };
  }

  const insights = [];
  const recent = history.slice(-3);
  const older = history.slice(0, -3);

  if (recent.length > 0 && older.length > 0) {
    const avgRecentSavingsRate = recent.reduce((sum, h) => sum + (h.savingsRate || 0), 0) / recent.length;
    const avgOlderSavingsRate = older.reduce((sum, h) => sum + (h.savingsRate || 0), 0) / older.length;
    
    if (avgRecentSavingsRate < avgOlderSavingsRate * 0.85) {
      const drop = ((avgOlderSavingsRate - avgRecentSavingsRate) / avgOlderSavingsRate * 100).toFixed(1);
      insights.push({
        type: 'warning',
        pattern: 'Declining Savings Discipline',
        message: `Savings rate dropped ${drop}% over last ${recent.length} updates.`,
        severity: drop > 20 ? 'high' : 'medium',
      });
    }

    const avgRecentExpense = recent.reduce((sum, h) => sum + (h.monthlyExpense || 0), 0) / recent.length;
    const avgOlderExpense = older.reduce((sum, h) => sum + (h.monthlyExpense || 0), 0) / older.length;
    
    if (avgRecentExpense > avgOlderExpense * 1.1) {
      const increase = ((avgRecentExpense - avgOlderExpense) / avgOlderExpense * 100).toFixed(1);
      insights.push({
        type: 'warning',
        pattern: 'Lifestyle Inflation',
        message: `Monthly expenses increased ${increase}% - lifestyle inflation detected.`,
        severity: increase > 15 ? 'high' : 'medium',
      });
    }

    const avgRecentEMI = recent.reduce((sum, h) => sum + (h.monthlyEMI || 0), 0) / recent.length;
    const avgOlderEMI = older.reduce((sum, h) => sum + (h.monthlyEMI || 0), 0) / older.length;
    
    if (avgRecentEMI > avgOlderEMI * 1.05) {
      insights.push({
        type: 'warning',
        pattern: 'EMI Creep',
        message: 'EMI burden increasing - new loans or higher EMIs detected.',
        severity: 'medium',
      });
    }
  }

  return {
    detected: insights.length > 0,
    insights,
  };
}

// Feature 3: Indian Life Event Stress Simulator
export function simulateLifeEvent(currentData, eventType) {
  const scenarios = {
    medical_emergency: {
      name: 'Medical Emergency',
      impact: {
        emergencyFund: -500000, // ₹5L hit
        monthlyExpense: 0,
      },
      description: '₹5 lakh medical emergency expense',
    },
    job_loss: {
      name: 'Job Loss',
      impact: {
        monthlyIncome: currentData.monthlyIncome * -1, // Income drops to 0
        monthlySaving: currentData.monthlySaving * -1,
      },
      description: 'Loss of primary income source',
    },
    wedding_expense: {
      name: 'Wedding Expense',
      impact: {
        emergencyFund: -1000000, // ₹10L
        monthlyExpense: 0,
      },
      description: '₹10 lakh wedding expense',
    },
    inflation_spike: {
      name: 'Inflation Spike',
      impact: {
        monthlyExpense: currentData.monthlyExpense * 0.15, // 15% increase
      },
      description: '15% inflation spike in expenses',
    },
  };

  const scenario = scenarios[eventType];
  if (!scenario) return null;

  const stressedData = {
    ...currentData,
    emergencyFund: Math.max(0, (currentData.emergencyFund || 0) + (scenario.impact.emergencyFund || 0)),
    monthlyIncome: Math.max(0, (currentData.monthlyIncome || 0) + (scenario.impact.monthlyIncome || 0)),
    monthlyExpense: (currentData.monthlyExpense || 0) + (scenario.impact.monthlyExpense || 0),
    monthlySaving: Math.max(0, (currentData.monthlySaving || 0) + (scenario.impact.monthlySaving || 0)),
  };

  const currentScores = computeRiskScores(currentData);
  const stressedScores = computeRiskScores(stressedData);

  return {
    event: scenario.name,
    description: scenario.description,
    currentScores,
    stressedScores,
    stressedData,
    impact: DIMENSIONS.map(dim => ({
      dimension: dim,
      before: currentScores[dim],
      after: stressedScores[dim],
      change: stressedScores[dim] - currentScores[dim],
    })),
  };
}

// Feature 4: Financial Stability Score + Persona
export function getFinancialPersona(scores, input) {
  const avgScore = Object.values(scores).reduce((a, b) => a + b, 0) / 6;
  const emiToIncome = input.monthlyIncome > 0 
    ? (input.monthlyEMI / input.monthlyIncome) * 100 
    : 0;
  const savingsRate = input.monthlyIncome > 0 
    ? (input.monthlySaving / input.monthlyIncome) * 100 
    : 0;
  const monthsOfExpense = input.monthlyExpense > 0 
    ? (input.emergencyFund || 0) / input.monthlyExpense 
    : 0;

  let persona = 'Risk Exposed';
  let description = 'Multiple financial risks detected. Immediate action needed.';

  if (avgScore >= 75 && emiToIncome <= 30 && savingsRate >= 20 && monthsOfExpense >= 6) {
    persona = 'Safe Builder';
    description = 'Strong financial foundation. You\'re building wealth systematically.';
  } else if (emiToIncome > 40) {
    persona = 'EMI Struggler';
    description = 'High debt burden. Focus on reducing EMIs and avoiding new loans.';
  } else if (avgScore >= 65 && savingsRate >= 15) {
    persona = 'Growth Planner';
    description = 'Good financial habits. Focus on optimizing investments and insurance.';
  }

  return {
    persona,
    description,
    stabilityScore: Math.round(avgScore),
    traits: {
      emergencyFund: monthsOfExpense >= 6 ? 'Strong' : monthsOfExpense >= 3 ? 'Moderate' : 'Weak',
      debtManagement: emiToIncome <= 30 ? 'Good' : emiToIncome <= 40 ? 'Moderate' : 'Poor',
      savingsDiscipline: savingsRate >= 20 ? 'Excellent' : savingsRate >= 10 ? 'Good' : 'Needs Improvement',
    },
  };
}

// Feature 5: Early Warning Alerts Engine
export function generateEarlyWarnings(input, scores) {
  const warnings = [];
  const monthsOfExpense = input.monthlyExpense > 0 
    ? (input.emergencyFund || 0) / input.monthlyExpense 
    : 0;
  const emiToIncome = input.monthlyIncome > 0 
    ? (input.monthlyEMI / input.monthlyIncome) * 100 
    : 0;
  const savingsRate = input.monthlyIncome > 0 
    ? (input.monthlySaving / input.monthlyIncome) * 100 
    : 0;

  if (monthsOfExpense < 2) {
    warnings.push({
      level: 'critical',
      category: 'Emergency Fund',
      message: 'Emergency fund below 2 months - critical risk!',
      action: `Save ₹${Math.ceil(input.monthlyExpense * 4)} more to reach 6-month buffer.`,
    });
  } else if (monthsOfExpense < 4) {
    warnings.push({
      level: 'warning',
      category: 'Emergency Fund',
      message: 'Emergency fund below 4 months - build buffer urgently.',
      action: `Target: ₹${Math.ceil(input.monthlyExpense * 6)} for 6-month safety.`,
    });
  }

  if (emiToIncome > 50) {
    warnings.push({
      level: 'critical',
      category: 'Debt Burden',
      message: 'EMI exceeds 50% of income - debt trap risk!',
      action: 'Avoid new loans. Consider debt consolidation or prepayment.',
    });
  } else if (emiToIncome > 40) {
    warnings.push({
      level: 'warning',
      category: 'Debt Burden',
      message: 'EMI above 40% - high debt burden.',
      action: 'Limit new borrowing. Focus on prepaying high-cost debt.',
    });
  }

  if (savingsRate < 5) {
    warnings.push({
      level: 'critical',
      category: 'Savings Rate',
      message: 'Savings rate below 5% - insufficient for future goals.',
      action: 'Automate SIPs. Aim for at least 20% savings rate.',
    });
  }

  const retirementAge = input.age || 30;
  const yearsToRetirement = Math.max(0, 58 - retirementAge);
  const targetCorpus = input.monthlyExpense * 12 * 25;
  const retirementRatio = targetCorpus > 0 
    ? (input.retirementCorpus || 0) / targetCorpus 
    : 0;

  if (retirementRatio < 0.2 && yearsToRetirement < 15) {
    warnings.push({
      level: 'warning',
      category: 'Retirement',
      message: 'Retirement corpus significantly behind target.',
      action: `Need ₹${Math.ceil(targetCorpus - (input.retirementCorpus || 0))} more. Increase SIPs.`,
    });
  }

  return warnings;
}

// Feature 6: Inflation Reality Check
export function calculateInflationImpact(amount, years = 15, inflationRate = 0.06) {
  const futureValue = amount / Math.pow(1 + inflationRate, years);
  const purchasingPower = (futureValue / amount) * 100;
  
  return {
    currentAmount: amount,
    years,
    inflationRate: inflationRate * 100,
    futureValue: Math.round(futureValue),
    purchasingPower: purchasingPower.toFixed(1),
    message: `₹${amount.toLocaleString('en-IN')} today ≈ ₹${Math.round(futureValue).toLocaleString('en-IN')} in ${years} years (at ${(inflationRate * 100).toFixed(1)}% inflation)`,
  };
}

// Feature 7: Financial Health Journey Tracker
export function checkMilestones(input, existingMilestones = []) {
  const milestones = [];
  const monthsOfExpense = input.monthlyExpense > 0 
    ? (input.emergencyFund || 0) / input.monthlyExpense 
    : 0;
  const savingsRate = input.monthlyIncome > 0 
    ? (input.monthlySaving / input.monthlyIncome) * 100 
    : 0;
  const emiToIncome = input.monthlyIncome > 0 
    ? (input.monthlyEMI / input.monthlyIncome) * 100 
    : 0;

  const milestoneTypes = {
    emergency_fund_6m: {
      condition: monthsOfExpense >= 6,
      name: 'Emergency Fund Master',
      description: 'Achieved 6-month emergency buffer',
    },
    emergency_fund_9m: {
      condition: monthsOfExpense >= 9,
      name: 'Safety Champion',
      description: 'Achieved 9-month emergency buffer',
    },
    savings_rate_20: {
      condition: savingsRate >= 20,
      name: 'Savings Star',
      description: 'Achieved 20% savings rate',
    },
    savings_rate_30: {
      condition: savingsRate >= 30,
      name: 'Wealth Builder',
      description: 'Achieved 30% savings rate',
    },
    low_debt: {
      condition: emiToIncome <= 30,
      name: 'Debt Free Warrior',
      description: 'EMI under 30% of income',
    },
    insurance_adequate: {
      condition: (input.lifeCover || 0) >= (input.monthlyIncome || 0) * 12 * 10,
      name: 'Protected',
      description: 'Adequate life insurance coverage',
    },
  };

  Object.entries(milestoneTypes).forEach(([type, milestone]) => {
    const alreadyEarned = existingMilestones.some(m => m.type === type);
    if (milestone.condition && !alreadyEarned) {
      milestones.push({
        type,
        name: milestone.name,
        description: milestone.description,
        unlockedAt: new Date(),
      });
    }
  });

  return milestones;
}

export function getBadges(scores) {
  const badges = [];
  const avgScore = Object.values(scores).reduce((a, b) => a + b, 0) / 6;

  if (avgScore >= 80) {
    badges.push({
      name: 'Financial Master',
      description: 'Overall score above 80',
    });
  }

  if (scores['Emergency Fund'] >= 85) {
    badges.push({
      name: 'Safety First',
      description: 'Excellent emergency fund',
    });
  }

  if (scores['Debt Burden'] >= 85) {
    badges.push({
      name: 'Debt Slayer',
      description: 'Low debt burden',
    });
  }

  return badges;
}

// Feature 8: Scenario Comparison Mode
export function compareScenarios(currentData, improvedData) {
  const currentScores = computeRiskScores(currentData);
  const improvedScores = computeRiskScores(improvedData);

  return {
    current: {
      data: currentData,
      scores: currentScores,
      grade: getOverallGrade(currentScores),
    },
    improved: {
      data: improvedData,
      scores: improvedScores,
      grade: getOverallGrade(improvedScores),
    },
    improvements: DIMENSIONS.map(dim => ({
      dimension: dim,
      current: currentScores[dim],
      improved: improvedScores[dim],
      gain: improvedScores[dim] - currentScores[dim],
      percentChange: currentScores[dim] > 0 
        ? ((improvedScores[dim] - currentScores[dim]) / currentScores[dim] * 100).toFixed(1)
        : 0,
    })),
    overallGain: {
      current: Object.values(currentScores).reduce((a, b) => a + b, 0) / 6,
      improved: Object.values(improvedScores).reduce((a, b) => a + b, 0) / 6,
    },
  };
}

// Feature 9: Action Impact Estimator
export function estimateActionImpact(currentData, action) {
  const improvedData = { ...currentData };

  switch (action.type) {
    case 'increase_savings':
      improvedData.monthlySaving = (currentData.monthlySaving || 0) + action.amount;
      improvedData.emergencyFund = (currentData.emergencyFund || 0) + (action.amount * action.months || 1);
      break;
    case 'reduce_emi':
      improvedData.monthlyEMI = Math.max(0, (currentData.monthlyEMI || 0) - action.amount);
      break;
    case 'increase_emergency_fund':
      improvedData.emergencyFund = (currentData.emergencyFund || 0) + action.amount;
      break;
    case 'increase_insurance':
      if (action.insuranceType === 'life') {
        improvedData.lifeCover = (currentData.lifeCover || 0) + action.amount;
      } else if (action.insuranceType === 'health') {
        improvedData.healthCover = ((currentData.healthCover || 0) * 100000 + action.amount) / 100000;
      }
      break;
    case 'adjust_equity':
      improvedData.equityPercent = action.percent;
      break;
  }

  const currentScores = computeRiskScores(currentData);
  const improvedScores = computeRiskScores(improvedData);

  return {
    action: action.description || action.type,
    currentScores,
    improvedScores,
    impact: DIMENSIONS.map(dim => ({
      dimension: dim,
      before: currentScores[dim],
      after: improvedScores[dim],
      improvement: improvedScores[dim] - currentScores[dim],
    })),
    overallImprovement: {
      before: Object.values(currentScores).reduce((a, b) => a + b, 0) / 6,
      after: Object.values(improvedScores).reduce((a, b) => a + b, 0) / 6,
    },
  };
}

// Feature 10: Smart Insight Explanations
export function generateSmartInsights(input, scores) {
  const insights = [];
  const monthsOfExpense = input.monthlyExpense > 0 
    ? (input.emergencyFund || 0) / input.monthlyExpense 
    : 0;
  const emiToIncome = input.monthlyIncome > 0 
    ? (input.monthlyEMI / input.monthlyIncome) * 100 
    : 0;
  const savingsRate = input.monthlyIncome > 0 
    ? (input.monthlySaving / input.monthlyIncome) * 100 
    : 0;

  DIMENSIONS.forEach(dim => {
    const score = scores[dim];
    if (score < 50) {
      let explanation = '';
      let fix = '';

      switch (dim) {
        case 'Emergency Fund':
          explanation = `Your emergency fund covers only ${monthsOfExpense.toFixed(1)} months of expenses.`;
          fix = `Save ₹${Math.ceil(input.monthlyExpense * (6 - monthsOfExpense))} more to reach 6-month safety. Consider FD or liquid mutual funds.`;
          break;
        case 'Debt Burden':
          explanation = `Your EMI is ${emiToIncome.toFixed(1)}% of income, above the safe 30-35% threshold.`;
          fix = 'Prepay high-cost debt first (credit cards, personal loans). Avoid new loans until EMI drops below 30%.';
          break;
        case 'Savings Rate':
          explanation = `You're saving only ${savingsRate.toFixed(1)}% of income, below the recommended 20%.`;
          fix = `Increase savings by ₹${Math.ceil(input.monthlyIncome * 0.2 - input.monthlySaving)}/month. Set up auto-debit SIPs before spending.`;
          break;
        case 'Insurance Cover':
          const lifeCoverYears = input.monthlyIncome > 0 
            ? (input.lifeCover || 0) / (input.monthlyIncome * 12) 
            : 0;
          explanation = `Life cover is ${lifeCoverYears.toFixed(1)}× annual income (target: 10-12×). Health cover: ₹${(input.healthCover || 0)}L.`;
          fix = `Increase life cover to ₹${Math.ceil((input.monthlyIncome || 0) * 12 * 10)}. Health cover should be ₹10L+ for family. Term plans are affordable.`;
          break;
        case 'Retirement Readiness':
          const targetCorpus = input.monthlyExpense * 12 * 25;
          const retirementRatio = targetCorpus > 0 
            ? (input.retirementCorpus || 0) / targetCorpus 
            : 0;
          explanation = `You have ${(retirementRatio * 100).toFixed(1)}% of target retirement corpus (₹${Math.ceil(targetCorpus).toLocaleString('en-IN')}).`;
          fix = `Invest ₹${Math.ceil((targetCorpus - (input.retirementCorpus || 0)) / ((58 - (input.age || 30)) * 12))}/month in NPS/EPF/PPF. Start SIPs in equity mutual funds.`;
          break;
        case 'Inflation Protection':
          const idealEquity = Math.max(20, 100 - (input.age || 30));
          explanation = `Your equity allocation is ${input.equityPercent || 0}% (ideal: ${idealEquity}% for age ${input.age || 30}).`;
          fix = `Rebalance to ${idealEquity}% equity, ${100 - idealEquity}% debt/gold. Use equity mutual funds for long-term growth.`;
          break;
      }

      insights.push({
        dimension: dim,
        score,
        explanation,
        fix,
        priority: score < 30 ? 'high' : 'medium',
      });
    }
  });

  return insights;
}
