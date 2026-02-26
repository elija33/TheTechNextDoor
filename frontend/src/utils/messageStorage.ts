export interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  contactMethod: "email" | "call";
  message: string;
  images: string[];
  timestamp: number;
  unread: boolean;
}

const DB_NAME = "TheTechNextDoorDB";
const STORE_NAME = "contactMessages";
const DB_VERSION = 8;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("carouselImages")) {
        db.createObjectStore("carouselImages", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("quoteRequests")) {
        db.createObjectStore("quoteRequests", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("quoteOptions")) {
        db.createObjectStore("quoteOptions", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("services")) {
        db.createObjectStore("services", { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const messages = request.result as ContactMessage[];
      messages.sort((a, b) => b.timestamp - a.timestamp);
      resolve(messages);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function saveContactMessage(message: ContactMessage): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(message);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function markMessageAsRead(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const message = getRequest.result as ContactMessage | undefined;
      if (message) {
        message.unread = false;
        store.put(message);
      }
    };

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteContactMessage(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
