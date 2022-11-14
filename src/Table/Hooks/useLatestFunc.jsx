import { useRef, useEffect, useCallback } from 'react';

export function useLatestFunc(fn) {
  const ref = useRef(fn);

  useEffect(() => {
    ref.current = fn;
  });

  const callbackFn = useCallback((...args) => {
    ref.current(...args);
  }, []);

  return fn ? callbackFn : fn;
}
