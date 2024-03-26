export function percentage(numerator: number, denominator: number): number {
  const calc = (numerator / denominator) * 100
  return isNaN(calc) ? 0 : calc
}
