import type { DocMap, DocKey } from "@/lib/documents";
import { DOC_SPECS } from "@/lib/documents";

export type ReviewStatus = "pending" | "approved" | "rejected";

export type ReviewSubmission = {
  id: string;
  submittedAt: number;
  status: ReviewStatus;
  docs: DocMap;
  note?: string;
};

export const REVIEW_DURATION_MS = 24 * 60 * 60 * 1000;

export function createSubmission(docs: DocMap): ReviewSubmission {
  return {
    id: `RV-${Math.floor(100000 + Math.random() * 899999)}`,
    submittedAt: Date.now(),
    status: "pending",
    docs,
  };
}

export function remainingMs(sub: ReviewSubmission): number {
  const elapsed = Date.now() - sub.submittedAt;
  return Math.max(0, REVIEW_DURATION_MS - elapsed);
}

export function formatCountdown(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
  )}:${String(seconds).padStart(2, "0")}`;
}

export function reviewProgress(sub: ReviewSubmission): number {
  const elapsed = Date.now() - sub.submittedAt;
  return Math.min(100, Math.round((elapsed / REVIEW_DURATION_MS) * 100));
}

export function docLabel(key: DocKey): string {
  return DOC_SPECS.find((s) => s.key === key)?.title ?? key;
}

export function statusLabel(status: ReviewStatus): string {
  if (status === "approved") return "تم القبول";
  if (status === "rejected") return "مرفوض";
  return "قيد المراجعة";
}