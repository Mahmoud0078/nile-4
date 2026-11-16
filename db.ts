export type PersonRole = "client" | "captain";

export type PersonRecord = {
  id: string;
  role: PersonRole;
  name: string;
  nationalId: string;
  photo: string | null;
  phone: string;
  carrier?: string;
  rating?: number;
  trips?: number;
  createdAt: number;
  updatedAt: number;
};

export type PersonDraft = {
  role: PersonRole;
  name: string;
  nationalId: string;
  photo: string | null;
  phone: string;
  carrier?: string;
  rating?: number;
  trips?: number;
};

const STORAGE_KEY = "nilego.people.v1";

function uid(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function loadPeople(): PersonRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PersonRecord[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function savePeople(people: PersonRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
  } catch {
    /* storage unavailable — keep in-memory state */
  }
}

export function createPerson(draft: PersonDraft): PersonRecord {
  const now = Date.now();
  return {
    ...draft,
    id: uid(draft.role),
    createdAt: now,
    updatedAt: now,
  };
}

export function updatePerson(
  people: PersonRecord[],
  id: string,
  patch: Partial<PersonDraft>
): PersonRecord[] {
  return people.map((p) =>
    p.id === id ? { ...p, ...patch, updatedAt: Date.now() } : p
  );
}

export function removePerson(people: PersonRecord[], id: string): PersonRecord[] {
  return people.filter((p) => p.id !== id);
}

export function upsertByNationalId(
  people: PersonRecord[],
  draft: PersonDraft
): PersonRecord[] {
  const digits = draft.nationalId.replace(/\D/g, "");
  const existing = people.find(
    (p) => p.role === draft.role && p.nationalId.replace(/\D/g, "") === digits
  );
  if (existing) return updatePerson(people, existing.id, draft);
  return [createPerson(draft), ...people];
}

export function searchPeople(
  people: PersonRecord[],
  query: string,
  role: PersonRole | "all"
): PersonRecord[] {
  const q = query.trim().toLowerCase();
  const digits = q.replace(/\D/g, "");
  return people.filter((p) => {
    if (role !== "all" && p.role !== role) return false;
    if (!q) return true;
    const nameMatch = p.name.toLowerCase().includes(q);
    const idMatch = digits.length > 0 && p.nationalId.includes(digits);
    const phoneMatch = digits.length > 0 && p.phone.replace(/\D/g, "").includes(digits);
    return nameMatch || idMatch || phoneMatch;
  });
}

export function seedPeople(): PersonRecord[] {
  const now = Date.now();
  return [
    {
      id: "client-seed-1",
      role: "client",
      name: "Mona Adel",
      nationalId: "29805123456789",
      photo: null,
      phone: "+20 100 442 8891",
      carrier: "Vodafone",
      rating: 4.9,
      trips: 128,
      createdAt: now - 1000 * 60 * 60 * 24 * 30,
      updatedAt: now - 1000 * 60 * 60 * 24 * 2,
    },
    {
      id: "client-seed-2",
      role: "client",
      name: "Youssef Kamal",
      nationalId: "30111223344556",
      photo: null,
      phone: "+20 122 778 3344",
      carrier: "Orange",
      rating: 4.7,
      trips: 54,
      createdAt: now - 1000 * 60 * 60 * 24 * 12,
      updatedAt: now - 1000 * 60 * 60 * 24 * 1,
    },
    {
      id: "captain-seed-1",
      role: "captain",
      name: "Karim Hassan",
      nationalId: "29007889900112",
      photo: null,
      phone: "+20 111 220 5566",
      carrier: "Etisalat",
      rating: 4.8,
      trips: 902,
      createdAt: now - 1000 * 60 * 60 * 24 * 90,
      updatedAt: now - 1000 * 60 * 60 * 24 * 3,
    },
    {
      id: "captain-seed-2",
      role: "captain",
      name: "Tarek Samir",
      nationalId: "29503445566778",
      photo: null,
      phone: "+20 155 909 1122",
      carrier: "WE",
      rating: 4.6,
      trips: 431,
      createdAt: now - 1000 * 60 * 60 * 24 * 45,
      updatedAt: now - 1000 * 60 * 60 * 24 * 5,
    },
  ];
}