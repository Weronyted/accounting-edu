/**
 * Flexible answer matching for quiz inputs.
 * Accepts the answer as correct if it matches any "variant" from the correct answer.
 *
 * Correct answers may have multiple acceptable forms separated by " / ":
 *   "Bank / Cash"  →  "Bank" ✓  |  "Cash" ✓  |  "Bank / Cash" ✓
 *   "Capital / Owner's Equity" → "Capital" ✓ | "Owner's Equity" ✓
 *
 * Rules (in priority order):
 * 1. Exact match after normalisation → ✓
 * 2. User's answer matches any "/" variant exactly → ✓
 * 3. Any "/" variant starts with the user's answer (≥3 chars) → ✓
 * 4. User's answer starts with any "/" variant (≥3 chars) → ✓
 */
export function matchAnswer(userAnswer: string, correctAnswer: string): boolean {
  const norm = (s: string) =>
    s.toLowerCase().trim().replace(/\s+/g, ' ')

  const user = norm(userAnswer)
  const correct = norm(correctAnswer)

  if (!user || user.length < 2) return false

  // 1. Exact match
  if (user === correct) return true

  // 2–4. Split correct by "/" and test each variant
  const variants = correct
    .split('/')
    .map((v) => norm(v))
    .filter((v) => v.length > 0)

  for (const variant of variants) {
    // exact match with this variant
    if (user === variant) return true
    // variant starts with user's answer (user typed a prefix)
    if (variant.startsWith(user) && user.length >= 3) return true
    // user's answer starts with this variant (user typed more than needed)
    if (user.startsWith(variant) && variant.length >= 3) return true
  }

  return false
}
