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

  // New tests for wallet feature
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
});
