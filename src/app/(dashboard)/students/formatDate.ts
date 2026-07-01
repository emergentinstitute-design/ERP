import type { Transaction } from "./types";

export function formatIndianDate(rawDate: string) {
  return new Date(rawDate).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatTransactionDate(tx: Transaction) {
  const rawTimestamp =
    tx.created_at || (tx as any).createdAt || (tx as any).payment_date;

  if (!rawTimestamp) return "—";

  const sanitizedDateStr =
    typeof rawTimestamp === "string" &&
    rawTimestamp.includes(" ") &&
    !rawTimestamp.includes("T")
      ? rawTimestamp.replace(" ", "T")
      : rawTimestamp;

  const dateInstance = new Date(sanitizedDateStr);

  if (isNaN(dateInstance.getTime())) return "Format Error";

  return dateInstance.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}