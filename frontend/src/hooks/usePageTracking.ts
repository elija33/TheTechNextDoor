import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsApi } from '../services/api';

// Only track public-facing pages, not admin routes
const TRACKED_PATHS = ['/', '/contactus', '/getaquote', '/senior-tech-service'];

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    if (TRACKED_PATHS.includes(location.pathname)) {
      analyticsApi.track(location.pathname).catch(() => {});
    }
  }, [location.pathname]);
}
