import { useState } from 'react'
import { Button, Field, Input, Radio, RadioGroup, Select } from '@fluentui/react-components'
import { AddRegular } from '@fluentui/react-icons'

function TransactionForm({ categories, onAdd }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("food");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    onAdd({
      id: Date.now(),
      description,
      amount: Number(amount),
      type,
      category,
      date: new Date().toISOString().split('T')[0],
    });

    setDescription("");
    setAmount("");
    setType("expense");
    setCategory("food");
  };

  return (
    <form className="entry-form" onSubmit={handleSubmit} aria-label="Add a transaction">
      <Field label="Type" className="field-type">
        <RadioGroup layout="horizontal" value={type} onChange={(_e, data) => setType(data.value)}>
          <Radio value="expense" label="Expense" />
          <Radio value="income" label="Income" />
        </RadioGroup>
      </Field>
      <Field label="Description" className="field-description">
        <Input
          placeholder="e.g. Groceries"
          value={description}
          onChange={(_e, data) => setDescription(data.value)}
          required
        />
      </Field>
      <Field label="Amount" className="field-amount">
        <Input
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          placeholder="0.00"
          contentBefore="$"
          value={amount}
          onChange={(_e, data) => setAmount(data.value)}
          required
        />
      </Field>
      <Field label="Category" className="field-category">
        <Select value={category} onChange={(_e, data) => setCategory(data.value)}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </Select>
      </Field>
      <Button type="submit" appearance="primary" icon={<AddRegular />} className="entry-submit">
        Add {type}
      </Button>
    </form>
  );
}

export default TransactionForm
