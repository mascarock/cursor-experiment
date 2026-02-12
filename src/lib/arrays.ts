/**
 * Parse a JSON-serialized string array stored in SQLite.
 * Returns an empty array on null or invalid JSON.
 */
export function parseJsonArray(value: string | null): string[] {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

/**
 * Serialize a string array to JSON for storage in SQLite.
 */
export function toJsonArray(arr: string[]): string {
  return JSON.stringify(arr);
}
