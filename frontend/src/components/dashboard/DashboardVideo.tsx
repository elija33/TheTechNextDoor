import { useEffect, useState } from "react";
import { JSX } from "react";
import Video from "../video";
import "../../style/video.css";
import { settingsApi } from "../../services/api";

const VIDEO_SETTING_KEY = "videoUrl";

function DashboardVideo(): JSX.Element {
  const [inputUrl, setInputUrl] = useState("");
  const [savedUrl, setSavedUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    settingsApi.get(VIDEO_SETTING_KEY)
      .then((response) => {
        const url = response.data as string;
        if (url) {
          setSavedUrl(url);
          setInputUrl(url);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    const url = inputUrl.trim();
    if (!url) {
      setMessage("No URL entered.");
      return;
    }

    try {
      await settingsApi.save(VIDEO_SETTING_KEY, url);
      setSavedUrl(url);
      setMessage("Video URL saved successfully.");
    } catch {
      setMessage("Failed to save video URL.");
    }
  };

  const handleRemove = async () => {
    try {
      await settingsApi.save(VIDEO_SETTING_KEY, "");
      setSavedUrl(null);
      setInputUrl("");
      setMessage("Video URL removed.");
    } catch {
      setMessage("Failed to remove video URL.");
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard Video</h2>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 6 }}>
          Video URL (direct MP4 link, YouTube embed, or Vimeo embed)
        </label>
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="https://example.com/video.mp4"
          style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
        />
      </div>

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
        {savedUrl ? (
          <Video src={savedUrl} controls={true} />
        ) : (
          <div>No saved video. Enter a URL and click Save to display here.</div>
        )}
      </div>
    </div>
  );
}

export default DashboardVideo;
