import statuses from "statuses";

class ApplicationError extends Error {
  status;
  details;
  isOperational;

  constructor(message?: string, status?: number, details?: any) {
    /** default values */
    const DEFAULT_STATUS = 400;
    const DEFAULT_MESSAGE = "Application Error";
    const DEFAULT_NAME = statuses(status || DEFAULT_STATUS) || DEFAULT_MESSAGE;

    super(message || DEFAULT_MESSAGE);

    this.name = DEFAULT_NAME;
    this.status = status || DEFAULT_STATUS;
    this.details = details || {};
    this.isOperational = true;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export { ApplicationError };
