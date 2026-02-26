export interface QuoteRequest {
  id: string;
  brand: string;
  grouping: string;
  model: string;
  service: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  timestamp: number;
  status: "pending" | "reviewed" | "completed";
}

export interface QuoteOptions {
  brands: string[];
  groupings: { brand: string; groupings: string[] }[];
  models: { brand: string; grouping: string; models: string[] }[];
  services: string[];
}

const DB_NAME = "TheTechNextDoorDB";
const STORE_NAME = "quoteRequests";
const OPTIONS_STORE = "quoteOptions";
const DB_VERSION = 8;

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
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(OPTIONS_STORE)) {
        db.createObjectStore(OPTIONS_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("services")) {
        db.createObjectStore("services", { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getQuoteRequests(): Promise<QuoteRequest[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const quotes = request.result as QuoteRequest[];
      quotes.sort((a, b) => b.timestamp - a.timestamp);
      resolve(quotes);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function saveQuoteRequest(quote: QuoteRequest): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(quote);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function updateQuoteStatus(
  id: string,
  status: QuoteRequest["status"],
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const quote = getRequest.result as QuoteRequest | undefined;
      if (quote) {
        quote.status = status;
        store.put(quote);
      }
    };

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteQuoteRequest(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

const DEFAULT_OPTIONS: QuoteOptions = {
  brands: ["Apple"],
  groupings: [
    {
      brand: "Apple",
      groupings: [
        "iPhone 16 Series",
        "iPhone 15 Series",
        "iPhone 14 Series",
        "iPhone 13 Series",
        "iPhone 12 Series",
        "iPhone 11 Series",
        "iPhone X Series",
        "iPhone 8 Series",
        "iPhone 7 Series",
        "iPhone SE Series",
      ],
    },
  ],
  models: [
    {
      brand: "Apple",
      grouping: "iPhone 16 Series",
      models: [
        "iPhone 16",
        "iPhone 16 Plus",
        "iPhone 16 Pro",
        "iPhone 16 Pro Max",
      ],
    },
    {
      brand: "Apple",
      grouping: "iPhone 15 Series",
      models: [
        "iPhone 15",
        "iPhone 15 Plus",
        "iPhone 15 Pro",
        "iPhone 15 Pro Max",
      ],
    },
    {
      brand: "Apple",
      grouping: "iPhone 14 Series",
      models: [
        "iPhone 14",
        "iPhone 14 Plus",
        "iPhone 14 Pro",
        "iPhone 14 Pro Max",
      ],
    },
    {
      brand: "Apple",
      grouping: "iPhone 13 Series",
      models: [
        "iPhone 13",
        "iPhone 13 Mini",
        "iPhone 13 Pro",
        "iPhone 13 Pro Max",
      ],
    },
    {
      brand: "Apple",
      grouping: "iPhone 12 Series",
      models: [
        "iPhone 12",
        "iPhone 12 Mini",
        "iPhone 12 Pro",
        "iPhone 12 Pro Max",
      ],
    },
    {
      brand: "Apple",
      grouping: "iPhone 11 Series",
      models: ["iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max"],
    },
    {
      brand: "Apple",
      grouping: "iPhone X Series",
      models: ["iPhone X", "iPhone XR", "iPhone XS", "iPhone XS Max"],
    },
    {
      brand: "Apple",
      grouping: "iPhone 8 Series",
      models: ["iPhone 8", "iPhone 8 Plus"],
    },
    {
      brand: "Apple",
      grouping: "iPhone SE Series",
      models: [
        "iPhone SE (1st Gen)",
        "iPhone SE (2nd Gen)",
        "iPhone SE (3rd Gen)",
      ],
    },
  ],
  services: [
    "Screen Repair",
    "Battery Replacement",
    "Charging Port Repair",
    "Camera Repair",
    "Speaker Repair",
    "Back Glass Replacement",
    "Software Issues",
    "Other",
  ],
};

export async function getQuoteOptions(): Promise<QuoteOptions> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OPTIONS_STORE, "readonly");
    const store = tx.objectStore(OPTIONS_STORE);
    const request = store.get("options");

    request.onsuccess = () => {
      const result = request.result;
      if (result && result.data) {
        // Merge with defaults to ensure all fields exist
        const saved = result.data as Partial<QuoteOptions>;
        const merged: QuoteOptions = {
          brands: saved.brands?.length ? saved.brands : DEFAULT_OPTIONS.brands,
          groupings: saved.groupings?.length
            ? saved.groupings
            : DEFAULT_OPTIONS.groupings,
          models: saved.models?.length ? saved.models : DEFAULT_OPTIONS.models,
          services: saved.services?.length
            ? saved.services
            : DEFAULT_OPTIONS.services,
        };
        resolve(merged);
      } else {
        resolve(DEFAULT_OPTIONS);
      }
    };
    request.onerror = () => reject(request.error);
  });
}

export function getDefaultOptions(): QuoteOptions {
  return { ...DEFAULT_OPTIONS };
}

export async function saveQuoteOptions(options: QuoteOptions): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OPTIONS_STORE, "readwrite");
    const store = tx.objectStore(OPTIONS_STORE);
    store.put({ id: "options", data: options });

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
