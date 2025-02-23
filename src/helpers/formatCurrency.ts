export const formatCurrency = (value: number | null | undefined, precision?: number) => {
  if (value === null || value === undefined) {
    return '-';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: precision ?? 2,
    maximumFractionDigits: precision ?? 2,
  }).format(value);
};
