import { JSX, useEffect, useRef, useState } from "react";
import "../style/video.css";

interface VideoProps {
  src?: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
}

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

function Video({
  src,
  poster,
  autoPlay = false,
  loop = false,
  muted = false,
  controls = true,
}: VideoProps): JSX.Element {
  const [dbUrl, setDbUrl] = useState<string | null>(null);
  const revokedRef = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Only load from IndexedDB when no external src provided
    if (!src) {
      getVideoFromDB()
        .then((blob) => {
          if (!mounted) return;
          if (blob) {
            const url = URL.createObjectURL(blob);
            revokedRef.current = url;
            setDbUrl(url);
          }
        })
        .catch(() => {
          // ignore errors silently
        });
    }

    return () => {
      mounted = false;
      if (revokedRef.current) {
        URL.revokeObjectURL(revokedRef.current);
        revokedRef.current = null;
      }
    };
  }, [src]);

  const effectiveSrc = src || dbUrl || undefined;

  return (
    <div className="video-section">
      <div className="video-container">
        <video
          className="video-player"
          src={effectiveSrc}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          controls={controls}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

export default Video;
