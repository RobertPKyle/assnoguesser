export function normalizeAnswer(s: string) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}+/gu, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}