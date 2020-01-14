
export const db = process.env.DB_HOST || 'mongodb://localhost/turnos';

export const port = process.env.PORT || '3000';

export const production = process.env.NODE_ENV === 'production';

export const debugMode = false