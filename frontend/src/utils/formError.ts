const FIELD_ERROR_PREFIX = "[field-error]";

export type BackendFieldError = {
  field: string;
  message: string;
};

type FieldMessageResolver = {
  fallback: string;
  rules: Array<{
    pattern: RegExp;
    message: string;
  }>;
};

const FIELD_MESSAGE_RESOLVERS: Record<string, FieldMessageResolver> = {
  employee_password: {
    fallback: "No employee was found for that password.",
    rules: [
      {
        pattern: /required/i,
        message: "Enter employee password.",
      },
      {
        pattern: /incorrect|not found|no employee/i,
        message: "No employee was found for that password.",
      },
    ],
  },
};

export const extractBackendFieldError = (
  message: string,
): BackendFieldError | null => {
  const prefixIndex = message.lastIndexOf(FIELD_ERROR_PREFIX);

  if (prefixIndex === -1) {
    return null;
  }

  const payload = message.slice(prefixIndex + FIELD_ERROR_PREFIX.length);
  const separatorIndex = payload.indexOf(":");

  if (separatorIndex === -1) {
    return null;
  }

  const field = payload.slice(0, separatorIndex).trim();
  const fieldMessage = payload.slice(separatorIndex + 1).trim();

  if (!field) {
    return null;
  }

  return {
    field,
    message: fieldMessage || message.trim(),
  };
};

export const resolveFormFieldMessage = (
  field: string,
  message: string,
): string => {
  const resolver = FIELD_MESSAGE_RESOLVERS[field];

  if (!resolver) {
    return message.trim();
  }

  for (const rule of resolver.rules) {
    if (rule.pattern.test(message)) {
      return rule.message;
    }
  }

  return message.trim() || resolver.fallback;
};

export const resolveFormFieldError = (
  field: string,
  error: unknown,
): string | null => {
  if (!(error instanceof Error)) {
    return null;
  }

  const backendFieldError = extractBackendFieldError(error.message);

  if (backendFieldError?.field === field) {
    return resolveFormFieldMessage(field, backendFieldError.message);
  }

  if (backendFieldError) {
    return null;
  }

  const normalizedField = field.replace(/_/g, "\\s*");
  const fieldPattern = new RegExp(normalizedField, "i");

  if (!fieldPattern.test(error.message)) {
    return null;
  }

  return resolveFormFieldMessage(field, error.message);
};
