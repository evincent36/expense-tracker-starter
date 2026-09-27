import { Text } from '@fluentui/react-components'
import { formatMoney } from './format.js'

function Summary({ transactions }) {
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;
  const inTheRed = balance < 0;

  return (
    <section className="summary" aria-label="Summary">
      <Text as="p" className={`summary-headline${inTheRed ? " is-red" : ""}`}>
        You’re <span className="summary-balance">{formatMoney(Math.abs(balance))}</span>{" "}
        in the {inTheRed ? "red" : "black"}.
      </Text>
      <Text as="p" size={400} className="summary-detail">
        <span className="income-amount">{formatMoney(totalIncome)}</span> came in,{" "}
        <span className="expense-amount">{formatMoney(totalExpenses)}</span> went out.
      </Text>
    </section>
  );
}

export default Summary
