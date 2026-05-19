/** Nepali Rupee formatting (display only; NPR uses same digits/locale patterns as many EN locales). */
export function formatNpr(amount: number): string {
  return new Intl.NumberFormat("ne-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(amount);
}
