import { useEffect, useRef } from 'react';

export function usePrev<T>(value: T): T | null {
    const ref = useRef<null | T>(null);
  
    useEffect(() => {
      ref.current = value;
    },        [value]);
  
    return ref.current;
  }