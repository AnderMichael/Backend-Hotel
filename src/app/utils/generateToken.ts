export interface TokenGenerator {
    encrypt(data: any): string;
    decrypt(text: string): string;
}