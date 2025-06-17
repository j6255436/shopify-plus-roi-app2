import React, { useState, useEffect } from 'react';
import './App.css';

const PLAN_OPTIONS = [
  { key: 'basic', name: 'Basic', price: 39, rates: { standard: 0.029, fee: 0.30 } },
  { key: 'shopify', name: 'Shopify', price: 105, rates: { standard: 0.027, fee: 0.30 } },
  { key: 'advanced', name: 'Advanced', price: 399, rates: { standard: 0.025, fee: 0.30 } },
];
const PLUS_OPTIONS = [
  { key: 'plus1', name: 'Plus (1-year)', price: 2500, rates: { standard: 0.0225, fee: 0.30 } },
  { key: 'plus3', name: 'Plus (3-year)', price: 2300, rates: { standard: 0.0225, fee: 0.30 } },
];

// Add the full rates table for each plan
const PLAN_RATES = {
  basic: {
    name: 'Basic',
    online: {
      standard_domestic: '2.9% + $0.30',
      standard_international: '3.9% + $0.30',
      premium_domestic: '3.5% + $0.30',
      premium_international: '4.5% + $0.30',
      installments_standard: '5.9% + 30¢',
      installments_premium6: '7.9% + 30¢',
      installments_premium12: '9.9% + 30¢',
      express_domestic: '4.49% + 30¢',
      express_intl: '5.49% + 30¢',
    },
    pos: {
      present: '2.6% + $0.10',
      manual: '3.5% + $0.10',
    },
  },
  shopify: {
    name: 'Shopify',
    online: {
      standard_domestic: '2.7% + $0.30',
      standard_international: '3.7% + $0.30',
      premium_domestic: '3.3% + $0.30',
      premium_international: '4.3% + $0.30',
      installments_standard: '5.9% + 30¢',
      installments_premium6: '7.9% + 30¢',
      installments_premium12: '9.9% + 30¢',
      express_domestic: '4.49% + 30¢',
      express_intl: '5.49% + 30¢',
    },
    pos: {
      present: '2.5% + $0.10',
      manual: '3.5% + $0.10',
    },
  },
  advanced: {
    name: 'Advanced',
    online: {
      standard_domestic: '2.5% + $0.30',
      standard_international: '3.5% + $0.30',
      premium_domestic: '3.1% + $0.30',
      premium_international: '4.1% + $0.30',
      installments_standard: '5.9% + 30¢',
      installments_premium6: '7.9% + 30¢',
      installments_premium12: '9.9% + 30¢',
      express_domestic: '4.49% + 30¢',
      express_intl: '5.49% + 30¢',
    },
    pos: {
      present: '2.4% + $0.10',
      manual: '3.5% + $0.10',
    },
  },
  plus: {
    name: 'Plus',
    online: {
      standard_domestic: '2.25% + $0.30',
      standard_international: '3.25% + $0.30',
      premium_domestic: '2.95% + $0.30',
      premium_international: '3.95% + $0.30',
      installments_standard: '5.0% + 30¢',
      installments_premium6: '7.9% + 30¢',
      installments_premium12: '9.9% + 30¢',
      express_domestic: '3.9% + 30¢',
      express_intl: '4.9% + 30¢',
    },
    pos: {
      present: '2.3% + $0.10',
      manual: '3.4% + $0.10',
    },
  },
};

function RateTable({ rates }) {
  return (
    <table className="rate-table">
      <thead>
        <tr><th colSpan={2}>Online</th></tr>
      </thead>
      <tbody>
        <tr><td>Standard Cards (Domestic)</td><td>{rates.online.standard_domestic}</td></tr>
        <tr><td>Standard Cards (International)</td><td>{rates.online.standard_international}</td></tr>
      </tbody>
    </table>
  );
}

