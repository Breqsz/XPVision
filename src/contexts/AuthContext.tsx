// contexts/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, database } from "../config/firebase";

interface User {
  uid: string;
  name: string;
  email?: string;
}

interface AuthContextValue {
  user: User | null;
  signIn: (userData: User) => void; // opcional (pra set manual)
  signOut: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  signIn: () => {},
  signOut: async () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  console.log('🔐 AuthProvider inicializado, loading:', loading);

  const buildUserFromFirebase = useCallback(
    async (firebaseUser: FirebaseUser): Promise<User> => {
      try {
        const userRef = ref(database, `users/${firebaseUser.uid}`);
        const snapshot = await get(userRef);
        const userData = snapshot.exists() ? snapshot.val() : null;

        return {
          uid: firebaseUser.uid,
          name:
            userData?.name ||
            firebaseUser.displayName ||
            firebaseUser.email?.split("@")[0] ||
            "Usuário",
          email: firebaseUser.email || "",
        };
      } catch (e) {
        return {
          uid: firebaseUser.uid,
          name:
            firebaseUser.displayName ||
            firebaseUser.email?.split("@")[0] ||
            "Usuário",
          email: firebaseUser.email || "",
        };
      }
    },
    []
  );

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    let hasSetLoading = false;

    const unsubscribe = onAuthStateChanged(
      auth, 
      async (firebaseUser) => {
        try {
          if (!isMounted || hasSetLoading) return;

          if (firebaseUser) {
            const u = await buildUserFromFirebase(firebaseUser);
            if (isMounted && !hasSetLoading) {
              setUser(u);
              setLoading(false);
              hasSetLoading = true;
            }
          } else {
            if (isMounted && !hasSetLoading) {
              setUser(null);
              setLoading(false);
              hasSetLoading = true;
            }
          }
        } catch (error) {
          console.error('❌ Erro ao carregar usuário:', error);
          if (isMounted && !hasSetLoading) {
            setUser(null);
            setLoading(false);
            hasSetLoading = true;
          }
        }
      },
      (error) => {
        // Callback de erro do onAuthStateChanged
        console.error('❌ Erro no onAuthStateChanged:', error);
        if (isMounted && !hasSetLoading) {
          setUser(null);
          setLoading(false);
          hasSetLoading = true;
        }
      }
    );

    // Timeout de segurança: se após 3 segundos ainda estiver carregando, forçar false
    timeoutId = setTimeout(() => {
      if (isMounted && !hasSetLoading) {
        console.log('Timeout: finalizando loading');
        setLoading(false);
        hasSetLoading = true;
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [buildUserFromFirebase]);

  // Se você usar signIn manualmente em algum fluxo, mantém.
  const signIn = (userData: User) => {
    setUser(userData);
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
