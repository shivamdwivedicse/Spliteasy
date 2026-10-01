export function settleUp(balances) {
  const transactions = [];
  const bal = { ...balances };
  
  while (true) {
    const debtor = Object.entries(bal)
      .filter(([_, amount]) => amount < -0.01)
      .sort(([, a], [, b]) => a - b)[0];
    
    const creditor = Object.entries(bal)
      .filter(([_, amount]) => amount > 0.01)
      .sort(([, a], [, b]) => b - a)[0];
    
    if (!debtor || !creditor) break;
    
    const [debtorName, debtorAmount] = debtor;
    const [creditorName, creditorAmount] = creditor;
    
    const amount = Math.min(-debtorAmount, creditorAmount);
    
    transactions.push({
      from: debtorName,
      to: creditorName,
      amount: Math.round(amount * 100) / 100
    });
    
    bal[debtorName] += amount;
    bal[creditorName] -= amount;
  }
  
  return transactions;
}
