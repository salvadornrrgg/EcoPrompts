import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || 500;

  const response: any = {
    success: false,
    status: statusCode,
    error: err.message || 'Erro interno do servidor.',
    timestamp: new Date().toISOString()
  };

  if (err.zodErrors) {
    response.fields = err.zodErrors.map((issue: any) => issue.path.join('.') || issue.message);
  }

  res.status(statusCode).json(response);
};
