import { useState, useEffect } from "react";

// Returns a debounced value — delays update until user stops typing
export function useDebounce(value, delayMs = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);   // cleanup on re-render
  }, [value, delayMs]);

  return debouncedValue;
}
