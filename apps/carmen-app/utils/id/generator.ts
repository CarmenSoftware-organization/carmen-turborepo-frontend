import { NANOID_LENGTH, NANOID_CHARACTERS } from "../constants";

export const generateNanoId = (length: number = NANOID_LENGTH): string => {
  let result = "";

  for (let i = 0; i < length; i++) {
    result += NANOID_CHARACTERS[Math.floor(Math.random() * NANOID_CHARACTERS.length)];
  }

  return result;
};

export const generateIdWithPrefix = (prefix: string, length: number = NANOID_LENGTH): string => {
  return `${prefix}-${generateNanoId(length)}`;
};

export const generateTimestampId = (): string => {
  const timestamp = Date.now();
  const randomPart = generateNanoId(5);
  return `${timestamp}-${randomPart}`;
};
