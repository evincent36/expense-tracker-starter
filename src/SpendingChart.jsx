import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const CATEGORY_COLORS = {
  housing: "#e34948",
  food: "#2a78d6",
  salary: "#eda100",
  utilities: "#1baf7a",
  transport: "#4a3aa7",
  entertainment: "#eb6834",
};
const DEFAULT_COLOR = "#9e9e9e";
const BAR_SIZE = 48;

const formatAmount = (value) => `$${value.toLocaleString()}`;

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { category, amount } = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <span className="chart-tooltip-label">{category}</span>
      <span className="chart-tooltip-value">{formatAmount(amount)}</span>
    </div>
  );
}

function SpendingChart({ transactions }) {
  const totals = {};
  for (const t of transactions) {
    totals[t.category] = (totals[t.category] ?? 0) + t.amount;
  }
  const data = Object.entries(totals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="spending-chart">
      <h2>Totals by Category</h2>
      {data.length === 0 ? (
        <p className="spending-chart-empty">No transactions yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 24, right: 8, bottom: 4, left: 8 }}>
            <CartesianGrid vertical={false} stroke="#eee" />
            <XAxis
              type="category"
              dataKey="category"
              tick={{ fontSize: 13, fill: "#333" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="number"
              tickFormatter={formatAmount}
              width={64}
              tick={{ fontSize: 12, fill: "#888" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f5f5f5" }} />
            <Bar dataKey="amount" barSize={BAR_SIZE} radius={[4, 4, 0, 0]}>
              {data.map(({ category }) => (
                <Cell key={category} fill={CATEGORY_COLORS[category] ?? DEFAULT_COLOR} />
              ))}
              <LabelList dataKey="amount" position="top" formatter={formatAmount} fontSize={12} fill="#333" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default SpendingChart
