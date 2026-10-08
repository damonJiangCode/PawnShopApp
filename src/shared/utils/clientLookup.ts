export type ClientLookup = { kind: "id" | "phone"; value: string };

export const normalizeClientLookup = ({
  kind,
  value,
}: ClientLookup): ClientLookup => {
  if ((kind !== "id" && kind !== "phone") || typeof value !== "string") {
    throw new Error("Invalid client search.");
  }
  return {
    kind,
    value:
      kind === "id"
        ? value.replace(/[^A-Za-z0-9]/g, "").toUpperCase()
        : value.replace(/[^0-9]/g, ""),
  };
};
