const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0
});

export function formatCurrency(value) {
  return vndFormatter.format(Number(value || 0));
}

export function formatVnd(value) {
  return vndFormatter.format(Number(value || 0));
}
