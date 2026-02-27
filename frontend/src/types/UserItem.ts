import { UserRole } from '../enums';

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
