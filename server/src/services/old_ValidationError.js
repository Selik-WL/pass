import dotenv from 'dotenv';
dotenv.config();

export default class ValidationError extends Error {
    constructor(message, status, target) {
        super(message);
        this.name = 'ValidationError';
        this.status = status;
        this.target = target;
    }

    toString() {
        const {message, status, target, stack} = this;
        return `ValidationException\n\tmessage : ${message}\n\tstatus : ${status}\n\ttarget : ${target}\n\tstack : ${stack}`;
    }

    static debug() {
        return (process.env.DEBUG === 'true');
    }

    static wrap(error, wrapperError) {
        if (error instanceof ValidationError)
            return error;
        if (this.debug()) {
            console.error(error);
            return new ValidationError(error.message,wrapperError.status, wrapperError.target);
        }
        return wrapperError;
    }

    static mask(error, maskingError) {
        if (this.debug()) {
            return error;
        }
        return maskingError;
    }

    static exit(response, error) {
        error = this.wrap(error,new ValidationError("Unknown error.",500,'unknown'))
        if (this.debug()) 
            console.error(error);
        return response.status(error.status).json({
                "type":"error", 
                "error":{
                    "target":error.target,
                    "message":error.message
                }
            });
    }
}