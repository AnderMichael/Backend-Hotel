export interface IUserEntity {
    id?: string;
    username: string;
    email: string;
    hashedPassword: string;
    lastLogin: Date | null;
    token: string | null;
}