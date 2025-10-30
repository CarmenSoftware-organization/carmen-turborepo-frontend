import { NANOID_LENGTH, NANOID_CHARACTERS } from "../constants";

/**
 * Generate a random nano ID
 * Creates a short, unique identifier using alphanumeric characters
 * @param length - Length of ID to generate (default: 5)
 * @returns Random ID string
 * @example
 * generateNanoId() // "aB3xY"
 * generateNanoId(10) // "aB3xYz8mN1"
 */
export const generateNanoId = (length: number = NANOID_LENGTH): string => {
  let result = "";

  for (let i = 0; i < length; i++) {
    result += NANOID_CHARACTERS[Math.floor(Math.random() * NANOID_CHARACTERS.length)];
  }

  return result;
};

/**
 * Generate a unique ID with prefix
 * @param prefix - Prefix for the ID
 * @param length - Length of random part (default: 5)
 * @returns ID with prefix
 * @example
 * generateIdWithPrefix("user") // "user-aB3xY"
 * generateIdWithPrefix("product", 8) // "product-aB3xYz8m"
 */
export const generateIdWithPrefix = (prefix: string, length: number = NANOID_LENGTH): string => {
  return `${prefix}-${generateNanoId(length)}`;
};

/**
 * Generate a timestamp-based ID
 * @returns ID based on current timestamp
 * @example
 * generateTimestampId() // "1704067200000-aB3xY"
 */
export const generateTimestampId = (): string => {
  const timestamp = Date.now();
  const randomPart = generateNanoId(5);
  return `${timestamp}-${randomPart}`;
};
