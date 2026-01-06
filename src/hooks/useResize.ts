import { useState, useEffect, RefObject } from 'react';

export interface Dimensions {
  width: number;
  height: number;
}

/**
 * Hook to track element dimensions
 */
export function useResize<T extends HTMLElement = HTMLDivElement>(
  ref: RefObject<T>
): Dimensions {
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(ref.current);

    // Initial measurement
    setDimensions({
      width: ref.current.offsetWidth,
      height: ref.current.offsetHeight,
    });

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return dimensions;
}

/**
 * Hook to track window dimensions
 */
export function useWindowResize(): Dimensions {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
}
