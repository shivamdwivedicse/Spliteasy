<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:667eea,100:764ba2&height=200&section=header&text=SplitEasy&fontSize=70&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Split%20expenses.%20Settle%20smart.%20Stay%20friends.&descAlignY=60&descSize=18" alt="SplitEasy banner" />

<a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&pause=1000&color=764BA2&center=true&vCenter=true&width=600&lines=Who+paid+for+dinner%3F+%F0%9F%8D%95;Who+owes+whom%3F+%F0%9F%A4%94;Minimum+transactions.+Zero+confusion.+%E2%9C%85" alt="Typing animation" /></a>

<br/>

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white&style=for-the-badge)
![Vitest](https://img.shields.io/badge/Vitest-Tested-6E9F18?logo=vitest&logoColor=white&style=for-the-badge)
![GitHub Pages](https://img.shields.io/badge/Deployed-GitHub%20Pages-222?logo=github&logoColor=white&style=for-the-badge)
![Built with Copilot](https://img.shields.io/badge/Built%20with-GitHub%20Copilot-8957e5?logo=githubcopilot&logoColor=white&style=for-the-badge)

**[🚀 Live Demo](https://YOUR-USERNAME.github.io/Spliteasy/)** · **[🐛 Report Bug](../../issues)** · **[✨ Request Feature](../../issues)**

</div>

---

## 😩 Problem Statement

Trips, flatmates, dinners, groceries, cab rides... shared expenses are everywhere, and so is the confusion:

- 🤯 *"Wait, who paid for the movie tickets?"*
- 🧮 Everyone calculates differently, and nobody trusts the numbers.
- 🔁 With 4-5 people, you end up with a **messy web of payments**: A pays B, B pays C, C pays A.
- 📱 Existing apps are heavy: sign-ups, ads, and accounts just to split ₹600.

## 💡 Solution

**SplitEasy** is a lightweight, no-login, mobile-friendly web app that:

1. 📝 Records every shared expense (who paid, who's included)
2. ⚖️ Calculates each person's **net balance** live
3. 🤝 Runs a **greedy settle-up algorithm** that gives the **minimum number of payments** needed to clear all debts
4. 📋 Lets you **copy the summary** and drop it in your WhatsApp group in one click

No server. No sign-up. Your data stays in **your browser**.

---

## ✨ Features

| | Feature | Description |
|---|---|---|
| 👥 | **People Management** | Add or remove group members, each with a monthly budget |
| 💳 | **Shared & Personal Expenses** | Split among selected people, or track your own spending separately |
| ⚖️ | **Live Balances** | See who is owed and who owes, updated instantly |
| 🤝 | **Smart Settle Up** | Minimum transactions via greedy matching |
| ✅ | **Mark as Paid** | Record repayments and watch dues disappear |
| 👛 | **Wallet Tracker** | Monthly budget minus spending, plus repayments, equals wallet left |
| 🔄 | **Reset Month** | Start fresh every month in one click |
| 📋 | **One-Click Copy** | Copy settle-up text and share it anywhere |
| 💾 | **Persistent Storage** | Everything saved in `localStorage`, so refresh is safe |
| 🛡️ | **Input Validation** | No empty names, no negative amounts, at least one person per split |
| 📱 | **Responsive UI** | Clean gradient design that works on phone and desktop |
| 🧪 | **Unit Tested** | Settle-up algorithm covered with Vitest |

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|:---:|:---:|
| **UI Framework** | <img src="https://skillicons.dev/icons?i=react" height="40" /><br/>React 18 |
| **Build Tool** | <img src="https://skillicons.dev/icons?i=vite" height="40" /><br/>Vite 5 |
| **Styling** | <img src="https://skillicons.dev/icons?i=css" height="40" /><br/>Vanilla CSS |
| **Language** | <img src="https://skillicons.dev/icons?i=js" height="40" /><br/>JavaScript (ES Modules) |
| **Testing** | <img src="https://skillicons.dev/icons?i=vitest" height="40" /><br/>Vitest + jsdom |
| **Storage** | <img src="https://skillicons.dev/icons?i=html" height="40" /><br/>Browser localStorage |
| **CI/CD** | <img src="https://skillicons.dev/icons?i=githubactions" height="40" /><br/>GitHub Actions → Pages |
| **AI Pair Programmer** | <img src="https://skillicons.dev/icons?i=github" height="40" /><br/>GitHub Copilot |

</div>

---

## 🧠 How the Settle-Up Algorithm Works

```text
1. Compute net balance for everyone (paid − share)
2. Pick the biggest debtor and the biggest creditor
3. Debtor pays creditor min(|debt|, credit)
4. Update both balances, drop anyone who reached ₹0
5. Repeat until all balances are zero
```

**Example**

```text
Balances →  Alice: +₹100   Bob: −₹50   Charlie: −₹50

Result   →  1. Bob     pays Alice ₹50
            2. Charlie pays Alice ₹50
```

Two payments instead of a tangled mess. 🎯

---

## 🤖 Built with GitHub Copilot

This project was built at the **GitHub Copilot event**, with Copilot as the pair programmer through the whole journey:

| Stage | How Copilot helped |
|---|---|
| 🏗️ Scaffolding | Project structure, `package.json`, Vite config, HTML |
| ⚛️ Components | Main `App` component and state management |
| 🧮 Algorithm | Greedy settle-up logic and edge-case handling |
| 🧪 Testing | Unit tests for the settle-up function |
| 🎨 Styling | Responsive card layout with gradient theme |
| 🚀 Deployment | GitHub Actions workflow for Pages |
| 📚 Docs | README and usage instructions |

---

## 🚀 Getting Started

```bash
# 1. Clone
git clone https://github.com/YOUR-USERNAME/Spliteasy.git
cd Spliteasy

# 2. Install
npm install

# 3. Run
npm run dev        # → http://localhost:5173/Spliteasy/

# 4. Test
npm test

# 5. Production build
npm run build
```

## 📖 How to Use

1. **Add people** with their monthly budget
2. **Add an expense**: description, amount, who paid, and who is part of the split
3. **Check balances** to see who owes and who gets back
4. **Settle up** to see the minimum payments needed
5. **Copy & share** the summary with your group, then mark dues as paid

## 📁 Project Structure

```text
Spliteasy/
├── .github/workflows/static.yml   # Auto-deploy to GitHub Pages
├── src/
│   ├── App.jsx                    # Main UI + state
│   ├── settleUp.js                # Greedy settle-up algorithm
│   ├── settleUp.test.js           # Unit tests
│   ├── index.css                  # Styling
│   └── main.jsx                   # Entry point
├── index.html
├── vite.config.js
└── package.json
```

## 🗺️ Roadmap

- [ ] Unequal / percentage splits
- [ ] Export to CSV / PDF
- [ ] Multiple groups
- [ ] Dark mode
- [ ] UPI deep-link for instant payment

## 📄 License

Distributed under the **MIT License**.

---

<div align="center">

Made with ❤️ and a lot of ☕ at the **GitHub Copilot event**

⭐ **Star this repo if it saved you from an awkward "who owes what" chat!** ⭐

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:764ba2,100:667eea&height=100&section=footer" alt="footer" />

</div>
