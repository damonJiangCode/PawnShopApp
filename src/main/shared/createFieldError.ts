const FIELD_ERROR_PREFIX = "[field-error]";

export const createFieldError = (field: string, message: string) => {
  return new Error(`${FIELD_ERROR_PREFIX}${field}:${message}`);
};
