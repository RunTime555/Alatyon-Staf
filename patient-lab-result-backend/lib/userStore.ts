// lib/userStore.ts - Shared user storage
interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  created_at: string;
}

// Global user store (in production, use a database)
declare global {
  var usersStore: Map<string, User>;
}

global.usersStore = global.usersStore || new Map();

export const userStore = global.usersStore;

export function addUser(email: string, password: string, name: string, role: string = 'patient'): User {
  const user: User = {
    id: Date.now().toString(),
    email,
    password, // In production, hash this!
    name,
    role,
    created_at: new Date().toISOString()
  };
  userStore.set(email, user);
  return user;
}

export function findUserByEmail(email: string): User | undefined {
  return userStore.get(email);
}

export function validateUser(email: string, password: string): User | null {
  const user = userStore.get(email);
  if (user && user.password === password) {
    return user;
  }
  return null;
}