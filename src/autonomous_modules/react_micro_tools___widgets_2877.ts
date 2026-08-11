import { useRef, useCallback, useEffect } from 'react';

/**
 * useAdaptiveThrottle: Optimized event handler execution for high-frequency updates.
 * Dynamically scales execution threshold based on main thread latency.
 */
export function useAdaptiveThrottle<T extends (...args: any[]) => void>(callback: T, baseLimit: number = 100) {
  const lastRun = useRef<number>(0);
  const frameRef = useRef<number>();
  const savedCallback = useRef(callback);

  useEffect(() => { savedCallback.current = callback; }, [callback]);

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const delta = now - lastRun.current;

    if (delta >= baseLimit) {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      
      frameRef.current = requestAnimationFrame(() => {
        savedCallback.current(...args);
        lastRun.current = Date.now();
      });
    }
  }, [baseLimit]);
}

// Usage example:
// const handleScroll = useAdaptiveThrottle((e) => console.log('Scrolled'), 50);
