import type { SignupDraft, UserRole } from "@/lib/auth";

export type Account = {
  id: string;
  fullName: string;
  phone: string;
  role: UserRole;
  /** Demo-only credential store. Never do this in production. */
  password: string;
  avatarSeed: string;
};

export const DEMO_PASSWORD = "123456";

export const DEMO_ACCOUNTS: Account[] = [
  {
    id: "acc-client-1",
    fullName: "منى عبد الرحمن",
    phone: "01012345678",
    role: "client",
    password: DEMO_PASSWORD,
    avatarSeed: "mona",
  },
  {
    id: "acc-captain-1",
    fullName: "خالد سيد",
    phone: "01198765432",
    role: "captain",
    password: DEMO_PASSWORD,
    avatarSeed: "khaled",
  },
];

export function findAccount(phone: string): Account | undefined {
  const digits = phone.replace(/[^\d]/g, "");
  return DEMO_ACCOUNTS.find((a) => a.phone === digits);
}

export function accountFromDraft(draft: SignupDraft): Account {
  return {
    id: `acc-${draft.phone}`,
    fullName: draft.fullName.trim(),
    phone: draft.phone,
    role: draft.role,
    password: DEMO_PASSWORD,
    avatarSeed: draft.phone,
  };
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "؟";
  if (parts.length === 1) return parts[0].slice(0, 2);
  return `${parts[0][0]}${parts[1][0]}`;
}

export function roleLabel(role: UserRole): string {
  return role === "captain" ? "كابتن" : "عميل";
}