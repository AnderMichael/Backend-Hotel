export interface UserDTO {
  id?: string;
  username: string;
  email: string;
  createdAt: Date;
  modifiedAt: Date;
  lastLogin: Date | null;
  token?: string
}
