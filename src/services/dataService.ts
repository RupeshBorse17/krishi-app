/**
 * Centralized data persistence layer.
 * All storage logic lives here - components must never access storage directly.
 * Handles localStorage with error handling, validation, and read-after-write verification.
 */

import type { Plot, Reminder, Expense } from "@/types";

const STORAGE_KEYS = {
  plots: "farmmate_plots_v1",
  reminders: "farmmate_reminders_v1",
  expenses: "farmmate_expenses_v1",
} as const;

const LEGACY_KEYS = {
  plots: "farmmate_plots",
  reminders: "farmmate_reminders",
  expenses: "farmmate_expenses",
} as const;

const DEBUG = import.meta.env.DEV;

function log(msg: string, data?: unknown) {
  if (DEBUG && typeof console !== "undefined" && console.log) {
    console.log(`[Farmmate] ${msg}`, data ?? "");
  }
}

function logError(msg: string, err?: unknown) {
  if (typeof console !== "undefined" && console.error) {
    console.error(`[Farmmate] ${msg}`, err ?? "");
  }
}

function ensureStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    const storage = localStorage;
    storage.setItem("_test", "1");
    storage.removeItem("_test");
    return storage;
  } catch (e) {
    logError("localStorage not available", e);
    return null;
  }
}

function safeParse<T>(raw: string | null, fallback: T, key: string): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as T;
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (e) {
    logError(`Parse failed for ${key}`, e);
    return fallback;
  }
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch (e) {
    logError("Stringify failed", e);
    return "[]";
  }
}

function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/** Write to storage with verification. Throws on failure. */
function write<T>(key: string, value: T): void {
  const storage = ensureStorage();
  if (!storage) {
    throw new Error("Storage not available. Check if the app is in private mode.");
  }
  const str = safeStringify(value);
  try {
    storage.setItem(key, str);
    const readBack = storage.getItem(key);
    if (readBack !== str) {
      throw new Error("Write verification failed - data may not have been saved.");
    }
    log(`Verified write: ${key}`);
  } catch (e) {
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      throw new Error("Storage full. Please free up space.");
    }
    throw e;
  }
}

/** Read from storage. Never throws - returns fallback on error. */
function read<T>(key: string, fallback: T): T {
  const storage = ensureStorage();
  if (!storage) return fallback;
  try {
    let raw = storage.getItem(key);
    if (!raw && key === STORAGE_KEYS.plots) raw = storage.getItem(LEGACY_KEYS.plots);
    if (!raw && key === STORAGE_KEYS.reminders) raw = storage.getItem(LEGACY_KEYS.reminders);
    if (!raw && key === STORAGE_KEYS.expenses) raw = storage.getItem(LEGACY_KEYS.expenses);
    return safeParse<T>(raw, fallback, key);
  } catch (e) {
    logError(`Read failed for ${key}`, e);
    return fallback;
  }
}

/** Migrate from legacy keys to v1 and persist. */
function migrateIfNeeded(key: string, legacyKey: string): void {
  const storage = ensureStorage();
  if (!storage) return;
  const current = storage.getItem(key);
  if (current) return;
  const legacy = storage.getItem(legacyKey);
  if (legacy) {
    try {
      storage.setItem(key, legacy);
      log(`Migrated ${legacyKey} -> ${key}`);
    } catch (e) {
      logError("Migration failed", e);
    }
  }
}

// --- Validation ---

function isValidPlot(p: unknown): p is Plot {
  return (
    typeof p === "object" &&
    p !== null &&
    typeof (p as Plot).id === "string" &&
    typeof (p as Plot).name === "string" &&
    typeof (p as Plot).cropKey === "string" &&
    typeof (p as Plot).acres === "number" &&
    typeof (p as Plot).stage === "number"
  );
}

function isValidReminder(r: unknown): r is Reminder {
  return (
    typeof r === "object" &&
    r !== null &&
    typeof (r as Reminder).id === "string" &&
    typeof (r as Reminder).label === "string" &&
    typeof (r as Reminder).done === "boolean"
  );
}

function isValidExpense(e: unknown): e is Expense {
  return (
    typeof e === "object" &&
    e !== null &&
    typeof (e as Expense).id === "string" &&
    typeof (e as Expense).amount === "number"
  );
}

function filterValid<T>(arr: unknown[], validator: (x: unknown) => x is T): T[] {
  return arr.filter(validator);
}

// --- Plot API ---

