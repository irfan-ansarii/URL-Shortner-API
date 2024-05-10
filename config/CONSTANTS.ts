import "dotenv/config";

export const DATABASE_URL = process.env.DATABASE_URL;

export const POSTGRES_URL = process.env.POSTGRES_URL;

export const POSTGRES_URL_NON_POOLING = process.env.POSTGRES_URL_NON_POOLING;
export const POSTGRES_USER = process.env.POSTGRES_USER;
export const POSTGRES_HOST = process.env.POSTGRES_HOST;
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
export const POSTGRES_DATABASE = process.env.POSTGRES_DATABASE;

export const NOT_FOUND_REDIRECT = process.env.NOT_FOUND_REDIRECT;
export const EMAIL_API_TOKEN = process.env.EMAIL_API_TOKEN;
export const APP_NAME = process.env.APP_NAME;
export const JWT_SECRET = process.env.JWT_SECRET;
export const PAGE_LIMIT = 10;

export const INTERVAL_MAP: { [key: string]: any } = {
  "1h": {
    start: "1 hour",
    interval: "10 minute",
  },
  "24h": {
    start: "24 hour",
    interval: " 2 hour",
  },
  "7d": {
    start: "7 day",
    interval: "1 day",
  },
  "30d": {
    start: "30 day",
    interval: "4 day",
  },
  "90d": {
    start: "90 day",
    interval: "10 day",
  },
  "365d": {
    start: "365 day",
    interval: "1 month",
  },
};
