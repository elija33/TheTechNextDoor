"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || !TRACKED_PATHS.includes(pathname)) return;
    getCity().then((city) => {
      analyticsApi.track(pathname, city).catch(() => {});
    });
  }, [pathname]);
}
