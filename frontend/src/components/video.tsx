import { JSX, useEffect, useState } from "react";
import "../style/video.css";
import { settingsApi } from "../services/api";

interface VideoProps {
  src?: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
}

const VIDEO_SETTING_KEY = "videoUrl";

function Video({
  src,
  poster,
  autoPlay = false,
  loop = false,
  muted = false,
  controls = true,
}: VideoProps): JSX.Element {
  const [apiUrl, setApiUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!src) {
      settingsApi.get(VIDEO_SETTING_KEY)
        .then((response) => {
          const url = response.data as string;
          if (url) setApiUrl(url);
        })
        .catch(() => {});
    }
  }, [src]);

  const effectiveSrc = src || apiUrl || undefined;

  if (!effectiveSrc) return <></>;

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
