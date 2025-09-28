/**
 * VibeX Backend Logger Service
 *
 * A simple, standardized logger that prepends a traceId to every message
 * for observability and debugging.
 */

export class Logger {
    private context: string;

    constructor(context: string) {
        this.context = context;
    }

    /**
     * Generic log method.
     * @param level The log level (INFO, WARN, ERROR).
     * @param message The main log message.
     * @param traceId The unique identifier for the job/request.
     */
    private log(level: 'INFO' | 'WARN' | 'ERROR', message: string, traceId?: string) {
        const timestamp = new Date().toISOString();
        const traceInfo = traceId ? `[${traceId}]` : '';
        // In a real application, this would output structured JSON to a log aggregator.
        console.log(`${timestamp} [${level}] [${this.context}]${traceInfo} - ${message}`);
    }

    /** Logs an informational message. */
    info(message: string, traceId?: string) {
        this.log('INFO', message, traceId);
    }

    /** Logs a warning message. */
    warn(message: string, traceId?: string) {
        this.log('WARN', message, traceId);
    }
    
    /** Logs an error message, including details from an Error object if provided. */
    error(message: string, traceId?: string, error?: any) {
        const errorMessage = error ? `${message} | Details: ${error.message || String(error)}` : message;
        this.log('ERROR', errorMessage, traceId);
    }
}

// Default logger instance for general use outside of specific module contexts.
export const logger = new Logger('VibeX-Core');