import { useState } from 'react'
import {
  Button,
  Card,
  Select,
  Subtitle2,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Text,
} from '@fluentui/react-components'
import { DeleteRegular } from '@fluentui/react-icons'
import ConfirmDialog from './ConfirmDialog.jsx'
import { formatDate, formatMoney } from './format.js'

// `children` is rendered between the header and the table (App passes the entry form).
function TransactionList({ transactions, categories, onDelete, children }) {
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [pendingDelete, setPendingDelete] = useState(null);

  let filteredTransactions = transactions;
  if (filterType !== "all") {
    filteredTransactions = filteredTransactions.filter(t => t.type === filterType);
  }
  if (filterCategory !== "all") {
    filteredTransactions = filteredTransactions.filter(t => t.category === filterCategory);
  }

  return (
    <Card className="panel transactions">
      <div className="panel-header">
        <Subtitle2 as="h2">Transactions</Subtitle2>
        <div className="filters">
          <Select
            aria-label="Filter by type"
            value={filterType}
            onChange={(_e, data) => setFilterType(data.value)}
          >
            <option value="all">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expenses</option>
          </Select>
          <Select
            aria-label="Filter by category"
            value={filterCategory}
            onChange={(_e, data) => setFilterCategory(data.value)}
          >
            <option value="all">All categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>
        </div>
      </div>

      {children}

      {filteredTransactions.length === 0 ? (
        <Text as="p" className="empty-state">
          {transactions.length === 0
            ? "No transactions yet. Add your first one above."
            : "Nothing matches these filters. Try a different type or category."}
        </Text>
      ) : (
        <Table className="ledger" aria-label="Transactions">
          <TableHeader>
            <TableRow>
              <TableHeaderCell className="col-date">Date</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
              <TableHeaderCell className="col-category">Category</TableHeaderCell>
              <TableHeaderCell className="col-amount">Amount</TableHeaderCell>
              <TableHeaderCell className="col-actions">
                <span className="visually-hidden">Actions</span>
              </TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map(t => (
              <TableRow key={t.id}>
                <TableCell className="col-date">
                  <time dateTime={t.date}>{formatDate(t.date)}</time>
                </TableCell>
                <TableCell className="col-description">{t.description}</TableCell>
                <TableCell className="col-category">{t.category}</TableCell>
                <TableCell className={`col-amount ${t.type === "income" ? "income-amount" : "expense-amount"}`}>
                  {t.type === "income" ? "+" : "−"}{formatMoney(t.amount)}
                </TableCell>
                <TableCell className="col-actions">
                  <Button
                    appearance="subtle"
                    icon={<DeleteRegular />}
                    onClick={() => setPendingDelete(t)}
                    aria-label={`Delete ${t.description}`}
                    title="Delete"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete this transaction?"
          message={`“${pendingDelete.description}” (${formatMoney(pendingDelete.amount)}) will be removed from your ledger.`}
          confirmLabel="Delete"
          onConfirm={() => {
            onDelete(pendingDelete.id);
            setPendingDelete(null);
          }}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </Card>
  );
}

export default TransactionList
