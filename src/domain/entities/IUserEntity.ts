export interface IUserEntity {
    id?: string;
    username: string;
    email: string;
    hashedPassword: string;
    createdAt: Date;
    modifiedAt: Date;
    lastLogin: Date | null;
}