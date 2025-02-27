import { createLogger, format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file' 
const { combine, timestamp, printf } = format 


const logFormat = printf(({ level, message, timestamp, meta, error }) => { //here we take the variables and format them so that they are easier to process and analyze by log management tools such as AWS CloudWatch 
    return JSON.stringify({
        timestamp,
        level,
        message,
        error,
        ...(meta ? { meta } : {})
    })
})


const logger = createLogger({
    level: 'info',  
    format: combine(
        timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
        }),
        logFormat
    ),
    transports: [
        new transports.Console({
            level: 'info',  
        }),

        // File transport with log rotation
        new DailyRotateFile({
            filename: 'logs/bot-%DATE%.log',  // Log files will be rotated daily
            datePattern: 'YYYY-MM-DD',         // Date format for rotated logs
            maxSize: '10m',
            maxFiles: '14d',                   // Keep logs for 14 days
            level: 'info',
            format: logFormat
        }),
    ]
});

export default logger
