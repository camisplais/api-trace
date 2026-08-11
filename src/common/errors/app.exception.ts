import { HttpException } from '@nestjs/common';
import { ErrorCatalog, ErrorKey } from './error-catalog';
import { ErrorResponse } from './error.types';

export class AppException extends HttpException {
  constructor(errorKey: ErrorKey) {
    const error = ErrorCatalog[errorKey];

    const response: ErrorResponse = {
      data: null,
      msg: {
        code: error.code,
        msg: error.userMessage,
      },
    };

    super(response, error.status);
  }
}