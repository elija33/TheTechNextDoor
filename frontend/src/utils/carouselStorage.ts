export interface CarouselImage {
  id: string;
  name: string;
  data: string;
}

const DB_NAME = "TheTechNextDoorDB";
const STORE_NAME = "carouselImages";
const DB_VERSION = 8;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
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
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getCarouselImages(): Promise<CarouselImage[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveCarouselImages(images: CarouselImage[]): Promise<void> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  store.clear();
  images.forEach((img) => store.put(img));

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
