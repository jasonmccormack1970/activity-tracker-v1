import { useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEY } from '../constants.ts';

export function useLocalStorage<T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      // If the item is null (first visit), or it's an empty array from a previous state, use the initialValue (which contains demo data).
      if (item === null || (key === LOCAL_STORAGE_KEY && item === '[]')) {
          return initialValue;
      }
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const valueToStore = JSON.stringify(storedValue);
      window.localStorage.setItem(key, valueToStore);
    } catch (error) {
      console.error('Error writing to localStorage', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
