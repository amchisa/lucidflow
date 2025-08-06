import { useState, useEffect } from "react";

/**
 * Custom hook for debouncing a state. The state only changes when a specified delay has passed
 * without its value being changed via its setter method.
 * @template T The type of the value being debounced.
 * @param value The value to debounce.
 * @param delay The delay in milliseconds before the value is updated.
 * @returns The debounced value and the setter method for the raw value.
 */
export default function useDebounce<T>(
  value: T,
  delay: number
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [rawValue, setRawValue] = useState<T>(value);
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set timeout to update the debounced value after a specified delay
    const handleDebounce = setTimeout(() => {
      setDebouncedValue(rawValue);
    }, delay);

    // Clear timeout if effect is re-executed due to value change
    return () => {
      clearTimeout(handleDebounce);
    };
  }, [rawValue, delay]);

  return [debouncedValue, setRawValue];
}
