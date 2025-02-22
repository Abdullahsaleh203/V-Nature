class appError extends Error {
    constructor(massage, StatusCode) {
        super(message)
        this.StatusCode = StatusCode || 500
        this.Status = `${StatusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);

    }
}
module.exports = appError;
