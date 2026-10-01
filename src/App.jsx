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

  const [repayments, setRepayments] = useState(() => {
    const saved = localStorage.getItem('spliteasy-repayments');
    return saved ? JSON.parse(saved) : [];
  });

  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonBudget, setNewPersonBudget] = useState('');
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

  useEffect(() => {
    localStorage.setItem('spliteasy-repayments', JSON.stringify(repayments));
  }, [repayments]);

  const addPerson = () => {
    if (!newPersonName.trim()) {
      alert('Please enter a person name');
      return;
    }
    if (people.some(p => p.name === newPersonName)) {
      alert('This person already exists');
      return;
    }
    if (!newPersonBudget || parseFloat(newPersonBudget) <= 0) {
      alert('Please enter a valid monthly budget');
      return;
    }
    setPeople([...people, { name: newPersonName, monthlyBudget: parseFloat(newPersonBudget) }]);
    setNewPersonName('');
    setNewPersonBudget('');
  };

  const removePerson = (name) => {
    setPeople(people.filter(p => p.name !== name));
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
      balances[p.name] = 0;
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

  const calculateWallets = () => {
    const balances = calculateBalances();
    const wallets = {};
    
    people.forEach(p => {
      let wallet = p.monthlyBudget;
      
      // Subtract amount paid out
      wallet -= balances[p.name] > 0 ? balances[p.name] : 0;
      
      // Add repayments received
      repayments.forEach(rep => {
        if (rep.to === p.name) {
          wallet += rep.amount;
        }
        if (rep.from === p.name) {
          wallet -= rep.amount;
        }
      });
      
      wallets[p.name] = wallet;
    });
    
    return wallets;
  };

  const calculateDues = () => {
    const balances = calculateBalances();
    const dues = [];
    
    // Get settle up transactions
    const transactions = settleUp(balances);
    
    // Filter out already paid dues
    transactions.forEach(t => {
      const isPaid = repayments.some(rep => 
        rep.from === t.from && rep.to === t.to && rep.amount >= t.amount
      );
      if (!isPaid) {
        dues.push(t);
      }
    });
    
    return dues;
  };

  const markAsPaid = (from, to, amount) => {
    setRepayments([...repayments, { from, to, amount, id: Date.now() }]);
  };

  const resetMonth = () => {
    if (confirm('Are you sure you want to reset the month? This will clear all expenses and repayments.')) {
      setExpenses([]);
      setRepayments([]);
    }
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

      {/* New Month Button */}
      {people.length > 0 && expenses.length > 0 && (
        <div className="card">
          <button onClick={resetMonth} className="reset-month-btn">
            🔄 New Month
          </button>
        </div>
      )}

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
          <input
            type="number"
            placeholder="Monthly budget"
            value={newPersonBudget}
            onChange={e => setNewPersonBudget(e.target.value)}
            step="0.01"
            onKeyPress={e => e.key === 'Enter' && addPerson()}
          />
          <button onClick={addPerson}>Add</button>
        </div>
        {people.length === 0 ? (
          <div className="empty-state">No people added yet</div>
        ) : (
          people.map(person => (
            <div key={person.name} className="person-item">
              <span>{person.name}</span>
              <button onClick={() => removePerson(person.name)}>Remove</button>
            </div>
          ))
        )}
      </div>

      {/* Wallets with Dues */}
      {people.length > 0 && (
        <>
          {(() => {
            const wallets = calculateWallets();
            const dues = calculateDues();
            return people.map(person => {
              const wallet = wallets[person.name];
              const personDues = dues.filter(d => d.from === person.name || d.to === person.name);
              return (
                <div key={person.name} className={`card wallet-card ${wallet < 0 ? 'wallet-danger' : ''}`}>
                  <h3>{person.name}</h3>
                  <div className="wallet-info">
                    <div className="wallet-row">
                      <span className="wallet-label">Monthly Budget:</span>
                      <span className="wallet-value">₹{person.monthlyBudget.toFixed(2)}</span>
                    </div>
                    <div className={`wallet-row ${wallet < 0 ? 'wallet-warning' : ''}`}>
                      <span className="wallet-label">Wallet Left:</span>
                      <span className={`wallet-value ${wallet < 0 ? 'wallet-negative' : ''}`}>
                        ₹{wallet.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  {personDues.length > 0 && (
                    <div className="dues-section">
                      <h4>💳 Dues</h4>
                      {personDues.map((due, idx) => (
                        <div key={idx} className="due-item">
                          {due.from === person.name ? (
                            <span>{person.name} needs to pay {due.to} <strong>₹{due.amount.toFixed(2)}</strong></span>
                          ) : (
                            <span>{due.from} needs to pay {person.name} <strong>₹{due.amount.toFixed(2)}</strong></span>
                          )}
                          <button 
                            className="mark-paid-btn"
                            onClick={() => markAsPaid(due.from, due.to, due.amount)}
                          >
                            ✓ Mark as Paid
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            });
          })()}
        </>
      )}

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
                <option key={person.name} value={person.name}>{person.name}</option>
              ))}
            </select>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                Split between:
              </label>
              <div className="checkbox-group">
                {people.map(person => (
                  <div key={person.name} className="checkbox-item">
                    <input
                      type="checkbox"
                      id={`split-${person.name}`}
                      checked={expenseForm.splitBetween[person.name] || false}
                      onChange={() => handleSplitChange(person.name)}
                    />
                    <label htmlFor={`split-${person.name}`}>{person.name}</label>
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
            people.map(person => {
              const balances = calculateBalances();
              return (
                <div key={person.name} className="balance-item">
                  <span className="balance-item-name">{person.name}</span>
                  <span className={`balance-item-amount ${balances[person.name] > 0 ? 'balance-positive' : balances[person.name] < 0 ? 'balance-negative' : ''}`}>
                    {balances[person.name] > 0 ? '+' : ''} ₹{balances[person.name].toFixed(2)}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Settle Up */}
      {people.length > 0 && (
        <div className="card">
          <h2>🤝 Settle Up</h2>
          {(() => {
            const dues = calculateDues();
            if (dues.length === 0) {
              return <div className="empty-state">Everyone is settled up!</div>;
            }
            return (
              <>
                {dues.map((due, index) => (
                  <div key={index} className="transaction-item">
                    <span className="transaction-text">
                      <strong>{due.from}</strong> pays <strong>{due.to}</strong>{' '}
                      <span className="transaction-amount">₹{due.amount.toFixed(2)}</span>
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
            );
          })()}
        </div>
      )}
    </div>
  );
}
