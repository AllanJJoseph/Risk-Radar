import { useRef } from 'react';
import { getOverallGrade } from '../lib/riskEngine';

export default function ReportDownload({ user, financialData, scores, persona, insights, warnings }) {
  const reportRef = useRef(null);

  const grade = getOverallGrade(scores);

  const handleDownloadPDF = () => {
    const reportHTML = generateReportHTML();
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      alert('Please allow popups to download the PDF report');
      return;
    }

    printWindow.document.open();
    printWindow.document.write(reportHTML);
    printWindow.document.close();
    
    // Wait for content to load before printing
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  };

  const handleDownloadHTML = () => {
    const reportHTML = generateReportHTML();
    const blob = new Blob([reportHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Financial-Risk-Report-${user?.name || 'User'}-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateReportHTML = () => {
    const monthsOfExpense = financialData?.monthlyExpense > 0 
      ? (financialData?.emergencyFund || 0) / financialData.monthlyExpense 
      : 0;
    const emiToIncome = financialData?.monthlyIncome > 0 
      ? ((financialData?.monthlyEMI || 0) / financialData.monthlyIncome) * 100 
      : 0;
    const savingsRate = financialData?.monthlyIncome > 0 
      ? ((financialData?.monthlySaving || 0) / financialData.monthlyIncome) * 100 
      : 0;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Financial Risk Report - ${user?.name || 'User'}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #fff;
      padding: 40px 20px;
    }
    .report-container {
      max-width: 900px;
      margin: 0 auto;
      background: #fff;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
      padding: 40px;
    }
    .report-header {
      text-align: center;
      border-bottom: 3px solid #10b981;
      padding-bottom: 30px;
      margin-bottom: 40px;
    }
    .report-header h1 {
      color: #0a0e1a;
      font-size: 2.5em;
      margin-bottom: 10px;
    }
    .report-header .subtitle {
      color: #64748b;
      font-size: 1.1em;
    }
    .report-date {
      text-align: right;
      color: #64748b;
      margin-bottom: 30px;
      font-size: 0.9em;
    }
    .section {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }
    .section-title {
      color: #10b981;
      font-size: 1.8em;
      margin-bottom: 20px;
      border-bottom: 2px solid #10b981;
      padding-bottom: 10px;
    }
    .user-info {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }
    .info-item {
      padding: 15px;
      background: #f8fafc;
      border-radius: 8px;
    }
    .info-label {
      font-weight: 600;
      color: #64748b;
      font-size: 0.9em;
      margin-bottom: 5px;
    }
    .info-value {
      color: #0a0e1a;
      font-size: 1.1em;
      font-weight: 700;
    }
    .grade-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 15px 30px;
      border: 3px solid ${grade.color};
      border-radius: 50px;
      background: #f8fafc;
      margin: 20px 0;
    }
    .grade-letter {
      font-size: 2em;
      font-weight: 800;
      color: ${grade.color};
    }
    .grade-label {
      font-size: 1.2em;
      color: #64748b;
      font-weight: 600;
    }
    .scores-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-bottom: 30px;
    }
    .score-item {
      padding: 20px;
      background: #f8fafc;
      border-radius: 8px;
      border-left: 4px solid #10b981;
    }
    .score-label {
      font-weight: 600;
      color: #64748b;
      margin-bottom: 10px;
    }
    .score-value {
      font-size: 2em;
      font-weight: 800;
      color: #0a0e1a;
    }
    .score-bar {
      height: 8px;
      background: #e2e8f0;
      border-radius: 4px;
      margin-top: 10px;
      overflow: hidden;
    }
    .score-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #059669);
      transition: width 0.3s;
    }
    .persona-box {
      padding: 25px;
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      border-radius: 12px;
      border: 2px solid #10b981;
      margin-bottom: 30px;
    }
    .persona-name {
      font-size: 1.8em;
      font-weight: 800;
      color: #10b981;
      margin-bottom: 10px;
    }
    .persona-description {
      color: #334155;
      font-size: 1.1em;
      line-height: 1.8;
    }
    .insights-list, .warnings-list {
      margin-top: 20px;
    }
    .insight-item, .warning-item {
      padding: 20px;
      margin-bottom: 15px;
      border-radius: 8px;
      border-left: 4px solid;
    }
    .insight-success {
      background: #f0fdf4;
      border-left-color: #10b981;
    }
    .insight-warning {
      background: #fffbeb;
      border-left-color: #f59e0b;
    }
    .warning-critical {
      background: #fef2f2;
      border-left-color: #ef4444;
    }
    .insight-title, .warning-title {
      font-weight: 700;
      margin-bottom: 8px;
      color: #0a0e1a;
    }
    .insight-text, .warning-text {
      color: #475569;
      line-height: 1.7;
    }
    .financial-summary {
      background: #f8fafc;
      padding: 30px;
      border-radius: 12px;
      margin-bottom: 30px;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    .summary-item {
      text-align: center;
    }
    .summary-label {
      color: #64748b;
      font-size: 0.9em;
      margin-bottom: 5px;
    }
    .summary-value {
      font-size: 1.5em;
      font-weight: 800;
      color: #0a0e1a;
    }
    .footer {
      margin-top: 50px;
      padding-top: 30px;
      border-top: 2px solid #e2e8f0;
      text-align: center;
      color: #64748b;
      font-size: 0.9em;
    }
    @media print {
      body {
        padding: 0;
      }
      .report-container {
        box-shadow: none;
        padding: 20px;
      }
      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="report-container">
    <div class="report-header">
      <h1>Financial Risk Radar Report</h1>
      <div class="subtitle">Comprehensive Financial Health Analysis</div>
    </div>
    
    <div class="report-date">
      Generated on: ${new Date().toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}
    </div>

    <div class="section">
      <h2 class="section-title">Personal Information</h2>
      <div class="user-info">
        <div class="info-item">
          <div class="info-label">Full Name</div>
          <div class="info-value">${user?.name || 'Not provided'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Email</div>
          <div class="info-value">${user?.email || 'Not provided'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Age</div>
          <div class="info-value">${financialData?.age || 'Not provided'} years</div>
        </div>
        <div class="info-item">
          <div class="info-label">City, State</div>
          <div class="info-value">${user?.city || ''}${user?.city && user?.state ? ', ' : ''}${user?.state || 'Not provided'}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Overall Financial Grade</h2>
      <div style="text-align: center;">
        <div class="grade-badge">
          <span class="grade-letter">${grade.grade}</span>
          <span class="grade-label">${grade.label}</span>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Financial Persona</h2>
      <div class="persona-box">
        <div class="persona-name">${persona?.persona || 'Not Available'}</div>
        <div class="persona-description">${persona?.description || 'Complete your profile to get your financial persona.'}</div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Financial Summary</h2>
      <div class="financial-summary">
        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-label">Monthly Income</div>
            <div class="summary-value">₹${(financialData?.monthlyIncome || 0).toLocaleString('en-IN')}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Monthly Expense</div>
            <div class="summary-value">₹${(financialData?.monthlyExpense || 0).toLocaleString('en-IN')}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Monthly Savings</div>
            <div class="summary-value">₹${(financialData?.monthlySaving || 0).toLocaleString('en-IN')}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Savings Rate</div>
            <div class="summary-value">${savingsRate.toFixed(1)}%</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Emergency Fund</div>
            <div class="summary-value">₹${(financialData?.emergencyFund || 0).toLocaleString('en-IN')}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Months of Expense</div>
            <div class="summary-value">${monthsOfExpense.toFixed(1)} months</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Monthly EMI</div>
            <div class="summary-value">₹${(financialData?.monthlyEMI || 0).toLocaleString('en-IN')}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">EMI to Income</div>
            <div class="summary-value">${emiToIncome.toFixed(1)}%</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Retirement Corpus</div>
            <div class="summary-value">₹${(financialData?.retirementCorpus || 0).toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Risk Dimension Scores</h2>
      <div class="scores-grid">
        ${Object.entries(scores || {}).map(([dimension, score]) => `
          <div class="score-item">
            <div class="score-label">${dimension}</div>
            <div class="score-value">${Math.round(score)}/100</div>
            <div class="score-bar">
              <div class="score-bar-fill" style="width: ${score}%"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    ${warnings && warnings.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Early Warning Alerts</h2>
      <div class="warnings-list">
        ${warnings.map(warning => `
          <div class="warning-item warning-${warning.level}">
            <div class="warning-title">${warning.category}: ${warning.message}</div>
            <div class="warning-text">${warning.action}</div>
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}

    ${insights && insights.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Financial Insights & Recommendations</h2>
      <div class="insights-list">
        ${insights.map(insight => `
          <div class="insight-item insight-${insight.type}">
            <div class="insight-title">${insight.title}</div>
            <div class="insight-text">${insight.text}</div>
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}

    <div class="footer">
      <p><strong>Disclaimer:</strong> This report is for educational purposes only and does not constitute financial, investment, or tax advice. Please consult with a SEBI-registered financial advisor before making any investment decisions.</p>
      <p style="margin-top: 10px;">Generated by Financial Risk Radar - Middle-class India</p>
    </div>
  </div>
</body>
</html>
    `;
  };

  return (
    <div className="report-download-card">
      <h2>📄 Download Financial Report</h2>
      <p className="feature-description">
        Generate and download a comprehensive PDF report of your financial health analysis, 
        including all your details, risk scores, insights, and recommendations.
      </p>
      
      <div className="report-actions">
        <button onClick={handleDownloadPDF} className="btn-primary report-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download & Print PDF
        </button>
        <button onClick={handleDownloadHTML} className="btn-secondary report-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          Download HTML Report
        </button>
      </div>
    </div>
  );
}
