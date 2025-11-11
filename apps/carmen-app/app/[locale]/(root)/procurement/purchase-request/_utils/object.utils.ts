/** Check if value is null, undefined, or empty string */
export const shouldRemoveValue = (value: unknown): boolean => {
  return value === null || value === undefined || value === "";
};

/** Remove empty fields from object */
export const removeEmptyFields = <T extends Record<string, unknown>>(
  obj: T
): Partial<T> => {
  const entries = Object.entries(obj);
  const filteredEntries = entries.filter(
    ([, value]) => !shouldRemoveValue(value)
  );
  return Object.fromEntries(filteredEntries) as Partial<T>;
};

/** Convert specified fields to numbers */
export const convertFieldsToNumbers = <T extends Record<string, unknown>>(
  obj: T,
  fields: ReadonlyArray<keyof T>
): T => {
  const result = { ...obj };

  for (const field of fields) {
    const value = result[field];
    const hasValue = value !== null && value !== undefined;

    if (hasValue) {
      result[field] = Number(value) as T[typeof field];
    }
  }

  return result;
};
