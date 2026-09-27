import { useState, useSyncExternalStore } from 'react'
import { FluentProvider, Text, webDarkTheme, webLightTheme } from '@fluentui/react-components'
import { WalletRegular } from '@fluentui/react-icons'
import './App.css'
import Summary from './Summary.jsx'
import SpendingChart from './SpendingChart.jsx'
import TransactionForm from './TransactionForm.jsx'
import TransactionList from './TransactionList.jsx'

const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
const subscribeToColorScheme = (callback) => {
  darkQuery.addEventListener("change", callback);
  return () => darkQuery.removeEventListener("change", callback);
};

function App() {
  const prefersDark = useSyncExternalStore(subscribeToColorScheme, () => darkQuery.matches);

  const [transactions, setTransactions] = useState([
    { id: 1, description: "Salary", amount: 5000, type: "income", category: "salary", date: "2025-01-01" },
    { id: 2, description: "Rent", amount: 1200, type: "expense", category: "housing", date: "2025-01-02" },
    { id: 3, description: "Groceries", amount: 150, type: "expense", category: "food", date: "2025-01-03" },
    { id: 4, description: "Freelance Work", amount: 800, type: "income", category: "salary", date: "2025-01-05" },
    { id: 5, description: "Electric Bill", amount: 95, type: "expense", category: "utilities", date: "2025-01-06" },
    { id: 6, description: "Dinner Out", amount: 65, type: "expense", category: "food", date: "2025-01-07" },
    { id: 7, description: "Gas", amount: 45, type: "expense", category: "transport", date: "2025-01-08" },
    { id: 8, description: "Netflix", amount: 15, type: "expense", category: "entertainment", date: "2025-01-10" },
  ]);

  const categories = ["food", "housing", "utilities", "transport", "entertainment", "salary", "other"];

  const handleAdd = (transaction) => {
    setTransactions([...transactions, transaction]);
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <FluentProvider theme={prefersDark ? webDarkTheme : webLightTheme} className="app-root">
      <header className="app-bar">
        <WalletRegular className="app-bar-icon" aria-hidden="true" />
        <Text as="h1" weight="semibold" size={400}>Finance Tracker</Text>
      </header>

      <main className="app">
        <Summary transactions={transactions} />
        <SpendingChart transactions={transactions} />
        <TransactionList transactions={transactions} categories={categories} onDelete={handleDelete}>
          <TransactionForm categories={categories} onAdd={handleAdd} />
        </TransactionList>
      </main>
    </FluentProvider>
  );
}

export default App
