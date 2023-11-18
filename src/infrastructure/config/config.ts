import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: process.env.PORT || 3000,
  environment: process.env.ENV || "develop",
};
console.log(env);

export const db = {
  port: process.env.BD_PORT || 3306,
  type: process.env.BD_TYPE || "mysql",
  username: process.env.BD_USER || "root",
  password: process.env.BD_PASS || "root",
  host: process.env.BD_HOST || "localhost",
  database: process.env.BD_NAME || "app",
};

export const lg = {
  level: process.env.LOGGER_LEVEL || "info",
};

export const jwt = {
  secretKey: process.env.JWT_SECRET || "your_secret_key",
  expirationTime: process.env.JWT_EXPIRATION_TIME || "1h",
};

export const redis_env = {
  url: process.env.BD_REDIS || "localhost",
};
