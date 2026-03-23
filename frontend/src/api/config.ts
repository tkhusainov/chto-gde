export const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export async function checkHealth(
  onAttempt?: (attempt: number) => void,
  maxAttempts = 10,
  intervalMs = 5000,
): Promise<boolean> {
  for (let i = 1; i <= maxAttempts; i++) {
    onAttempt?.(i);
    try {
      const res = await fetch(`${BASE_URL}/health`);
      if (res.ok) return true;
    } catch {
      // server still waking up
    }
    if (i < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
  }
  return false;
}