export const plotService = {
  getAll(): Promise<Plot[]> {
    return Promise.resolve().then(() => {
      migrateIfNeeded(STORAGE_KEYS.plots, LEGACY_KEYS.plots);
      const raw = read<unknown[]>(STORAGE_KEYS.plots, []);
      const items = filterValid(raw, isValidPlot);
      log("Plots fetched", items.length);
      return items;
    });
  },

  create(plot: Omit<Plot, "id" | "createdAt" | "updatedAt">): Promise<Plot> {
    if (plot.acres < 0 || plot.stage < 0 || plot.stage > 100) {
      return Promise.reject(new Error("Invalid plot: acres must be >= 0, stage 0-100"));
    }
    return this.getAll().then((all) => {
      const now = new Date().toISOString();
      const newPlot: Plot = {
        ...plot,
        id: genId(),
        createdAt: now,
        updatedAt: now,
      };
      all.push(newPlot);
      write(STORAGE_KEYS.plots, all);
      log("Plot created", newPlot.id);
      return newPlot;
    });
  },

  update(id: string, updates: Partial<Omit<Plot, "id" | "createdAt">>): Promise<Plot | null> {
    return this.getAll().then((all) => {
      const idx = all.findIndex((p) => p.id === id);
      if (idx === -1) return null;
      const updated: Plot = {
        ...all[idx],
        ...updates,
        id,
        updatedAt: new Date().toISOString(),
      };
      all[idx] = updated;
      write(STORAGE_KEYS.plots, all);
      log("Plot updated", id);
      return updated;
    });
  },

  delete(id: string): Promise<boolean> {
    return this.getAll().then((all) => {
      const filtered = all.filter((p) => p.id !== id);
      if (filtered.length === all.length) return false;
      write(STORAGE_KEYS.plots, filtered);
      log("Plot deleted", id);
      return true;
    });
  },
};

// --- Reminder API ---

export const reminderService = {
  getAll(): Promise<Reminder[]> {
    return Promise.resolve().then(() => {
      migrateIfNeeded(STORAGE_KEYS.reminders, LEGACY_KEYS.reminders);
      const raw = read<unknown[]>(STORAGE_KEYS.reminders, []);
      const items = filterValid(raw, isValidReminder);
      log("Reminders fetched", items.length);
      return items;
    });
  },

  create(reminder: Omit<Reminder, "id" | "createdAt">): Promise<Reminder> {
    return this.getAll().then((all) => {
      const newReminder: Reminder = {
        ...reminder,
        id: genId(),
        createdAt: new Date().toISOString(),
      };
      all.push(newReminder);
      write(STORAGE_KEYS.reminders, all);
      log("Reminder created", newReminder.id);
      return newReminder;
    });
  },

  update(id: string, updates: Partial<Omit<Reminder, "id" | "createdAt">>): Promise<Reminder | null> {
    return this.getAll().then((all) => {
      const idx = all.findIndex((r) => r.id === id);
      if (idx === -1) return null;
      const updated: Reminder = { ...all[idx], ...updates, id, createdAt: all[idx].createdAt };
      all[idx] = updated;
      write(STORAGE_KEYS.reminders, all);
      log("Reminder updated", id);
      return updated;
    });
  },

  delete(id: string): Promise<boolean> {
    return this.getAll().then((all) => {
      const filtered = all.filter((r) => r.id !== id);
      if (filtered.length === all.length) return false;
      write(STORAGE_KEYS.reminders, filtered);
      log("Reminder deleted", id);
      return true;
    });
  },

  toggleDone(id: string): Promise<Reminder | null> {
    return this.getAll().then((all) => {
      const r = all.find((x) => x.id === id);
      if (!r) return null;
      return reminderService.update(id, { done: !r.done });
    });
  },
};

// --- Expense API ---

export const expenseService = {
  getAll(): Promise<Expense[]> {
    return Promise.resolve().then(() => {
      migrateIfNeeded(STORAGE_KEYS.expenses, LEGACY_KEYS.expenses);
      const raw = read<unknown[]>(STORAGE_KEYS.expenses, []);
      const items = filterValid(raw, isValidExpense);
      log("Expenses fetched", items.length);
      return items;
    });
  },

  create(expense: Omit<Expense, "id" | "createdAt">): Promise<Expense> {
    if (expense.amount <= 0) {
      return Promise.reject(new Error("Amount must be greater than 0"));
    }
    return this.getAll().then((all) => {
      const newExpense: Expense = {
        ...expense,
        id: genId(),
        createdAt: new Date().toISOString(),
      };
      all.push(newExpense);
      write(STORAGE_KEYS.expenses, all);
      log("Expense created", newExpense.id);
      return newExpense;
    });
  },

  update(id: string, updates: Partial<Omit<Expense, "id" | "createdAt">>): Promise<Expense | null> {
    return this.getAll().then((all) => {
      const idx = all.findIndex((e) => e.id === id);
      if (idx === -1) return null;
      const updated: Expense = { ...all[idx], ...updates, id, createdAt: all[idx].createdAt };
      all[idx] = updated;
      write(STORAGE_KEYS.expenses, all);
      log("Expense updated", id);
      return updated;
    });
  },

  delete(id: string): Promise<boolean> {
    return this.getAll().then((all) => {
      const filtered = all.filter((e) => e.id !== id);
      if (filtered.length === all.length) return false;
      write(STORAGE_KEYS.expenses, filtered);
      log("Expense deleted", id);
      return true;
    });
  },
};
