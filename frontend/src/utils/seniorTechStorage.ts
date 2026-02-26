const DB_NAME = "SeniorTechDB";
const DB_VERSION = 1;
const STORE_NAME = "seniorTechRequests";

export interface SeniorTechRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  services: {
    smartphone: string[];
    computer: string[];
    homeTech: string[];
    onlineSafety: string[];
  };
  appointmentDate: string;
  appointmentTime: string;
  message: string;
  timestamp: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  unread: boolean;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
}

export async function saveSeniorTechRequest(request: Omit<SeniorTechRequest, "id" | "timestamp" | "status" | "unread">): Promise<SeniorTechRequest> {
  const db = await openDB();
  const fullRequest: SeniorTechRequest = {
    ...request,
    id: `ST-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: Date.now(),
    status: "pending",
    unread: true,
  };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.add(fullRequest);
    req.onsuccess = () => resolve(fullRequest);
    req.onerror = () => reject(req.error);
  });
}

export async function getSeniorTechRequests(): Promise<SeniorTechRequest[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => {
      const sorted = (req.result as SeniorTechRequest[]).sort(
        (a, b) => b.timestamp - a.timestamp
      );
      resolve(sorted);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function updateSeniorTechStatus(id: string, status: SeniorTechRequest["status"]): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const request = getReq.result as SeniorTechRequest;
      if (request) {
        request.status = status;
        store.put(request);
      }
      resolve();
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

export async function markSeniorTechAsRead(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const request = getReq.result as SeniorTechRequest;
      if (request) {
        request.unread = false;
        store.put(request);
      }
      resolve();
    };
    getReq.onerror = () => reject(getReq.error);
  });
}
