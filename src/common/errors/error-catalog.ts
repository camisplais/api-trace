export interface ErrorDefinition {
  code: string;
  status: number;
  devMessageEn: string;
  devMessageEs: string;
  userMessage: string;
}

export const ErrorCatalog = {
  // FILES
  FILE_INVALID_TYPE: {
    code: 'FILE_001',
    status: 400,
    devMessageEn: 'Invalid file type, expected .csv',
    devMessageEs: 'Tipo de archivo inválido, se esperaba .csv',
    userMessage: 'El formato del archivo no es el correcto',
  },

  FILE_TOO_LARGE: {
    code: 'FILE_002',
    status: 413,
    devMessageEn: 'The file is too large',
    devMessageEs: 'El archivo es demasiado grande',
    userMessage: 'El archivo es demasiado grande',
  },

  FILE_INVALID_CONTENT: {
    code: 'FILE_003',
    status: 400,
    devMessageEn: 'The file content does not match the required structure',
    devMessageEs: 'El contenido del archivo no coincide con la estructura requerida',
    userMessage: 'El contenido del archivo no es el correcto',
  },

  FILE_REQUIRED: {
    code: 'FILE_004',
    status: 422,
    devMessageEn: 'No file was provided',
    devMessageEs: 'No se envió ningún archivo',
    userMessage: 'Debes adjuntar un archivo',
  },

  FILE_INVALID_TYPE_: {
  code: 'FILE_005',
  status: 400,
  devMessageEn: 'Invalid file type, expected PDF, Excel, JPG or PNG',
  devMessageEs: 'Tipo de archivo inválido, se esperaba PDF, Excel, JPG o PNG',
  userMessage: 'El formato del archivo no es válido. Solo se aceptan PDF, Excel, JPG o PNG',
},


  // QRs
  QR_INVALID_FORMAT: {
    code: 'QR_001',
    status: 400,
    devMessageEn: 'Invalid QR code format',
    devMessageEs: 'Formato de código QR inválido, no es el esperado',
    userMessage: 'El código QR no es válido, no contiene el formato esperado',
  },

  QR_NOT_MATCHING: {
    code: 'QR_002',
    status: 404,
    devMessageEn: 'The QR code does not match any registered trip',
    devMessageEs: 'El código QR no es correspondiente a ningún viaje registrado',
    userMessage: 'El código QR no corresponde a ningún viaje registrado',
  },

  QR_EXPIRED: {
    code: 'QR_003',
    status: 400,
    devMessageEn: 'The QR code has expired',
    devMessageEs: 'El código QR ha expirado',
    userMessage: 'El código QR ha expirado',
  },

  // OTP
  OTP_INVALID: {
    code: 'OTP_001',
    status: 400,
    devMessageEn: 'Invalid OTP code provided',
    devMessageEs: 'Código OTP inválido',
    userMessage: 'El código de verificación es inválido',
  },

  OTP_EXPIRED: {
    code: 'OTP_002',
    status: 400,
    devMessageEn: 'The OTP code has expired',
    devMessageEs: 'El código OTP ha expirado',
    userMessage: 'El código de verificación ha expirado',
  },

  // AUTH
  AUTH_EXPIRED: {
    code: 'AUTH_001',
    status: 401,
    devMessageEn: 'Session token has expired',
    devMessageEs: 'El token de sesión ha expirado',
    userMessage: 'Sesión expirada, por favor inicia sesión nuevamente',
  },

  AUTH_INVALID: {
    code: 'AUTH_002',
    status: 401,
    devMessageEn: 'Invalid or malformed session token provided',
    devMessageEs: 'Token de sesión inválido o malformado',
    userMessage: 'Sesión inválida, por favor inicia sesión nuevamente',
  },

  AUTH_INCORRECT_CREDENTIALS: {
    code: 'AUTH_003',
    status: 401,
    devMessageEn: 'Incorrect credentials provided',
    devMessageEs: 'Credenciales incorrectas proporcionadas',
    userMessage: 'Las credenciales proporcionadas son incorrectas, por favor verifica tu correo y contraseña',
  },

  // VALIDATION
  VAL_USERNAME: {
    code: 'VAL_001',
    status: 400,
    devMessageEn: 'Username must be at least 8 characters long',
    devMessageEs: 'El nombre de usuario debe tener al menos 8 caracteres',
    userMessage: 'El nombre de usuario debe tener al menos 8 caracteres',
  },

  VAL_PASSWORD_LONG: {
    code: 'VAL_002',
    status: 400,
    devMessageEn: 'Password must be at least 8 characters long',
    devMessageEs: 'La contraseña debe tener al menos 8 caracteres',
    userMessage: 'La contraseña debe tener al menos 8 caracteres',
  },

  VAL_PASSWORD_COMPLEXITY: {
    code: 'VAL_003',
    status: 400,
    devMessageEn: 'Password must contain at least one uppercase letter and one special character',
    devMessageEs: 'La contraseña no contiene al menos una letra mayúscula y un carácter especial',
    userMessage: 'La contraseña debe contener al menos una letra mayúscula y un carácter especial',
  },

  VAL_REQUIRED_FIELD: {
    code: 'VAL_004',
    status: 422,
    devMessageEn: 'Required field is missing: {fieldName}',
    devMessageEs: 'Falta un campo obligatorio: {fieldName}',
    userMessage: 'El campo {fieldName} es obligatorio',
  },

  VAL_RECORD_NOT_FOUND: {
    code: 'VAL_005',
    status: 404,
    devMessageEn: '{record} not found in database',
    devMessageEs: '{record} no encontrado en la base de datos',
    userMessage: '{record} no encontrado',
  },

  VAL_DUPLICATE_FIELD: {
    code: 'VAL_006',
    status: 409,
    devMessageEn: '{fieldName} already exists, must be unique',
    devMessageEs: 'El valor de {fieldName} ya existe, debe ser único',
    userMessage: '{fieldName} ya existente, debe ser único',
  },

  VAL_INVALID_FIELD: {
    code: 'VAL_007',
    status: 422,
    devMessageEn: '{fieldName} value does not match the expected format',
    devMessageEs: 'El valor de {fieldName} no coincide con el formato esperado',
    userMessage: '{fieldName} tiene un valor inválido',
  },

  VAL_CHANGE_PASSWORD: {
    code: 'VAL_008',
    status: 400,
    devMessageEn: 'New password must be different from the current password',
    devMessageEs: 'La nueva contraseña no puede ser igual a la contraseña actual',
    userMessage: 'La nueva contraseña debe ser diferente de la contraseña actual',
  },

  TRANS_NOT_AVAILABLE: {
    code: 'TRANS_001',
    status: 409,
    devMessageEn: 'The selected transport is already in use in another active trip',
    devMessageEs: 'El transporte seleccionado ya está en uso en otro viaje activo',
    userMessage: 'El transporte seleccionado ya está en uso, elige otro',
  },

  EMP_NOT_AVAILABLE: {
    code: 'EMP_001',
    status: 409,
    devMessageEn: 'The selected driver is already occupied in another trip',
    devMessageEs: 'El chofer seleccionado ya está ocupado en otro viaje',
    userMessage: 'El chofer seleccionado ya no está disponible, elige otro',
  },

  EMB_ALREADY_ASSIGNED: {
    code: 'EMB_002',
    status: 409,
    devMessageEn: 'The shipment is already assigned to another trip',
    devMessageEs: 'El embarque ya está asignado a otro viaje',
    userMessage: 'Este embarque ya fue asignado a un viaje',
  },

  // SERVER
  SERVER_ERROR: {
    code: 'SRV_001',
    status: 500,
    devMessageEn: 'Internal server error',
    devMessageEs: 'Error interno del servidor',
    userMessage: 'Algo salió mal, por favor intenta nuevamente más tarde',
  },

  SERVER_FAIL_SAVE: {
    code: 'SRV_002',
    status: 500,
    devMessageEn: 'Failed to save data in the database',
    devMessageEs: 'Error al guardar en la base de datos',
    userMessage: 'No se pudo guardar la información, por favor intenta de nuevo',
  },

  SERVER_TIMEOUT: {
    code: 'SRV_003',
    status: 504,
    devMessageEn: 'Server request timed out',
    devMessageEs: 'Timeout: el servidor no respondió a tiempo',
    userMessage: 'La solicitud tardó demasiado tiempo, por favor intenta nuevamente',
  },
} as const satisfies Record<string, ErrorDefinition>;

export type ErrorKey = keyof typeof ErrorCatalog;
