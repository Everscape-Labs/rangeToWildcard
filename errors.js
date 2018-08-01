'use strict';
const ExtendableError = require('es6-error');

class AbstractError extends ExtendableError {
  constructor(message, response) {
    super(message);
    this.name     = this.constructor.name;
    this.message  = message;
    this.response = response;
  }

  getResponse() {
    return this.response;
  }
}

class ServerError         extends AbstractError {}
class NotFoundError       extends AbstractError {}
class ParameterError      extends AbstractError {}
class TooMuchDataError    extends AbstractError {}
class DuplicateEntryError extends AbstractError {}
class Unauthorized        extends AbstractError {}

const buildErrorResponse = (objectError) =>
  ({
    path   : objectError.path,
    keyword: objectError.keyword,
    message: objectError.message,
  });

const buildFromValidationErrors = (errors, controller) =>
  errors.map((error) => ({
    path   : error.path,
    keyword: `${controller}.${error.path}.${error.keyword}`,
    message: `[${controller}] ${error.path} failed schema validation`,
  }));

module.exports = {
  ServerError,
  NotFoundError,
  ParameterError,
  TooMuchDataError,
  DuplicateEntryError,
  buildErrorResponse,
  buildFromValidationErrors,
  Unauthorized,
};
