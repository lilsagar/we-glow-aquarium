"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import {
  getAdminEmails,
  isFirebaseConfigured,
  normalizeAdminEmail,
} from "@/lib/firebase/config";
import { getFirebaseAuth } from "@/lib/firebase/client";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function checkIsAdmin(user: User | null): boolean {
  if (!user?.email) return false;

  const allowed = getAdminEmails();
  if (allowed.length === 0) return false;

  const candidate = normalizeAdminEmail(user.email);
  return allowed.includes(candidate);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, (next) => {
      setUser(next);
      setLoading(false);
    });
    return unsub;
  }, []);

  const isAdmin = useMemo(() => checkIsAdmin(user), [user]);

  const signIn = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
    if (!checkIsAdmin(cred.user)) {
      await firebaseSignOut(getFirebaseAuth());
      throw new Error("This account is not authorized for admin access.");
    }
  };

  const signOut = async () => {
    await firebaseSignOut(getFirebaseAuth());
  };

  const value = useMemo(
    () => ({ user, loading, isAdmin, signIn, signOut }),
    [user, loading, isAdmin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
