const resolveDate = (value?: string | Date | null) => {
  if (!value) {
    return null;
  }

  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const formatDisplayValue = (
  value: unknown,
  fallback = "-",
): string => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return String(value);
};

export const formatShortDate = (value?: string | Date | null): string => {
  const parsed = resolveDate(value);
  if (!parsed) {
    return value ? String(value) : "";
  }

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

export const formatIsoDate = (value?: string | Date | null): string => {
  const parsed = resolveDate(value);
  if (!parsed) {
    return value ? String(value) : "";
  }

  return parsed.toISOString().slice(0, 10);
};

export const formatIsoDateTime = (value?: string | Date | null): string => {
  const parsed = resolveDate(value);
  if (!parsed) {
    return value ? String(value) : "";
  }

  const datePart = parsed.toISOString().slice(0, 10);
  const timePart = parsed.toTimeString().slice(0, 8);
  return `${datePart} ${timePart}`;
};

export const formatCurrency = (
  value?: number | null,
  fallback = "---",
): string => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }

  return `$${value.toFixed(1)}`;
};

export const formatUppercase = (
  value?: string | null,
  fallback = "",
): string => {
  if (!value) {
    return fallback;
  }

  return value.toUpperCase();
};
