class appError extends Error {
    constructor(message, StatusCode) {
        super(message)
        this.StatusCode = StatusCode;
        this.Status = `${StatusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);

    }
}
module.exports = appError;
