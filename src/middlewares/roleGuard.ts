import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./authGuard";

export const requireUserType = (allowedTypes: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: "Não autenticado" });
      return;
    }
    if (!allowedTypes.includes(req.user.userType)) {
      res.status(403).json({ error: "Permissão negada (tipo de utilizador insuficiente)" });
      return;
    }
    next();
  };
};