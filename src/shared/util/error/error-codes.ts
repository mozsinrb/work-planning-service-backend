export const ERROR_MESSAGES = {
  AUTH: {
    MISSING_TOKEN: "No authentication token provided!",
    INVALID_TOKEN: "Invalid or expired authentication token!",
    NO_PERMISSION: "You do not have the necessary permissions to perform this action!",
  },
  WORKER: {
    NOT_FOUND: "Worker not found!",
  },
};

export const ERROR_CODES = {
  AUTH: {
    MISSING_TOKEN: "auth.missingToken",
    INVALID_TOKEN: "auth.invalidOrExpiredToken",
  },
  WORKER: {
    UNAUTHORIZED: "user.unauthorized",
    NOT_FOUND: "user.notFound",
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
