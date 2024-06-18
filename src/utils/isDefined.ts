type NullOrUndefined = null | undefined;

/**
 * Checks whether a value is defined. If it is defined, the return type ensures type safety.
 * @param value any value or null or undefined
 * @returns true if `value` is defined (not null and not undefined), false otherwise.
 */
export function isDefined<T>(value: T | NullOrUndefined): value is T {
  return value !== null && value !== undefined;
}
