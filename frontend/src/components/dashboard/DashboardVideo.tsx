import { useEffect, useState, useRef } from "react";
import { JSX } from "react";
import Video from "../video";
import "../../style/video.css";

const DB_NAME = "thetechnextdoor";
const DB_VERSION = 1;
const STORE_NAME = "videos";
const VIDEO_KEY = "dashboardVideo";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveVideoToDB(blob: Blob) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(blob, VIDEO_KEY);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function getVideoFromDB(): Promise<Blob | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(VIDEO_KEY);
    req.onsuccess = () => resolve(req.result as Blob | undefined);
    req.onerror = () => reject(req.error);
  });
}

async function removeVideoFromDB(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(VIDEO_KEY);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

function DashboardVideo(): JSX.Element {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [savedSrc, setSavedSrc] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const savedUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getVideoFromDB()
      .then((blob) => {
        if (!mounted) return;
        if (blob) {
          const url = URL.createObjectURL(blob);
          savedUrlRef.current = url;
          setSavedSrc(url);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
      if (savedUrlRef.current) {
        URL.revokeObjectURL(savedUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) setFile(f);
  };

  const handleSave = async () => {
    if (!file) {
      setMessage("No video selected to save.");
      return;
    }

    try {
      await saveVideoToDB(file);
      // revoke previous saved url
      if (savedUrlRef.current) URL.revokeObjectURL(savedUrlRef.current);
      const newUrl = URL.createObjectURL(file);
      savedUrlRef.current = newUrl;
      setSavedSrc(newUrl);
      setMessage("Video saved to IndexedDB.");
    } catch (err) {
      setMessage("Failed to save video to IndexedDB.");
    }
  };

  const handleRemove = async () => {
    try {
      await removeVideoFromDB();
      if (savedUrlRef.current) {
        URL.revokeObjectURL(savedUrlRef.current);
        savedUrlRef.current = null;
      }
      setSavedSrc(null);
      setFile(null);
      setPreview(null);
      setMessage("Saved video removed from IndexedDB.");
    } catch (err) {
      setMessage("Failed to remove saved video.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard Video</h2>

      <div style={{ marginBottom: 12 }}>
        <input type="file" accept="video/*" onChange={handleFileChange} />
      </div>

      {preview && (
        <div style={{ marginBottom: 12 }}>
          <h4>Preview</h4>
          <video
            style={{ maxWidth: "100%", height: "auto" }}
            src={preview}
            controls
          />
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={handleSave} className="btn-primary">
          Save
        </button>
        <button onClick={handleRemove} className="btn-secondary">
          Remove Saved
        </button>
      </div>

      {message && <div style={{ marginBottom: 12 }}>{message}</div>}

      <hr />

      <div style={{ marginTop: 16 }}>
        <h4>Saved Video</h4>
        {savedSrc ? (
          <Video src={savedSrc} controls={true} />
        ) : (
          <div>
            No saved video. Upload a file and click Save to display here.
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardVideo;
