export interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  brand: string;
  grouping: string;
  model: string;
  service: string;
  date: string;
  time: string;
  notes: string;
  amount: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  timestamp: number;
  textConfirmation: boolean;
  images: string[];
  streetAddress: string;
  city: string;
  zipPostalCode: string;
}

const DB_NAME = "TheTechNextDoorDB";
const STORE_NAME = "orders";
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
      if (!db.objectStoreNames.contains("quoteRequests")) {
        db.createObjectStore("quoteRequests", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("quoteOptions")) {
        db.createObjectStore("quoteOptions", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("services")) {
        db.createObjectStore("services", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getOrders(): Promise<Order[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const orders = request.result as Order[];
      orders.sort((a, b) => b.timestamp - a.timestamp);
      resolve(orders);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function saveOrder(order: Order): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(order);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const order = getRequest.result as Order | undefined;
      if (order) {
        order.status = status;
        store.put(order);
      }
    };

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteOrder(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export function generateOrderId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `#ORD-${random}`;
}

export async function getBookedTimesForDate(date: string): Promise<string[]> {
  const orders = await getOrders();
  // Only consider pending and confirmed orders (not cancelled or completed)
  const bookedTimes = orders
    .filter((order) => order.date === date && (order.status === "pending" || order.status === "confirmed"))
    .map((order) => order.time);
  return bookedTimes;
}
