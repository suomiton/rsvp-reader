const ALPHA_NUM = /[\p{L}\p{N}]/u;

/**
 * Compute the ORP (Optimal Recognition Point) index for a token.
 *
 * The ORP is based on the "core" word length (letters/digits only,
 * excluding surrounding punctuation). The returned index is into
 * the full token string.
 *
 * Core length -> ORP offset:
 *   1:     0
 *   2-5:   1
 *   6-9:   2
 *   10-13: 3
 *   14+:   4
 */
export function computeOrpIndex(token: string): number {
  let coreStart = 0;
  let coreEnd = token.length - 1;

  while (coreStart < token.length && !ALPHA_NUM.test(token[coreStart] ?? "")) {
    coreStart++;
  }

  while (coreEnd > coreStart && !ALPHA_NUM.test(token[coreEnd] ?? "")) {
    coreEnd--;
  }

  const coreLength = coreEnd - coreStart + 1;

  if (coreLength <= 0) {
    return Math.floor(token.length / 2);
  }

  let orpOffset: number;
  if (coreLength === 1) {
    orpOffset = 0;
  } else if (coreLength <= 5) {
    orpOffset = 1;
  } else if (coreLength <= 9) {
    orpOffset = 2;
  } else if (coreLength <= 13) {
    orpOffset = 3;
  } else {
    orpOffset = 4;
  }

  return coreStart + orpOffset;
}
