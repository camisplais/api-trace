import { HttpException } from '@nestjs/common';
import { ErrorCatalog, ErrorKey } from './error-catalog';
import { ErrorResponse } from './error.types';

export class AppException extends HttpException {
  constructor(errorKey: ErrorKey, params?: Record<string, string>) {
    const error = ErrorCatalog[errorKey];

    let message: string = error.userMessage;

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        message = message.replace(`{${key}}`, value);
      });
    }

    const response: ErrorResponse = {
      data: null,
      msg: {
        code: error.code,
        msg: message,
      },
    };

    super(response, error.status);
  }
}