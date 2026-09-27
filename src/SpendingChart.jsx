import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, Subtitle2, Text } from '@fluentui/react-components'
import { formatMoney } from './format.js'

// Recharts sets colors as SVG attributes, which can't read CSS variables, so the
// marks and text get their colors from App.css classes (Fluent tokens, per theme).
const BAR_SIZE = 20;
const ROW_HEIGHT = 40;

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { category, amount, type } = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <span className="chart-tooltip-label">
        <span className={`swatch swatch-${type}`} aria-hidden="true" />
        {capitalize(category)}
      </span>
      <span className="chart-tooltip-value">{formatMoney(amount)}</span>
    </div>
  );
}

function SpendingChart({ transactions }) {
  const totals = {};
  for (const t of transactions) {
    const entry = (totals[t.category] ??= { income: 0, expense: 0 });
    entry[t.type] += t.amount;
  }
  const data = Object.entries(totals)
    .map(([category, { income, expense }]) => ({
      category,
      amount: income + expense,
      // A category is shown in the color of whichever side dominates it.
      type: income > expense ? "income" : "expense",
    }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <Card className="panel spending-chart">
      <div className="panel-header">
        <Subtitle2 as="h2">Totals by category</Subtitle2>
        <ul className="chart-legend">
          <li><span className="swatch swatch-income" aria-hidden="true" />Income</li>
          <li><span className="swatch swatch-expense" aria-hidden="true" />Expenses</li>
        </ul>
      </div>
      {data.length === 0 ? (
        <Text as="p" className="empty-state">Add a transaction to see where your money goes.</Text>
      ) : (
        <ResponsiveContainer width="100%" height={data.length * ROW_HEIGHT + 32}>
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 64, bottom: 0, left: 0 }}>
            <CartesianGrid horizontal={false} className="chart-grid" />
            <XAxis
              type="number"
              tickFormatter={formatMoney}
              tick={{ fontSize: 12, className: "chart-tick-muted" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="category"
              width={104}
              tickFormatter={capitalize}
              tick={{ fontSize: 14, className: "chart-tick" }}
              axisLine={{ className: "chart-axis" }}
              tickLine={false}
              interval={0}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ className: "chart-cursor" }} />
            <Bar
              dataKey="amount"
              barSize={BAR_SIZE}
              radius={[0, 4, 4, 0]}
              isAnimationActive={!prefersReducedMotion()}
            >
              {data.map(({ category, type }) => (
                <Cell key={category} className={`bar-${type}`} />
              ))}
              <LabelList
                dataKey="amount"
                position="right"
                formatter={formatMoney}
                fontSize={13}
                className="chart-tick"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}

export default SpendingChart
