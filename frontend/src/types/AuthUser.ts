import { UserRole } from '../enums';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
