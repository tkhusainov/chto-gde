import { useEffect } from 'react';
import { checkHealth } from '../api/config';

export function useKeepAlive(intervalMs = 60_000) {
  useEffect(() => {
    const id = setInterval(() => checkHealth(), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}
