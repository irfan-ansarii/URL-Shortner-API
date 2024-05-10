import winston from "winston";

const { combine, timestamp, printf, colorize, align, errors } = winston.format;

export const logger = winston.createLogger({
  level: "info",
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss A",
    }),
    align(),
    printf(
      ({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`
    ),
    errors({ stack: true })
  ),
  exceptionHandlers: [new winston.transports.Console()],
  rejectionHandlers: [
    new winston.transports.File({ filename: "rejections.log" }),
  ],
  transports: [new winston.transports.Console()],
});
