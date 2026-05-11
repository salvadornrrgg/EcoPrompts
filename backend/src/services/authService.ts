import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as userService from './userService';

const JWT_SECRET = process.env.JWT_SECRET || 'chave_temporaria';

export const login = async (email: string, password: string) => {
  // Usar o userService para encontrar o user
  const user = await userService.findUserByEmail(email);
  if (!user) throw new Error('User não encontrado');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Credenciais inválidas');

  const token = jwt.sign(
    { id: user.id, userType: user.userType },
    JWT_SECRET,
    { expiresIn: '2h' }
  );

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};