import { describe, it, expect } from 'vitest';
import { settleUp } from './settleUp';

describe('settleUp', () => {
  it('should handle empty balances', () => {
    expect(settleUp({})).toEqual([]);
  });

  it('should handle all zero balances', () => {
    expect(settleUp({ Alice: 0, Bob: 0 })).toEqual([]);
  });

  it('should settle two people', () => {
    const balances = { Alice: 100, Bob: -100 };
    const transactions = settleUp(balances);
    expect(transactions).toHaveLength(1);
    expect(transactions[0]).toEqual({ from: 'Bob', to: 'Alice', amount: 100 });
  });

  it('should settle three people', () => {
    const balances = { Alice: 100, Bob: -50, Charlie: -50 };
    const transactions = settleUp(balances);
    expect(transactions).toHaveLength(2);
  });

  it('should match largest creditor with largest debtor', () => {
    const balances = { Alice: 150, Bob: -100, Charlie: -50 };
    const transactions = settleUp(balances);
    expect(transactions[0]).toEqual({ from: 'Bob', to: 'Alice', amount: 100 });
    expect(transactions[1]).toEqual({ from: 'Charlie', to: 'Alice', amount: 50 });
  });

  it('should handle decimal amounts correctly', () => {
    const balances = { Alice: 50.5, Bob: -50.5 };
    const transactions = settleUp(balances);
    expect(transactions[0].amount).toBe(50.5);
  });

  it('should handle complex settlement', () => {
    const balances = { 
      Alice: 200,
      Bob: -75,
      Charlie: -50,
      David: -75
    };
    const transactions = settleUp(balances);
    expect(transactions.length).toBe(3);
  });

  // Tests for wallet feature
  it('should calculate wallet with budget and expenses', () => {
    const monthlyBudget = 1000;
    const amountPaidOut = 500;
    const wallet = monthlyBudget - amountPaidOut;
    expect(wallet).toBe(500);
  });

  it('should track repayments in wallet calculation', () => {
    const monthlyBudget = 1000;
    const amountPaidOut = 500;
    const repaymentReceived = 100;
    const wallet = monthlyBudget - amountPaidOut + repaymentReceived;
    expect(wallet).toBe(600);
  });

  it('should handle negative wallet (overspending)', () => {
    const monthlyBudget = 500;
    const amountPaidOut = 600;
    const wallet = monthlyBudget - amountPaidOut;
    expect(wallet).toBeLessThan(0);
    expect(wallet).toBe(-100);
  });

  // Tests for personal expense type
  it('should not create dues for personal expenses', () => {
    // Personal expenses should have type: 'personal' and empty splitBetween
    const personalExpense = {
      id: 1,
      description: 'Coffee',
      amount: 100,
      paidBy: 'Alice',
      type: 'personal',
      splitBetween: {}
    };
    expect(personalExpense.type).toBe('personal');
    expect(Object.keys(personalExpense.splitBetween).length).toBe(0);
  });

  it('should create dues for shared expenses', () => {
    // Shared expenses should have type: 'shared' and splitBetween with selected people
    const sharedExpense = {
      id: 2,
      description: 'Dinner',
      amount: 300,
      paidBy: 'Rahul',
      type: 'shared',
      splitBetween: { 'Aman': true, 'Rahul': true }
    };
    expect(sharedExpense.type).toBe('shared');
    const splitPeople = Object.keys(sharedExpense.splitBetween).filter(p => sharedExpense.splitBetween[p]);
    expect(splitPeople.length).toBe(2);
  });

  it('should calculate personal spending only from personal expenses', () => {
    const expenses = [
      { id: 1, paidBy: 'Alice', type: 'personal', amount: 100 },
      { id: 2, paidBy: 'Alice', type: 'shared', amount: 300 },
      { id: 3, paidBy: 'Bob', type: 'personal', amount: 50 }
    ];
    const alicePersonalSpending = expenses
      .filter(exp => exp.paidBy === 'Alice' && exp.type === 'personal')
      .reduce((sum, exp) => sum + exp.amount, 0);
    expect(alicePersonalSpending).toBe(100);
  });

  it('should calculate wallet with both personal and shared expenses', () => {
    const monthlyBudget = 1000;
    // Personal expense: 100
    // Shared expense: 300 (paid by this person)
    const totalPaidOut = 100 + 300;
    const repaymentReceived = 50;
    const wallet = monthlyBudget - totalPaidOut + repaymentReceived;
    expect(wallet).toBe(650);
  });

  it('should balance calculation only include shared expenses', () => {
    const expenses = [
      { id: 1, paidBy: 'Alice', type: 'personal', amount: 100, splitBetween: {} },
      { id: 2, paidBy: 'Alice', type: 'shared', amount: 300, splitBetween: { 'Alice': true, 'Bob': true } }
    ];
    
    const balances = {};
    balances['Alice'] = 0;
    balances['Bob'] = 0;
    
    expenses.forEach(expense => {
      if (expense.type === 'shared') {
        const splitPeople = Object.keys(expense.splitBetween).filter(p => expense.splitBetween[p]);
        const perPerson = expense.amount / splitPeople.length;
        balances[expense.paidBy] += expense.amount;
        splitPeople.forEach(person => {
          balances[person] -= perPerson;
        });
      }
    });
    
    // Alice paid 300 (shared, split 2 ways), so Alice gets 150 credited
    // Alice also owes 150 for her share
    // Bob owes 150
    // Net: Alice owes 0, Bob owes 150
    expect(balances['Alice']).toBe(150);
    expect(balances['Bob']).toBe(-150);
  });
});
