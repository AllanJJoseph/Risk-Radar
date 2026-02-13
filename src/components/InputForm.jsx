import { useState } from 'react';

const DEFAULT = {
  monthlyIncome: 75000,
  monthlyExpense: 45000,
  emergencyFund: 150000,
  monthlyEMI: 18000,
  monthlySaving: 12000,
  lifeCover: 9000000,
  healthCover: 5,
  retirementCorpus: 2500000,
  age: 35,
  equityPercent: 65,
};

export default function InputForm({ onSubmit }) {
  const [form, setForm] = useState(DEFAULT);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <form
      className="input-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <h3>Your financial snapshot</h3>
      <p className="form-hint">All figures in ₹ (INR). Health cover in lakhs.</p>

      <div className="form-grid">
        <label>
          <span>Monthly income (₹)</span>
          <input
            type="number"
            min="0"
            step="1000"
            value={form.monthlyIncome}
            onChange={(e) => update('monthlyIncome', e.target.value)}
          />
        </label>
        <label>
          <span>Monthly expense (₹)</span>
          <input
            type="number"
            min="0"
            step="1000"
            value={form.monthlyExpense}
            onChange={(e) => update('monthlyExpense', e.target.value)}
          />
        </label>
        <label>
          <span>Emergency fund (₹)</span>
          <input
            type="number"
            min="0"
            step="10000"
            value={form.emergencyFund}
            onChange={(e) => update('emergencyFund', e.target.value)}
          />
        </label>
        <label>
          <span>Total monthly EMI (₹)</span>
          <input
            type="number"
            min="0"
            step="1000"
            value={form.monthlyEMI}
            onChange={(e) => update('monthlyEMI', e.target.value)}
          />
        </label>
        <label>
          <span>Monthly savings (₹)</span>
          <input
            type="number"
            min="0"
            step="1000"
            value={form.monthlySaving}
            onChange={(e) => update('monthlySaving', e.target.value)}
          />
        </label>
        <label>
          <span>Life cover (₹)</span>
          <input
            type="number"
            min="0"
            step="100000"
            value={form.lifeCover}
            onChange={(e) => update('lifeCover', e.target.value)}
          />
        </label>
        <label>
          <span>Health cover (lakhs)</span>
          <input
            type="number"
            min="0"
            step="1"
            value={form.healthCover}
            onChange={(e) => update('healthCover', e.target.value)}
          />
        </label>
        <label>
          <span>Retirement corpus (₹)</span>
          <input
            type="number"
            min="0"
            step="100000"
            value={form.retirementCorpus}
            onChange={(e) => update('retirementCorpus', e.target.value)}
          />
        </label>
        <label>
          <span>Your age</span>
          <input
            type="number"
            min="18"
            max="70"
            value={form.age}
            onChange={(e) => update('age', e.target.value)}
          />
        </label>
        <label>
          <span>Equity allocation (%)</span>
          <input
            type="number"
            min="0"
            max="100"
            value={form.equityPercent}
            onChange={(e) => update('equityPercent', e.target.value)}
          />
        </label>
      </div>

      <button type="submit" className="btn-primary">
        Update risk radar
      </button>
    </form>
  );
}
