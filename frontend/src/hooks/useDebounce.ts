import { useState, useEffect } from "react";

/**
 * Custom hook for debouncing a value. Returns a value only when a specified delay has passed
 * without the value changing.
 * @template T The type of the value being debounced.
 * @param value The value to debounce.
 * @param delay The delay in milliseconds before the value is updated.
 * @returns The debounced value.
 */
export default function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set timeout to update the debounced value after a specified delay
    const handleDebounce = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear timeout if effect is re-executed due to value change
    return () => {
      clearTimeout(handleDebounce);
    };
  }, [value, delay]);

  return debouncedValue;
}
