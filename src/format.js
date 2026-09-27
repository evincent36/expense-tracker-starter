const moneyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

export const formatMoney = (value) => moneyFormat.format(value);

// Parse "YYYY-MM-DD" as a local date; `new Date(string)` would treat it as UTC.
export const formatDate = (isoDate) => {
  const [y, m, d] = isoDate.split("-").map(Number);
  return dateFormat.format(new Date(y, m - 1, d));
};
