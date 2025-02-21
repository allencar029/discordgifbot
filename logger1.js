import { createLogger, format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file' 
const { combine, timestamp, printf, json } = format //destructuring format


const logFormat = printf(({ level, message, timestamp, meta }) => {
    return JSON.stringify({
        timestamp,
        level,
        message,
        ...(meta ? { meta } : {})  // Optionally include additional metadata
    });
});


const logger = createLogger({
    level: 'info',  
    format: combine(
        timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
        }), 
        json()
    ),
    transports: [
        new transports.Console({
            level: 'info',  
            format: combine(logFormat)
        }),

        new transports.Console({
            level: 'error',
            format: combine(logFormat)
        }),

        // File transport with log rotation
        new DailyRotateFile({
            filename: 'logs/bot-%DATE%.log',  // Log files will be rotated daily
            datePattern: 'YYYY-MM-DD',         // Date format for rotated logs
            maxSize: '10m',
            maxFiles: '14d',                   // Keep logs for 14 days
            level: 'info',
            format: combine(timestamp(), json())
        }),
    ]
});

export default logger
