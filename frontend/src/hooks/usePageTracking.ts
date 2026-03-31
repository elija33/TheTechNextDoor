import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsApi } from '../services/api';

// Only track public-facing pages, not admin routes
const TRACKED_PATHS = ['/', '/contactus', '/getaquote', '/senior-tech-service'];

async function getCity(): Promise<string | null> {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    return data.city || data.region || null;
  } catch {
    return null;
  }
}

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    if (!TRACKED_PATHS.includes(location.pathname)) return;
    getCity().then((city) => {
      analyticsApi.track(location.pathname, city).catch(() => {});
    });
  }, [location.pathname]);
}
