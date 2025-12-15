import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    age: '30',
    income: '75000',
    goals: 'Save for a house down payment and retirement.',
    riskTolerance: 'Medium',
  });
  const [advice, setAdvice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setAdvice('');

    try {
      const response = await axios.post('http://localhost:5001/api/advice', formData);
      setAdvice(response.data.advice);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'An unexpected error occurred.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      

      <main>

      <header className="app-header">
        <h1>AI Financial Planner 📈</h1>
        <p>Enter your details to get personalized, AI-driven financial guidance.</p>
      </header>

        <form onSubmit={handleSubmit} className="planner-form">
          <div className="form-group">
            <label htmlFor="age">Your Age</label>
            <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="income">Annual Income (INR)</label>
            <input type="number" id="income" name="income" value={formData.income} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="riskTolerance">Risk Tolerance</label>
            <select id="riskTolerance" name="riskTolerance" value={formData.riskTolerance} onChange={handleChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="form-group full-width">
            <label htmlFor="goals">Financial Goals</label>
            <textarea id="goals" name="goals" value={formData.goals} onChange={handleChange} rows="4" required></textarea>
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Generating Advice...' : 'Get My Plan'}
          </button>
        </form>

        {error && <div className="error-box"><p>{error}</p></div>}

        {isLoading && <div className="loading-spinner"></div>}
      </main>
        {advice && (
          <div className="advice-container">
            <h2>Your Financial Plan</h2>
            <div className="advice-content" dangerouslySetInnerHTML={{ __html: advice.replace(/\n/g, '<br />').replace(/### (.*?)/g, '<h3>$1</h3>') }}>
            </div>
          </div>
        )}
      
    </div>
  );
}

export default App;