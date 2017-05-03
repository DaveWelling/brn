export const INFO = 'INFO';
export const WARN = 'WARN';
export const ERROR = 'ERROR';
export const CRITICAL = 'CRITICAL';
export default function log(message, logType=INFO){
    if (![INFO, WARN, ERROR, CRITICAL].includes(logType)){
        log('Unknown log type', CRITICAL);
    }
    switch (logType) {
        case INFO:
            console.log(message);
            break;
        case WARN:
            console.warn(message);
            break;
        case ERROR:
            console.error(`ERROR: ${message}`);
            break;
        case CRITICAL:
            console.error(`CRITICAL: ${message}`);
            throw new Error(message);            
    }
}

window.addEventListener('unhandledrejection', function(err, promise) {
    log(`Unhandled promise rejection: ${err.message? err.message : err}`, ERROR);
});