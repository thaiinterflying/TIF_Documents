export function calculateFinalPrice(totalPrice: number | string | null | undefined, discount: number | string | null | undefined): number {
  const total = typeof totalPrice === 'number' ? totalPrice : parseFloat(String(totalPrice || '0')) || 0;
  const disc = typeof discount === 'number' ? discount : parseFloat(String(discount || '0')) || 0;
  return Math.max(0, total - disc);
}

export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === '') return '0';
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount));
  if (isNaN(num)) return '0';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function formatDateDisplay(dateString?: string): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}
