import { useEffect, useState, useRef } from "react";
import { JSX } from "react";
import Video from "../video";
import "../../style/video.css";
import { settingsApi } from "../../services/api";

const VIDEO_SETTING_KEY = "videoUrl";

function DashboardVideo(): JSX.Element {
  const [savedSrc, setSavedSrc] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    settingsApi.get(VIDEO_SETTING_KEY)
      .then((response) => {
        const val = response.data as string;
        if (val) setSavedSrc(val);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_MB = 100;
    if (file.size > MAX_MB * 1024 * 1024) {
      setMessage(`File is too large. Please use a video under ${MAX_MB}MB.`);
      return;
    }

    setUploading(true);
    setMessage("Uploading video...");

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        await settingsApi.save(VIDEO_SETTING_KEY, base64);
        setSavedSrc(base64);
        setMessage("Video saved successfully.");
      } catch {
        setMessage("Failed to save video.");
      } finally {
        setUploading(false);
      }
    };
    reader.onerror = () => {
      setMessage("Failed to read video file.");
      setUploading(false);
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const handleRemove = async () => {
    try {
      await settingsApi.save(VIDEO_SETTING_KEY, "");
      setSavedSrc(null);
      setMessage("Video removed.");
    } catch {
      setMessage("Failed to remove video.");
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard Video</h2>

      <div style={{ marginBottom: 16 }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            className="btn-primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Video File"}
          </button>
          {savedSrc && (
            <button className="btn-secondary" onClick={handleRemove} disabled={uploading}>
              Remove Video
            </button>
          )}
        </div>
        <p style={{ marginTop: 6, fontSize: 13, color: "#888" }}>
          Max 100MB. MP4 recommended.
        </p>
      </div>

      {message && <div style={{ marginBottom: 12 }}>{message}</div>}

      <hr />

      <div style={{ marginTop: 16 }}>
        <h4>Current Video</h4>
        {savedSrc ? (
          <Video src={savedSrc} controls={true} />
        ) : (
          <div>No video saved. Upload a file above.</div>
        )}
      </div>
    </div>
  );
}

export default DashboardVideo;
