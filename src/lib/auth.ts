// ─── Role definitions ────────────────────────────────────────────────────────

export type Role =
  | "ceo" // Super-admin – full access
  | "manager" // Operations / team management
  | "hr" // Human Resources
  | "developer" // Engineering team
  | "trainer"; // IT Training team

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

// ─── Permission matrix ────────────────────────────────────────────────────────

export type Permission =
  | "view:dashboard"
  | "view:users"
  | "manage:users"
  | "view:roles"
  | "manage:roles"
  | "view:projects"
  | "manage:projects"
  | "view:clients"
  | "manage:clients"
  | "view:careers"
  | "manage:careers"
  | "view:training"
  | "manage:training"
  | "view:hr"
  | "manage:hr"
  | "view:reports"
  | "view:settings"
  | "manage:settings"
  | "view:analytics"
  | "view:contacts"
  | "manage:contacts";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ceo: [
    "view:dashboard",
    "view:users",
    "manage:users",
    "view:roles",
    "manage:roles",
    "view:projects",
    "manage:projects",
    "view:clients",
    "manage:clients",
    "view:careers",
    "manage:careers",
    "view:training",
    "manage:training",
    "view:hr",
    "manage:hr",
    "view:reports",
    "view:settings",
    "manage:settings",
    "view:analytics",
    "view:contacts",
    "manage:contacts",
  ],
  manager: [
    "view:dashboard",
    "view:users",
    "view:projects",
    "manage:projects",
    "view:clients",
    "manage:clients",
    "view:reports",
    "view:analytics",
    "view:contacts",
    "manage:contacts",
    "view:careers",
    "view:hr",
  ],
  hr: [
    "view:dashboard",
    "view:users",
    "view:hr",
    "manage:hr",
    "view:careers",
    "manage:careers",
    "view:reports",
  ],
  developer: [
    "view:dashboard",
    "view:projects",
    "view:clients",
    "view:training",
  ],
  trainer: [
    "view:dashboard",
    "view:training",
    "manage:training",
    "view:careers",
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getRolePermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

// ─── Role display info ────────────────────────────────────────────────────────

export const ROLE_META: Record<
  Role,
  { label: string; color: string; badge: string }
> = {
  ceo: {
    label: "CEO / Super Admin",
    color: "text-purple-600",
    badge: "bg-purple-100 text-purple-700 border-purple-200",
  },
  manager: {
    label: "Manager",
    color: "text-blue-600",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
  },
  hr: {
    label: "HR",
    color: "text-green-600",
    badge: "bg-green-100 text-green-700 border-green-200",
  },
  developer: {
    label: "Developer",
    color: "text-orange-600",
    badge: "bg-orange-100 text-orange-700 border-orange-200",
  },
  trainer: {
    label: "Trainer",
    color: "text-teal-600",
    badge: "bg-teal-100 text-teal-700 border-teal-200",
  },
};

// ─── Mock users (replace with real auth later) ────────────────────────────────

export const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Aashis Rijal",
    email: "ceo@dzenotechnepal.com",
    role: "ceo",
  },
  {
    id: "2",
    name: "Suman Karki",
    email: "manager@dzenotechnepal.com",
    role: "manager",
  },
  {
    id: "3",
    name: "Priya Shrestha",
    email: "hr@dzenotechnepal.com",
    role: "hr",
  },
  {
    id: "4",
    name: "Bikash Thapa",
    email: "dev@dzenotechnepal.com",
    role: "developer",
  },
  {
    id: "5",
    name: "Anita Gurung",
    email: "trainer@dzenotechnepal.com",
    role: "trainer",
  },
];

// Demo passwords (all: "password123") – for mock login only
export const MOCK_CREDENTIALS: Record<string, string> = {
  "ceo@dzenotechnepal.com": "password123",
  "manager@dzenotechnepal.com": "password123",
  "hr@dzenotechnepal.com": "password123",
  "dev@dzenotechnepal.com": "password123",
  "trainer@dzenotechnepal.com": "password123",
};

// ─── Session helpers (localStorage) ──────────────────────────────────────────

const SESSION_KEY = "dtn_admin_user";

export function getSession(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function setSession(user: User): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function login(
  email: string,
  password: string,
): { success: true; user: User } | { success: false; error: string } {
  const expectedPassword = MOCK_CREDENTIALS[email];
  if (!expectedPassword || expectedPassword !== password) {
    return { success: false, error: "Invalid email or password." };
  }
  const user = MOCK_USERS.find((u) => u.email === email);
  if (!user) return { success: false, error: "User not found." };
  setSession(user);
  return { success: true, user };
}
