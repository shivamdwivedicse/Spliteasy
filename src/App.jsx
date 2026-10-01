import React, { useState, useEffect } from 'react';
import { settleUp } from './settleUp';
import './index.css';

export default function App() {
  const [people, setPeople] = useState(() => {
    const saved = localStorage.getItem('spliteasy-people');
    return saved ? JSON.parse(saved) : [];
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('spliteasy-expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [newPersonName, setNewPersonName] = useState('');
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: '',
    paidBy: '',
    splitBetween: {}
  });
  const [copyMessage, setCopyMessage] = useState('');

  useEffect(() => {
    localStorage.setItem('spliteasy-people', JSON.stringify(people));
  }, [people]);

  useEffect(() => {
    localStorage.setItem('spliteasy-expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addPerson = () => {
    if (!newPersonName.trim()) {
      alert('Please enter a person name');
      return;
    }
    if (people.some(p => p === newPersonName)) {
      alert('This person already exists');
      return;
    }
    setPeople([...people, newPersonName]);
    setNewPersonName('');
  };

  const removePerson = (name) => {
    setPeople(people.filter(p => p !== name));
    setExpenses(expenses.filter(e => e.paidBy !== name && !e.splitBetween[name]));
  };

  const handleExpenseFormChange = (e) => {
    const { name, value } = e.target;
    setExpenseForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSplitChange = (personName) => {
    setExpenseForm(prev => ({
      ...prev,
      splitBetween: {
        ...prev.splitBetween,
        [personName]: !prev.splitBetween[personName]
      }
    }));
  };

  const addExpense = () => {
    if (!expenseForm.description.trim()) {
      alert('Please enter a description');
      return;
    }
    if (!expenseForm.amount || parseFloat(expenseForm.amount) <= 0) {
      alert('Amount must be greater than 0');
      return;
    }
    if (!expenseForm.paidBy) {
      alert('Please select who paid');
      return;
    }
    const splitPeople = Object.keys(expenseForm.splitBetween).filter(p => expenseForm.splitBetween[p]);
    if (splitPeople.length === 0) {
      alert('Please select at least one person for the split');
      return;
    }

    const expense = {
      id: Date.now(),
      description: expenseForm.description,
      amount: parseFloat(expenseForm.amount),
      paidBy: expenseForm.paidBy,
      splitBetween: expenseForm.splitBetween
    };

    setExpenses([...expenses, expense]);
    setExpenseForm({
      description: '',
      amount: '',
      paidBy: '',
      splitBetween: {}
    });
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const calculateBalances = () => {
    const balances = {};
    people.forEach(p => {
      balances[p] = 0;
    });

    expenses.forEach(expense => {
      const splitPeople = Object.keys(expense.splitBetween).filter(p => expense.splitBetween[p]);
      const perPerson = expense.amount / splitPeople.length;

      balances[expense.paidBy] += expense.amount;

      splitPeople.forEach(person => {
        balances[person] -= perPerson;
      });
    });

    return balances;
  };

  const balances = calculateBalances();
  const transactions = settleUp(balances);

  const generateSettleUpText = () => {
    if (transactions.length === 0) {
      return 'Everyone is settled up!';
    }
    return transactions
      .map(t => `${t.from} pays ${t.to} ₹${t.amount.toFixed(2)}`)
      .join('\n');
  };

  const copyToClipboard = () => {
    const text = generateSettleUpText();
    navigator.clipboard.writeText(text).then(() => {
      setCopyMessage('Copied!');
      setTimeout(() => setCopyMessage(''), 2000);
    });
  };

  return (
    <div className="container">
      <h1>💰 SplitEasy</h1>

      {/* People Management */}
      <div className="card">
        <h2>👥 People</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter person name"
            value={newPersonName}
            onChange={e => setNewPersonName(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && addPerson()}
          />
          <button onClick={addPerson}>Add</button>
        </div>
        {people.length === 0 ? (
          <div className="empty-state">No people added yet</div>
        ) : (
          people.map(person => (
            <div key={person} className="person-item">
              <span>{person}</span>
              <button onClick={() => removePerson(person)}>Remove</button>
            </div>
          ))
        )}
      </div>

      {/* Add Expense */}
      {people.length > 0 && (
        <div className="card">
          <h2>💳 Add Expense</h2>
          <div className="expense-form">
            <input
              type="text"
              placeholder="Description (e.g., Dinner)"
              name="description"
              value={expenseForm.description}
              onChange={handleExpenseFormChange}
            />
            <input
              type="number"
              placeholder="Amount"
              name="amount"
              value={expenseForm.amount}
              onChange={handleExpenseFormChange}
              step="0.01"
            />
            <select
              name="paidBy"
              value={expenseForm.paidBy}
              onChange={handleExpenseFormChange}
            >
              <option value="">Who paid?</option>
              {people.map(person => (
                <option key={person} value={person}>{person}</option>
              ))}
            </select>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                Split between:
              </label>
              <div className="checkbox-group">
                {people.map(person => (
                  <div key={person} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={`split-${person}`}
                      checked={expenseForm.splitBetween[person] || false}
                      onChange={() => handleSplitChange(person)}
                    />
                    <label htmlFor={`split-${person}`}>{person}</label>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={addExpense} style={{ background: '#667eea' }}>
              Add Expense
            </button>
          </div>
        </div>
      )}

      {/* Expenses List */}
      {expenses.length > 0 && (
        <div className="card">
          <h2>📝 Expenses</h2>
          {expenses.map(expense => {
            const splitPeople = Object.keys(expense.splitBetween).filter(p => expense.splitBetween[p]);
            const perPerson = (expense.amount / splitPeople.length).toFixed(2);
            return (
              <div key={expense.id} className="expense-item">
                <div className="expense-item-header">
                  <span className="expense-item-desc">{expense.description}</span>
                  <span className="expense-item-amount">₹{expense.amount.toFixed(2)}</span>
                </div>
                <div className="expense-item-details">
                  <span>{expense.paidBy} paid • Split among {splitPeople.length} people (₹{perPerson} each)</span>
                  <button className="expense-item-delete" onClick={() => deleteExpense(expense.id)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Balances */}
      {people.length > 0 && (
        <div className="card">
          <h2>⚖️ Balances</h2>
          {people.length === 0 ? (
            <div className="empty-state">No people to show balances</div>
          ) : (
            people.map(person => (
              <div key={person} className="balance-item">
                <span className="balance-item-name">{person}</span>
                <span className={`balance-item-amount ${balances[person] > 0 ? 'balance-positive' : balances[person] < 0 ? 'balance-negative' : ''}`}>
                  {balances[person] > 0 ? '+' : ''} ₹{balances[person].toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Settle Up */}
      {people.length > 0 && (
        <div className="card">
          <h2>🤝 Settle Up</h2>
          {transactions.length === 0 ? (
            <div className="empty-state">Everyone is settled up!</div>
          ) : (
            <>
              {transactions.map((transaction, index) => (
                <div key={index} className="transaction-item">
                  <span className="transaction-text">
                    <strong>{transaction.from}</strong> pays <strong>{transaction.to}</strong>{' '}
                    <span className="transaction-amount">₹{transaction.amount.toFixed(2)}</span>
                  </span>
                </div>
              ))}
              <div className="button-group">
                <button className="copy-button" onClick={copyToClipboard}>
                  📋 Copy Summary
                </button>
              </div>
              {copyMessage && <div className="success">{copyMessage}</div>}
            </>
          )}
        </div>
      )}
    </div>
  );
}
