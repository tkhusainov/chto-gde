export interface GameItem {
  id: string;
  name: string;
  code: string;
  pin: string;
  userId?: string;
  playCount?: number;
  lastPlayedAt?: string;
}