function App() {
  const [currentPlan, setCurrentPlan] = useState(PLAN_OPTIONS[0].key);
  const [plusPlan, setPlusPlan] = useState(PLUS_OPTIONS[0].key);
  const [aov, setAov] = useState(100);
  const [conversion, setConversion] = useState('');
  const [aovIncrease, setAovIncrease] = useState(1);
  const [conversionIncrease, setConversionIncrease] = useState(1);
  const [monthlyRevenue, setMonthlyRevenue] = useState(10000);

  // Editable processing fees
  const plan = PLAN_OPTIONS.find(p => p.key === currentPlan);
  const plus = PLUS_OPTIONS.find(p => p.key === plusPlan);
  const [currentStandardRate, setCurrentStandardRate] = useState(plan.rates.standard);
  const [currentFlatFee, setCurrentFlatFee] = useState(plan.rates.fee);
  const [plusStandardRate, setPlusStandardRate] = useState(plus.rates.standard);
  const [plusFlatFee, setPlusFlatFee] = useState(plus.rates.fee);

  useEffect(() => {
    setCurrentStandardRate(plan.rates.standard);
    setCurrentFlatFee(plan.rates.fee);
  }, [currentPlan]);

  useEffect(() => {
    setPlusStandardRate(plus.rates.standard);
    setPlusFlatFee(plus.rates.fee);
  }, [plusPlan]);

  // --- NEW ROI LOGIC ---
  // 1. Estimate current transactions and visitors
  const currentTransactions = aov > 0 ? monthlyRevenue / aov : 0;
  const conversionRateDecimal = conversion && conversion > 0 ? parseFloat(conversion) / 100 : 0;
  const estimatedVisitors = conversionRateDecimal > 0 ? currentTransactions / conversionRateDecimal : 0;

  // 2. Apply improvements
  const improvedAOV = aov > 0 ? aov * (1 + aovIncrease / 100) : 0;
  const improvedConversionRate = conversion && conversion > 0 ? parseFloat(conversion) * (1 + conversionIncrease / 100) / 100 : 0;
  const transactionsWithPlus = improvedConversionRate > 0 ? estimatedVisitors * improvedConversionRate : 0;
  const revenueWithPlus = transactionsWithPlus * improvedAOV;

  // 3. Calculate costs
  // Current Plan
  const currentTransactionFees = monthlyRevenue * currentStandardRate + currentTransactions * currentFlatFee;
  const currentTotalMonthlyCost = plan.price + currentTransactionFees;
  // Plus Plan
  const plusTransactionFees = revenueWithPlus * plusStandardRate;
  const plusTotalMonthlyCost = plus.price + plusTransactionFees;

  // Calculate transaction fees for both plans using current revenue and per-order flat fee
  const plusTransactionFeesCurrent = monthlyRevenue * plusStandardRate + currentTransactions * plusFlatFee;
  const transactionFeeSavings = currentTransactionFees - plusTransactionFeesCurrent;

  // 4. ROI
  const roi = currentTotalMonthlyCost - plusTotalMonthlyCost;

  // Revenue Impact calculations
  const newAOV = aov > 0 ? aov * (1 + aovIncrease / 100) : 0;
  const newConversionRate = conversion && conversion > 0 ? parseFloat(conversion) * (1 + conversionIncrease / 100) : 0;
  const revenueWithAOV = aov > 0 ? currentTransactions * (aov * (1 + aovIncrease / 100)) : 0;
  const revenueWithConversion = conversion && conversion > 0 ? (estimatedVisitors * (parseFloat(conversion) * (1 + conversionIncrease / 100) / 100) * aov) : 0;
  const revenueWithBoth = revenueWithPlus;

  // Calculate period multipliers
  const periods = [
    { label: '30 Days', multiplier: 30 / 30 }, // 1 month
    { label: '90 Days', multiplier: 90 / 30 }, // 3 months
    { label: '365 Days', multiplier: 365 / 30 }, // 12.166... months
  ];

  // Helper to format values for each period
  function getPeriodValues(multiplier) {
    return {
      platformFeeCurrent: plan.price * multiplier,
      platformFeePlus: plus.price * multiplier,
      transactionFeeSavings: transactionFeeSavings * multiplier,
      additionalSales: (revenueWithPlus - monthlyRevenue) * multiplier,
      finalROI:
        (plan.price - plus.price + transactionFeeSavings + (revenueWithPlus - monthlyRevenue)) * multiplier,
    };
  }

  return (
    <div className="app-bg">
      <header className="app-header">
        <h1 className="app-title">Shopify Plus ROI Calculator</h1>
        <p className="app-subtitle">Compare your current Shopify plan to Plus and see your potential ROI.</p>
      </header>
      <main className="main-content roi-flex">
        {/* Current Plan Card */}
        <section className="roi-card breakdown-card">
          <h2>Current Plan</h2>
          <div className="form-group">
            <label>Plan</label>
            <select value={currentPlan} onChange={e => setCurrentPlan(e.target.value)}>
              {PLAN_OPTIONS.map(opt => (
                <option key={opt.key} value={opt.key}>{opt.name} (${opt.price}/mo)</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Monthly Revenue</label>
            <input type="number" value={monthlyRevenue} onChange={e => setMonthlyRevenue(Number(e.target.value))} />
          </div>
          <div className="form-group">
            <label>Average Order Value (AOV)</label>
            <input type="number" value={aov} onChange={e => setAov(Number(e.target.value))} />
          </div>
          <div className="form-group">
            <label>Conversion Rate (%)</label>
            <input
              type="number"
              value={conversion}
              onChange={e => setConversion(e.target.value)}
              step="any"
              placeholder="Enter conversion rate"
            />
          </div>
          <RateTable rates={PLAN_RATES[currentPlan]} />
          <div className="form-group">
            <label>Standard Card Rate (%)</label>
            <input
              type="number"
              step="0.0001"
              value={currentStandardRate}
              onChange={e => setCurrentStandardRate(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>Flat Fee ($)</label>
            <input
              type="number"
              step="0.01"
              value={currentFlatFee}
              onChange={e => setCurrentFlatFee(Number(e.target.value))}
            />
          </div>
          <div className="processing-fees-block">
            <h3>Processing Fees</h3>
            <div className="breakdown-row">
              <span>Transaction Fees</span>
              <span>${currentTransactionFees.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
            </div>
            <div className="breakdown-row">
              <span>Platform Fee</span>
              <span>${plan.price}</span>
            </div>
            <div className="breakdown-row">
              <span>Total Current Monthly Cost</span>
              <span>${currentTotalMonthlyCost.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
            </div>
          </div>
        </section>
        {/* Shopify Plus Card */}
        <section className="roi-card breakdown-card">
          <h2>Shopify Plus</h2>
          <div className="form-group">
            <label>Plus Plan</label>
            <select value={plusPlan} onChange={e => setPlusPlan(e.target.value)}>
              {PLUS_OPTIONS.map(opt => (
                <option key={opt.key} value={opt.key}>{opt.name} (${opt.price}/mo)</option>
              ))}
            </select>
          </div>
          <RateTable rates={PLAN_RATES['plus']} />
          <div className="form-group">
            <label>Standard Card Rate (%)</label>
            <input
              type="number"
              step="0.0001"
              value={plusStandardRate}
              onChange={e => setPlusStandardRate(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>Flat Fee ($)</label>
            <input
              type="number"
              step="0.01"
              value={plusFlatFee}
              onChange={e => setPlusFlatFee(Number(e.target.value))}
            />
          </div>
          <div className="processing-fees-block">
            <h3>Processing Fees</h3>
            <div className="breakdown-row">
              <span>Transaction Fees (Current Revenue)</span>
              <span>${plusTransactionFeesCurrent.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
            </div>
            <div className="breakdown-row">
              <span>Platform Fee</span>
              <span>${plus.price}</span>
            </div>
            <div className="breakdown-row">
              <span>Total Plus Monthly Cost</span>
              <span>${plusTotalMonthlyCost.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
            </div>
          </div>
          <div style={{ marginTop: 24 }}>
            <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Revenue Impact</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fafbfc', borderRadius: 8 }}>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 'bold', padding: 4 }}>New AOV</td>
                  <td style={{ textAlign: 'right', padding: 4 }}>{newAOV > 0 ? newAOV.toLocaleString(undefined, {maximumFractionDigits: 2}) : '-'}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold', padding: 4 }}>New Conversion Rate</td>
                  <td style={{ textAlign: 'right', padding: 4 }}>{newConversionRate > 0 ? (newConversionRate).toLocaleString(undefined, {maximumFractionDigits: 2}) + '%' : '-'}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold', padding: 4 }}>Current Revenue</td>
                  <td style={{ textAlign: 'right', padding: 4 }}>${monthlyRevenue.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                </tr>
                <tr>
                  <td style={{ padding: 4 }}>With Increased AOV</td>
                  <td style={{ textAlign: 'right', padding: 4 }}>${revenueWithAOV.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                </tr>
                <tr>
                  <td style={{ padding: 4 }}>With Increased Conversion</td>
                  <td style={{ textAlign: 'right', padding: 4 }}>${revenueWithConversion.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                </tr>
                <tr>
                  <td style={{ padding: 4 }}>With Both Increases</td>
                  <td style={{ textAlign: 'right', padding: 4 }}>${revenueWithBoth.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ background: '#e6ffe6', border: '2px solid #4caf50', borderRadius: 8, padding: 12, marginTop: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', fontSize: 16, color: '#388e3c' }}>Monthly Additional Sales from Improvements</span>
            <span style={{ fontSize: 20, fontWeight: 'bold', color: '#2e7d32' }}>${(revenueWithPlus - monthlyRevenue).toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
          </div>
        </section>
        {/* ROI Summary Card */}
        <div className="roi-summary-multi" style={{ display: 'flex', gap: 16, flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: 16, justifyContent: 'center' }}>
          {periods.map(({ label, multiplier }) => {
            const values = getPeriodValues(multiplier);
            return (
              <section className="roi-card summary-card" key={label} style={{ minWidth: 250, flex: '0 0 250px' }}>
                <h2>{label} ROI Summary</h2>
                <div className="roi-section">
                  <div className="roi-section-title">ROI Comparison</div>
                  <div className="breakdown-row">
                    <span>Current Platform Fee</span>
                    <span>${values.platformFeeCurrent.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Plus Platform Fee</span>
                    <span>${values.platformFeePlus.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Transaction Fee Savings</span>
                    <span>${values.transactionFeeSavings.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Additional Sales from Improvements</span>
                    <span>${values.additionalSales.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Final ROI</span>
                    <span className="breakdown-savings">${values.finalROI.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default App;









