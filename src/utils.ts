export function formatCurrency(value?: number | null): string {
  if (value === undefined || value === null || isNaN(Number(value))) {
    return "R$ 0,00";
  }
  return Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function getOrderTotal(order: { totalAmount?: number; salePrice?: number; quantity?: number }): number {
  if (typeof order.totalAmount === "number" && !isNaN(order.totalAmount)) {
    return order.totalAmount;
  }
  const price = typeof order.salePrice === "number" ? order.salePrice : 0;
  const qty = typeof order.quantity === "number" ? order.quantity : 1;
  return price * qty;
}
