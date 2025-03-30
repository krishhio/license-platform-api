const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
require('winston-daily-rotate-file');

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const dailyRotateTransport = new transports.DailyRotateFile({
  filename: 'logs/%DATE%-combined.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,            // Comprime los archivos viejos (.gz)
  maxSize: '5m',                  // Tamaño máximo por archivo
  maxFiles: '14d',                // Guarda logs por 14 días
});

const errorTransport = new transports.DailyRotateFile({
  filename: 'logs/%DATE%-error.log',
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  zippedArchive: true,
  maxSize: '5m',
  maxFiles: '14d',
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    dailyRotateTransport,
    errorTransport,
    new transports.Console()
  ]
});

module.exports = logger;
