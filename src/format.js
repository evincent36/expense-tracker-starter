const moneyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  // "$1,200" for whole dollars, but always two digits with cents ("$12.50").
  trailingZeroDisplay: "stripIfInteger",
});

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

export const formatMoney = (value) => moneyFormat.format(value);

// Today's local date as "YYYY-MM-DD". `toISOString()` would give the UTC date,
// which is already tomorrow on evenings west of UTC.
export const todayIso = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// Parse "YYYY-MM-DD" as a local date; `new Date(string)` would treat it as UTC.
export const formatDate = (isoDate) => {
  const [y, m, d] = isoDate.split("-").map(Number);
  return dateFormat.format(new Date(y, m - 1, d));
};
