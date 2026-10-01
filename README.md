# 💰 SplitEasy

A modern, mobile-friendly expense-splitting web app built with React + Vite.

## Problem

When friends or roommates share expenses (dinners, groceries, rent), tracking who owes whom becomes complex. SplitEasy simplifies this by:
- Recording shared expenses with equal splits
- Calculating each person's net balance
- Computing the minimum number of transactions needed to settle all debts

## Features

✅ **Add & Remove People** - Build your group dynamically  
✅ **Expense Tracking** - Add expenses with description, amount, payer, and split details  
✅ **Live Balances** - See who owes/is owed money in real-time  
✅ **Smart Settle Up** - Greedy algorithm that matches the biggest creditor with the biggest debtor to minimize transactions  
✅ **One-Click Copy** - Copy settle-up instructions to clipboard  
✅ **Persistent Storage** - All data saved to localStorage  
✅ **Input Validation** - No empty names, positive amounts, at least one person per split  
✅ **Mobile Friendly** - Responsive design with gradient UI  
✅ **Unit Tests** - Comprehensive tests for the settle-up algorithm  

## Tech Stack

- **React 18** - UI framework
- **Vite** - Fast build tool
- **Vitest** - Testing framework
- **Vanilla CSS** - No dependencies, optimized styling
- **localStorage** - Persistent state

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Testing

```bash
npm test
```

### Build

```bash
npm run build
```

## How to Use

1. **Add People** - Enter names and click "Add" to build your group
2. **Add Expenses** - Fill in the description, amount, who paid, and who it's split between (equal split only)
3. **Review Balances** - See positive (owed to) and negative (owes) amounts for each person
4. **Settle Up** - View the minimum settlement transactions needed
5. **Copy & Share** - Click "Copy Summary" to share settlement instructions

## Settle Up Algorithm

The settlement algorithm is greedy and works as follows:

1. Find the person with the largest positive balance (creditor)
2. Find the person with the largest negative balance (debtor)
3. Transfer the minimum of these two amounts
4. Remove anyone with zero balance
5. Repeat until everyone is settled

**Example:**
```
Balances: Alice: ₹100, Bob: -50, Charlie: -50

Transactions:
1. Bob pays Alice ₹50
2. Charlie pays Alice ₹50
```

This approach minimizes the number of transactions while ensuring all debts are settled accurately.

## How I Used Copilot

This entire app was built using GitHub Copilot to:

1. **Scaffolding** - Generated project structure with package.json, vite.config.js, and HTML
2. **Component Generation** - Created the main App component with state management patterns
3. **Algorithm Implementation** - Developed the greedy settle-up algorithm with edge case handling
4. **Testing** - Generated comprehensive unit tests for the settle-up function
5. **Styling** - Built responsive CSS with gradient backgrounds and card layouts
6. **Best Practices** - Implemented localStorage persistence, input validation, and error handling
7. **Documentation** - Created this README with clear problem statement and usage instructions

Copilot helped accelerate development from concept to production-ready app in a single session, ensuring code quality and feature completeness.

## License

MIT
