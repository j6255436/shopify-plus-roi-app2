import React, { useState } from 'react';
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

  const plan = PLAN_OPTIONS.find(p => p.key === currentPlan);
  const plus = PLUS_OPTIONS.find(p => p.key === plusPlan);

  // Calculate base orders per month
  const orders = aov > 0 && conversion > 0 ? monthlyRevenue / aov : 0;
  // Current plan fees
  const currentFees = monthlyRevenue * plan.rates.standard + orders * plan.rates.fee;

  // Projected improvements
  const newAOV = aov > 0 ? aov * (1 + aovIncrease / 100) : 0;
  const newConversion = conversion && conversion > 0 ? parseFloat(conversion) * (1 + conversionIncrease / 100) : 0;
  const newOrders = orders * (1 + conversionIncrease / 100);
  const newRevenue = newOrders * newAOV;
  const improvedPlusFees = newRevenue * plus.rates.standard + newOrders * plus.rates.fee;

  // Base ROI (no AOV/Conversion increase)
  const basePlusFees = monthlyRevenue * plus.rates.standard + orders * plus.rates.fee;
  const basePlusTotal = basePlusFees + plus.price;
  const baseCurrentTotal = currentFees + plan.price;
  const baseSavings = baseCurrentTotal - basePlusTotal;

  // Extra benefit from AOV/Conversion increases
  const extraSales = newRevenue - monthlyRevenue;
  const extraPlusFees = improvedPlusFees - basePlusFees;
  const extraNetProfit = extraSales - extraPlusFees;

  // Total ROI
  const totalNetSavings = baseSavings + extraNetProfit;

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
          <div className="processing-fees-block">
            <h3>Processing Fees</h3>
            <div className="breakdown-row">
              <span>Processing Fees</span>
              <span>${currentFees.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
            <div className="breakdown-row">
              <span>Platform Fee</span>
              <span>${plan.price}</span>
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
          <div className="form-group">
            <label>Projected AOV Increase (%)</label>
            <input type="range" min={1} max={20} value={aovIncrease} onChange={e => setAovIncrease(Number(e.target.value))} />
            <span className="slider-value">+{aovIncrease}%</span>
          </div>
          <div className="form-group">
            <label>Projected Conversion Increase (%)</label>
            <input type="range" min={1} max={20} value={conversionIncrease} onChange={e => setConversionIncrease(Number(e.target.value))} />
            <span className="slider-value">+{conversionIncrease}%</span>
          </div>
          <RateTable rates={PLAN_RATES['plus']} />
          {/* Revenue Breakdown */}
          <div className="revenue-breakdown">
            <h3>Revenue Impact</h3>
            <div className="breakdown-row">
              <span>New AOV</span>
              <span>{newAOV > 0 ? newAOV.toLocaleString(undefined, {maximumFractionDigits: 2}) : '-'}</span>
            </div>
            <div className="breakdown-row">
              <span>New Conversion Rate</span>
              <span>{newConversion > 0 ? newConversion.toLocaleString(undefined, {maximumFractionDigits: 2}) + '%' : '-'}</span>
            </div>
            <div className="breakdown-row">
              <span>Current Revenue</span>
              <span>${monthlyRevenue.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
            <div className="breakdown-row">
              <span>With Increased AOV (+{aovIncrease}%)</span>
              <span>${(orders * newAOV).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
            <div className="breakdown-row">
              <span>With Increased Conversion (+{conversionIncrease}%)</span>
              <span>${(orders * aov * (1 + conversionIncrease / 100)).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
            <div className="breakdown-row">
              <span>With Both Increases</span>
              <span>${(newRevenue).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
          </div>
          <div className="processing-fees-block">
            <h3>Processing Fees</h3>
            <div className="breakdown-row">
              <span>Processing Fees</span>
              <span>${improvedPlusFees.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
            <div className="breakdown-row">
              <span>Platform Fee</span>
              <span>${plus.price}</span>
            </div>
          </div>
        </section>
        {/* ROI Summary Card */}
        <section className="roi-card summary-card">
          <h2>ROI Summary</h2>
          {/* Base ROI */}
          <div className="roi-section">
            <div className="roi-section-title">Base ROI (No AOV/Conversion Increase)</div>
            <div className="breakdown-row">
              <span>Current Monthly Cost</span>
              <span>${baseCurrentTotal.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
            <div className="breakdown-row">
              <span>Plus Processing Fees</span>
              <span>${basePlusFees.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
            <div className="breakdown-row">
              <span>Plus Platform Fee</span>
              <span>${plus.price.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
            <div className="breakdown-row">
              <span>Plus Monthly Cost (incl. platform fee)</span>
              <span>${basePlusTotal.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
            <div className="breakdown-row">
              <span>Base Monthly Savings</span>
              <span>${baseSavings > 0 ? baseSavings.toLocaleString(undefined, {maximumFractionDigits: 0}) : '0'}</span>
            </div>
          </div>
          {/* Extra Benefit */}
          <div className="roi-section roi-bonus">
            <div className="roi-section-title">Extra Benefit from AOV & Conversion Increase</div>
            <div className="breakdown-row">
              <span>Extra Sales</span>
              <span>${extraSales > 0 ? extraSales.toLocaleString(undefined, {maximumFractionDigits: 0}) : '0'}</span>
            </div>
            <div className="breakdown-row">
              <span>Extra Plus Fees</span>
              <span>${extraPlusFees > 0 ? extraPlusFees.toLocaleString(undefined, {maximumFractionDigits: 0}) : '0'}</span>
            </div>
            <div className="breakdown-row">
              <span>Extra Net Profit</span>
              <span>${extraNetProfit > 0 ? extraNetProfit.toLocaleString(undefined, {maximumFractionDigits: 0}) : '0'}</span>
            </div>
          </div>
          {/* Total ROI */}
          <div className="roi-section">
            <div className="roi-section-title">Total ROI (Combined)</div>
            <div className="breakdown-row">
              <span>Total Plus Processing Fees</span>
              <span>${improvedPlusFees.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
            <div className="breakdown-row">
              <span>Total Plus Platform Fee</span>
              <span>${plus.price.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
            <div className="breakdown-row">
              <span>Total Plus Cost (incl. platform fee)</span>
              <span>${(improvedPlusFees + plus.price).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
            <div className="breakdown-row">
              <span>Total Net Savings</span>
              <span className="breakdown-savings">${totalNetSavings.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
            <div className={`roi-indicator ${totalNetSavings >= 0 ? 'positive' : 'negative'}`}>
              {totalNetSavings >= 0 ? 'Positive ROI' : 'Negative ROI'}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
