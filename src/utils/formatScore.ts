/** Format a quiz score as a percentage string */
export function formatScore(score: number): string {
  return `${Math.round(score)}%`
}

/** Get a colour variant based on score */
export function scoreVariant(score: number): 'success' | 'warning' | 'danger' {
  if (score >= 80) return 'success'
  if (score >= 50) return 'warning'
  return 'danger'
}
