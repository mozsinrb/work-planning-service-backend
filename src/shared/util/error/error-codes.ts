export const ERROR_MESSAGES = {
  AUTH: {
    MISSING_TOKEN: "No authentication token provided!",
    INVALID_TOKEN: "Invalid or expired authentication token!",
    NO_PERMISSION: "You do not have the necessary permissions to perform this action!",
  },
  EMAIL: {
    EMAIL_ALREADY_USED: "This email address is already used!",
  },
  WORKER: {
    NOT_FOUND: "Worker not found!",
    BAD_CREDENTIALS: "Bad login credentials!",
  },
  SHIFT: {
    ALREADY_ASSIGNED: "The shift is already assigned",
    NOT_FOUND: "Shift not found!",
  },
};

export const ERROR_CODES = {
  AUTH: {
    MISSING_TOKEN: "auth.missingToken",
    INVALID_TOKEN: "auth.invalidOrExpiredToken",
  },
  WORKER: {
    UNAUTHORIZED: "user.unauthorized",
    BAD_CREDENTIALS: "user.badCredentials",
    NOT_FOUND: "user.notFound",
    EMAIL_ALREADY_USED: "worker.emailAlreadyUsed",
  },
  SHIFT: {
    ALREADY_ASSIGNED: "shift.alreadyAssigned",
    NOT_FOUND: "shift.notFound",
  },
};

export const STATUS_CODES = {
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
  CONFLICT: 409,
  FORBIDDEN: 403,
  OK: 200,
};
