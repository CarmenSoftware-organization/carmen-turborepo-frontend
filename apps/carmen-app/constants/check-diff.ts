const getAllKeys = (obj: unknown, prefix = ""): string[] => {
  const keys: string[] = [];

  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    const objectKeys = Object.keys(obj as Record<string, unknown>);
    for (const key of objectKeys) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      keys.push(fullKey);

      const value = (obj as Record<string, unknown>)[key];
      if (value && typeof value === "object") {
        keys.push(...getAllKeys(value, fullKey));
      }
    }
  } else if (Array.isArray(obj) && obj.length > 0) {
    // Check first element structure for arrays
    keys.push(...getAllKeys(obj[0], `${prefix}[0]`));
  }

  return keys;
};

export const checkDiff = (
  mockData: Record<string, unknown>,
  watchForm: Record<string, unknown>
) => {
  const mockDataKeys = getAllKeys(mockData);
  const watchFormKeys = getAllKeys(watchForm);

  // Key ที่มีใน mockData แต่ไม่มีใน watchForm (missing keys)
  const missingKeys = mockDataKeys.filter(
    (key) => !watchFormKeys.includes(key)
  );

  // Key ที่มีใน watchForm แต่ไม่มีใน mockData (extra keys)
  const extraKeys = watchFormKeys.filter((key) => !mockDataKeys.includes(key));

  return {
    missingKeys,
    extraKeys,
    summary: {
      totalMockDataKeys: mockDataKeys.length,
      totalWatchFormKeys: watchFormKeys.length,
      missingCount: missingKeys.length,
      extraCount: extraKeys.length,
    },
  };
};
