// Firebase Service - Integração com Firebase Realtime Database
import {
  ref,
  set,
  get,
  push,
  update,
  remove,
  onValue,
  DataSnapshot,
  Unsubscribe,
} from "firebase/database";
import { database } from "../config/firebase";

// =========================
// Types
// =========================
export interface Transaction {
  id: string;
  uid: string;
  amount: number;
  category: string;
  description: string;
  impactDays: number;
  isBet: boolean;
  emotionTag?: "necessary" | "conscious_pleasure" | "impulsive" | "investment";
  realityTrigger?: {
    mealsEquivalent: number;
    dreamDaysLost: number;
    message: string;
  };
  createdAt: Date;
}

export interface BetProtection {
  uid: string;
  enabled: boolean;
  totalBetMonth: number;
  lastBetAt?: Date;
}

export interface Challenge {
  id: string;
  uid: string;
  type: "no_ifood" | "no_bet" | "save_money" | "custom";
  progress: number;
  target: number;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface Badge {
  id: string;
  uid: string;
  type:
    | "no_bet_7days"
    | "first_contribution"
    | "no_impulse_7days"
    | "weekly_challenge";
  earnedAt: Date;
}

// =========================
// Helpers
// =========================
function mapListWithDates<T>(
  snapshot: DataSnapshot,
  dateFields: Array<keyof T & string>
): T[] {
  if (!snapshot.exists()) return [];

  const data = snapshot.val() as Record<string, any>;

  return Object.entries(data).map(([id, item]) => {
    const mapped: any = { id, ...item };

    for (const field of dateFields) {
      if (mapped[field]) mapped[field] = new Date(mapped[field]);
    }

    return mapped as T;
  });
}

function toISOIfDate(value: any) {
  return value instanceof Date ? value.toISOString() : value;
}

// =========================
// Service
// =========================
export const firebaseService = {
  // =========================
  // Transactions
  // =========================
  async getTransactions(uid: string): Promise<Transaction[]> {
    try {
      const transactionsRef = ref(database, `transactions/${uid}`);
      const snapshot = await get(transactionsRef);

      if (!snapshot.exists()) return [];

      const data = snapshot.val() as Record<string, any>;

      return Object.entries(data).map(([id, t]) => ({
        id,
        ...t,
        createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
      }));
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      return [];
    }
  },

  async addTransaction(
    transaction: Omit<Transaction, "id" | "createdAt">
  ): Promise<string> {
    try {
      const transactionsRef = ref(database, `transactions/${transaction.uid}`);
      const newRef = push(transactionsRef);

      await set(newRef, {
        ...transaction,
        createdAt: new Date().toISOString(),
      });

      return newRef.key ?? Date.now().toString();
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
      throw error;
    }
  },

  async updateTransaction(
    uid: string,
    id: string,
    updates: Partial<Omit<Transaction, "id" | "uid">>
  ): Promise<void> {
    try {
      const transactionRef = ref(database, `transactions/${uid}/${id}`);

      const updateData: any = { ...updates };
      if ("createdAt" in updateData) {
        updateData.createdAt = toISOIfDate(updateData.createdAt);
      }

      await update(transactionRef, updateData);
    } catch (error) {
      console.error("Erro ao atualizar transação:", error);
      throw error;
    }
  },

  async deleteTransaction(uid: string, id: string): Promise<void> {
    try {
      const transactionRef = ref(database, `transactions/${uid}/${id}`);
      await remove(transactionRef);
    } catch (error) {
      console.error("Erro ao deletar transação:", error);
      throw error;
    }
  },

  // Listener em tempo real (retorna função de unsubscribe correta)
  listenTransactions(
    uid: string,
    callback: (items: Transaction[]) => void
  ): Unsubscribe {
    const transactionsRef = ref(database, `transactions/${uid}`);

    const unsub = onValue(transactionsRef, (snapshot) => {
      if (!snapshot.exists()) return callback([]);

      const data = snapshot.val() as Record<string, any>;
      const items = Object.entries(data).map(([id, t]) => ({
        id,
        ...t,
        createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
      }));

      callback(items);
    });

    return unsub;
  },

  // =========================
  // Bet Protection
  // =========================
  async getBetProtection(uid: string): Promise<BetProtection | null> {
    try {
      const betRef = ref(database, `betProtection/${uid}`);
      const snapshot = await get(betRef);

      if (!snapshot.exists()) return null;

      const data = snapshot.val() as any;

      return {
        uid,
        ...data,
        lastBetAt: data.lastBetAt ? new Date(data.lastBetAt) : undefined,
      };
    } catch (error) {
      console.error("Erro ao buscar proteção de apostas:", error);
      return null;
    }
  },

  async updateBetProtection(
    uid: string,
    updates: Partial<BetProtection>
  ): Promise<void> {
    try {
      const betRef = ref(database, `betProtection/${uid}`);

      const updateData: any = { ...updates };
      if ("lastBetAt" in updateData) {
        updateData.lastBetAt = toISOIfDate(updateData.lastBetAt);
      }

      await update(betRef, updateData);
    } catch (error) {
      console.error("Erro ao atualizar proteção de apostas:", error);
      throw error;
    }
  },

  // =========================
  // Challenges
  // =========================
  async getChallenges(uid: string): Promise<Challenge[]> {
    try {
      const challengesRef = ref(database, `challenges/${uid}`);
      const snapshot = await get(challengesRef);

      return mapListWithDates<Challenge>(snapshot, ["createdAt", "completedAt"]);
    } catch (error) {
      console.error("Erro ao buscar desafios:", error);
      return [];
    }
  },

  async addChallenge(
    challenge: Omit<Challenge, "id" | "createdAt" | "completedAt">
  ): Promise<string> {
    try {
      const challengesRef = ref(database, `challenges/${challenge.uid}`);
      const newRef = push(challengesRef);

      await set(newRef, {
        ...challenge,
        createdAt: new Date().toISOString(),
        completedAt: null,
      });

      return newRef.key ?? Date.now().toString();
    } catch (error) {
      console.error("Erro ao adicionar desafio:", error);
      throw error;
    }
  },

  async updateChallenge(
    uid: string,
    id: string,
    updates: Partial<Omit<Challenge, "id" | "uid">>
  ): Promise<void> {
    try {
      const challengeRef = ref(database, `challenges/${uid}/${id}`);

      const updateData: any = { ...updates };

      if ("createdAt" in updateData) {
        updateData.createdAt = toISOIfDate(updateData.createdAt);
      }
      if ("completedAt" in updateData) {
        updateData.completedAt = toISOIfDate(updateData.completedAt);
      }

      // auto completa completedAt quando concluído
      if (updates.completed === true && !updates.completedAt) {
        updateData.completedAt = new Date().toISOString();
      }

      await update(challengeRef, updateData);
    } catch (error) {
      console.error("Erro ao atualizar desafio:", error);
      throw error;
    }
  },

  async deleteChallenge(uid: string, id: string): Promise<void> {
    try {
      const challengeRef = ref(database, `challenges/${uid}/${id}`);
      await remove(challengeRef);
    } catch (error) {
      console.error("Erro ao deletar desafio:", error);
      throw error;
    }
  },

  // =========================
  // Badges
  // =========================
  async getBadges(uid: string): Promise<Badge[]> {
    try {
      const badgesRef = ref(database, `badges/${uid}`);
      const snapshot = await get(badgesRef);

      if (!snapshot.exists()) return [];

      const data = snapshot.val() as Record<string, any>;

      return Object.entries(data).map(([id, b]) => ({
        id,
        ...b,
        earnedAt: b.earnedAt ? new Date(b.earnedAt) : new Date(),
      }));
    } catch (error) {
      console.error("Erro ao buscar badges:", error);
      return [];
    }
  },

  async addBadge(
    badge: Omit<Badge, "id" | "earnedAt">
  ): Promise<string> {
    try {
      const badgesRef = ref(database, `badges/${badge.uid}`);
      const newRef = push(badgesRef);

      await set(newRef, {
        ...badge,
        earnedAt: new Date().toISOString(),
      });

      return newRef.key ?? Date.now().toString();
    } catch (error) {
      console.error("Erro ao adicionar badge:", error);
      throw error;
    }
  },
};
