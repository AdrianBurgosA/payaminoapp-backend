// src/common/logger/logger.config.ts
import * as winston from 'winston';

export const winstonConfig = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, context }) => {
          return `${timestamp} [${level.toUpperCase()}] [${context ?? 'App'}] ${message}`;
        }),
      ),
    }),

    new winston.transports.File({
      filename: 'C:/logs/payamino/app.log',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message, context }) => {
          return `${timestamp} [${level.toUpperCase()}] [${context ?? 'App'}] ${message}`;
        }),
      ),
    }),
  ],
};
