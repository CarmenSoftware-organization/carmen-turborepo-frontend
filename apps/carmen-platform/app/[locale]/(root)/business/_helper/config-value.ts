interface LocaleConfig {
  locales: string;
  minimumIntegerDigits: number;
}

export type ConfigValue = string | number | boolean | LocaleConfig | Record<string, unknown>;

export const renderConfigValue = (value: ConfigValue): string => {
  if (
    typeof value === "object" &&
    value !== null &&
    "locales" in value &&
    "minimumIntegerDigits" in value
  ) {
    const localeConfig = value as LocaleConfig;
    return `${localeConfig.locales} (${localeConfig.minimumIntegerDigits} digits)`;
  }

  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
};
