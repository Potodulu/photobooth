import {
  STORES,
  idbGetAll,
  idbDelete,
  isIndexedDbAvailable,
  localStorageGet,
} from "./storage";
import type { Capture, GeneratedResult } from "@/features/photobooth/domain";
import { STORAGE_TTL_MS } from "@/features/photobooth/domain";

const META_PREFIX = "photobooth-demo:";

export async function idbClearStore(storeName: string): Promise<void> {
  if (!(await isIndexedDbAvailable())) return;
  const dbName = "photobooth-demo";
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.open(dbName);
    request.onsuccess = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.close();
        resolve();
        return;
      }
      const tx = db.transaction(storeName, "readwrite");
      tx.objectStore(storeName).clear();
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    };
    request.onerror = () => reject(request.error);
  });
}

export function clearLocalStoragePrefix(): void {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key?.startsWith(META_PREFIX)) keys.push(key);
    }
    keys.forEach((key) => localStorage.removeItem(key));
  } catch {
    // ignore
  }
}

export async function purgeAllDemoStorage(): Promise<void> {
  clearLocalStoragePrefix();
  if (!(await isIndexedDbAvailable())) return;
  await Promise.all([
    idbClearStore(STORES.blobs),
    idbClearStore(STORES.captures),
    idbClearStore(STORES.captureSets),
    idbClearStore(STORES.results),
  ]);
}

export async function purgeExpired(
  ttlMs: number = STORAGE_TTL_MS,
): Promise<void> {
  const cutoff = Date.now() - ttlMs;

  if (await isIndexedDbAvailable()) {
    const captures = await idbGetAll<Capture>(STORES.captures);
    for (const capture of captures) {
      if (new Date(capture.createdAt).getTime() < cutoff) {
        await idbDelete(STORES.captures, capture.id);
        await idbDelete(STORES.blobs, capture.blobKey);
        if (capture.videoBlobKey) {
          await idbDelete(STORES.blobs, capture.videoBlobKey);
        }
      }
    }

    const results = await idbGetAll<GeneratedResult>(STORES.results);
    for (const result of results) {
      if (new Date(result.createdAt).getTime() < cutoff) {
        await idbDelete(STORES.results, result.id);
        for (const key of result.outputKeys) {
          await idbDelete(STORES.blobs, key);
        }
      }
    }
  }

  // localStorage meta: wipe expired capture entries when possible
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key?.startsWith(`${META_PREFIX}capture:`)) keys.push(key);
    }
    for (const key of keys) {
      const id = key.slice(`${META_PREFIX}capture:`.length);
      const capture = localStorageGet<Capture>(`capture:${id}`);
      if (capture && new Date(capture.createdAt).getTime() < cutoff) {
        localStorage.removeItem(key);
        localStorage.removeItem(`${META_PREFIX}blob:${capture.blobKey}`);
        if (capture.videoBlobKey) {
          localStorage.removeItem(`${META_PREFIX}blob:${capture.videoBlobKey}`);
        }
      }
    }
  } catch {
    // ignore
  }
}
