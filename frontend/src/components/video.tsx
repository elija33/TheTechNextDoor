import { JSX, useEffect, useState } from "react";
import "../style/video.css";
import { videoApi } from "../services/api";

interface VideoProps {
  src?: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
}

function Video({
  src,
  poster,
  autoPlay = false,
  loop = false,
  muted = false,
  controls = true,
}: VideoProps): JSX.Element {
  const [apiSrc, setApiSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!src) {
      videoApi.get()
        .then((response) => {
          const val = response.data as string;
          if (val) setApiSrc(val);
        })
        .catch(() => {});
    }
  }, [src]);

  const effectiveSrc = src || apiSrc || undefined;

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
