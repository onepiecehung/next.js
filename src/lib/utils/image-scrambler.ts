/**
 * Image Scrambler Utilities
 * Implements permutation generator that matches backend logic for unscrambling images
 */

/**
 * Converts base64url string to Uint8Array
 * Handles the base64url format used for permutation seeds
 */
export function base64UrlToUint8Array(input: string): Uint8Array {
  // Replace base64url characters with base64 characters
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/');

  // Add padding if needed
  const pad = base64.length % 4;
  if (pad === 2) base64 += '==';
  else if (pad === 3) base64 += '=';
  else if (pad !== 0) throw new Error('Invalid base64url string');

  // Decode base64 string to binary
  const binary = atob(base64);

  // Convert binary string to Uint8Array
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

/**
 * Creates a PRNG (Pseudo Random Number Generator) from seed bytes
 * Uses Mulberry32 algorithm matching the backend implementation
 */
export function createRngFromSeed(seedBytes: Uint8Array): () => number {
  // Ensure we have at least 4 bytes for the seed
  if (seedBytes.length < 4) {
    throw new Error('Seed must be at least 4 bytes');
  }

  // Initialize state with first 4 bytes as 32-bit integer
  // Apply the same transformation as backend (XOR with magic number)
  let x =
    ((seedBytes[0] << 24) |
      (seedBytes[1] << 16) |
      (seedBytes[2] << 8) |
      seedBytes[3]) ^
    0x6d2b79f5;

  // Return the PRNG function
  return function () {
    x |= 0; // Ensure x is treated as 32-bit integer
    x = (x + 0x6d2b79f5) | 0; // Add magic number and truncate to 32 bits
    let t = Math.imul(x ^ (x >>> 15), 1 | x); // Apply mixing function
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; // More mixing
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296; // Return normalized float [0,1)
  };
}

/**
 * Generates permutation and inverse permutation for unscrambling images
 * Matches the backend Fisher-Yates shuffle algorithm exactly
 */
export function generatePermutation(
  permutationSeed: string,
  tileRows: number,
  tileCols: number,
): { permutation: number[]; inversePermutation: number[] } {
  const numTiles = tileRows * tileCols;

  // Convert base64url seed to bytes and create RNG
  const seedBytes = base64UrlToUint8Array(permutationSeed);
  const rng = createRngFromSeed(seedBytes);

  // Initialize permutation array [0, 1, 2, ..., numTiles-1]
  const permutation = Array.from({ length: numTiles }, (_, i) => i);

  // Fisher-Yates shuffle (same as backend)
  for (let i = numTiles - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    // Swap elements at positions i and j
    [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
  }

  // Create inverse permutation mapping
  // inversePermutation[scrambledIndex] = originalIndex
  const inversePermutation = new Array<number>(numTiles);
  for (let originalIndex = 0; originalIndex < numTiles; originalIndex++) {
    const scrambledIndex = permutation[originalIndex];
    inversePermutation[scrambledIndex] = originalIndex;
  }

  return { permutation, inversePermutation };
}
