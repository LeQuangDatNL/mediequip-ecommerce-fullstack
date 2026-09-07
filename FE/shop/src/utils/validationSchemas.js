import { z } from 'zod';

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'H? và tên ph?i t? 2 d?n 100 ký t?')
      .max(100, 'H? và tên t?i da 100 ký t?'),
    username: z
      .string()
      .trim()
      .min(3, 'Tên dang nh?p ph?i t? 3 d?n 50 ký t?')
      .max(50, 'Tên dang nh?p t?i da 50 ký t?')
      .regex(/^[a-zA-Z0-9._-]+$/, 'Tên dang nh?p ch? g?m ch? cái không d?u, s?, d?u ch?m (.), g?ch du?i (_) ho?c g?ch n?i (-)'),
    email: z
      .string()
      .trim()
      .min(1, 'Vui lòng nh?p d?a ch? email')
      .email('Email không dúng d?nh d?ng (VD: example@domain.com)'),
    phone: z
      .string()
      .trim()
      .optional()
      .refine(
        (val) => !val || /^(0[3|5|7|8|9])+([0-9]{8})$/.test(val),
        { message: 'S? di?n tho?i ph?i là s? di d?ng VN 10 ch? s? (VD: 0901234567)' }
      ),
    password: z
      .string()
      .min(6, 'M?t kh?u ph?i có ít nh?t 6 ký t?'),
    confirmPassword: z
      .string()
      .min(1, 'Vui lòng xác nh?n l?i m?t kh?u'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'M?t kh?u xác nh?n không trùng kh?p',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Tên dang nh?p không du?c d? tr?ng'),
  password: z.string().min(1, 'M?t kh?u không du?c d? tr?ng'),
});

