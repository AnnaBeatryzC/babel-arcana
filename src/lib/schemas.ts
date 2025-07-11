import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  senha: z.string().min(1, { message: 'A senha é obrigatória' }),
});

export const registerSchema = z.object({
  nome: z.string().min(1, { message: 'O nome é obrigatório' }),
  email: z.string().email({ message: 'E-mail inválido' }),
  senha: z.string().min(4, { message: 'A senha deve ter no mínimo 4 caracteres' }),
  confirmarSenha: z.string(),
}).refine(data => data.senha === data.confirmarSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarSenha'],
});
