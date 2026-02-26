export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
}

const DB_NAME = "TheTechNextDoorDB";
const STORE_NAME = "services";
const DB_VERSION = 8;

const DEFAULT_SERVICES: Service[] = [
  {
    id: "1",
    name: "Screen Repair",
    description: "Fix cracked or broken screens for all phone models.",
    price: "$89.99",
  },
  {
    id: "2",
    name: "Battery Replacement",
    description: "Replace old or faulty batteries to restore battery life.",
    price: "$49.99",
  },
  {
    id: "4",
    name: "Charging Port Fix",
    description: "Repair or replace faulty charging ports.",
    price: "$39.99",
  },
  {
    id: "5",
    name: "Speaker Repair",
    description: "Fix audio issues and replace damaged speakers.",
    price: "$59.99",
  },
  {
    id: "6",
    name: "Camera Fix",
    description: "Repair front or rear cameras for clear photos.",
    price: "$69.99",
  },
  {
    id: "7",
    name: "Back Glass Repair",
    description: "Replace cracked back glass panels.",
    price: "$79.99",
  },
  {
    id: "8",
    name: "Software Troubleshooting",
    description: "Fix software issues, updates, and data recovery.",
    price: "$29.99",
  },
];

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("carouselImages")) {
        db.createObjectStore("carouselImages", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("contactMessages")) {
        db.createObjectStore("contactMessages", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("quoteRequests")) {
        db.createObjectStore("quoteRequests", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("quoteOptions")) {
        db.createObjectStore("quoteOptions", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getServices(): Promise<Service[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const services = request.result as Service[];
      if (services.length === 0) {
        resolve(DEFAULT_SERVICES);
      } else {
        resolve(services);
      }
    };
    request.onerror = () => reject(request.error);
  });
}

export async function saveService(service: Service): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(service);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteService(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function initializeServices(): Promise<void> {
  const services = await getServices();
  if (services.length === 0 || services === DEFAULT_SERVICES) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    for (const service of DEFAULT_SERVICES) {
      store.put(service);
    }

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
}

export function getDefaultServices(): Service[] {
  return [...DEFAULT_SERVICES];
}
