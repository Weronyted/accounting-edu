/** Estimate reading time in minutes given a word count or text */
export function readingTime(text: string | number): number {
  if (typeof text === 'number') return text
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}
