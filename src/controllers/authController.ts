import { Request, Response } from "express";
import * as authService from "../services/authService";
import { loginSchema } from "../schemas/authSchema";

export const login = async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.issues });
  }

  try {
    const { email, password } = result.data;
    const authResult = await authService.login(email, password);
    res.json(authResult);
  } catch (error: any) {
    return res.status(401).json({ error: error.message });
  }
};