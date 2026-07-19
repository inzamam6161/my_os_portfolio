// src/hooks/useTime.js
import { useState, useEffect } from "react";

export function useTime() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i); // ← CRITICAL: cleanup prevents memory leak
  }, []);                          // ← empty array = run once on mount

  return time;
}

// Usage: const time = useTime();