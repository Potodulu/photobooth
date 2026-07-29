const DB_NAME = "photobooth-demo";
const DB_VERSION = 1;

const STORES = {
  blobs: "blobs",
  captures: "captures",
  captureSets: "captureSets",
  results: "results",
} as const;

type StoreName = (typeof STORES)[keyof typeof STORES];

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB unavailable"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORES.blobs)) {
        db.createObjectStore(STORES.blobs);
      }
      if (!db.objectStoreNames.contains(STORES.captures)) {
        db.createObjectStore(STORES.captures, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORES.captureSets)) {
        db.createObjectStore(STORES.captureSets, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORES.results)) {
        db.createObjectStore(STORES.results, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("IDB open failed"));
  });
}

function runTransaction<T>(
  storeName: StoreName,
  mode: IDBTransactionMode,
  operate: (store: IDBObjectStore) => IDBRequest<T> | void,
): Promise<T | undefined> {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, mode);
        const store = tx.objectStore(storeName);
        const request = operate(store);

        tx.oncomplete = () => {
          resolve(request ? request.result : undefined);
          db.close();
        };
        tx.onerror = () => {
          reject(tx.error ?? new Error("IDB transaction failed"));
          db.close();
        };
      }),
  );
}

export async function idbPut<T>(
  storeName: StoreName,
  value: T,
  key?: string,
): Promise<void> {
  await runTransaction(storeName, "readwrite", (store) => {
    if (key !== undefined) {
      return store.put(value, key);
    }
    return store.put(value);
  });
}

export async function idbGet<T>(
  storeName: StoreName,
  key: string,
): Promise<T | undefined> {
  return runTransaction<T>(storeName, "readonly", (store) => store.get(key));
}

export async function idbDelete(
  storeName: StoreName,
  key: string,
): Promise<void> {
  await runTransaction(storeName, "readwrite", (store) => store.delete(key));
}

export async function idbGetAll<T>(storeName: StoreName): Promise<T[]> {
  const result = await runTransaction<T[]>(storeName, "readonly", (store) =>
    store.getAll(),
  );
  return result ?? [];
}

export { STORES };

const META_PREFIX = "photobooth-demo:";

export function localStorageSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(`${META_PREFIX}${key}`, JSON.stringify(value));
  } catch {
    // ponytail: quota / private mode — meta is best-effort only
  }
}

export function localStorageGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`${META_PREFIX}${key}`);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

let idbAvailable: boolean | null = null;

export async function isIndexedDbAvailable(): Promise<boolean> {
  if (idbAvailable !== null) return idbAvailable;
  try {
    await openDb();
    idbAvailable = true;
  } catch {
    idbAvailable = false;
  }
  return idbAvailable;
}
