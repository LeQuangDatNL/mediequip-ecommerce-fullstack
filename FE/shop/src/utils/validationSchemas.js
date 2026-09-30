import { z } from 'zod';

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
      .max(100, 'Họ và tên không được vượt quá 100 ký tự'),
    username: z
      .string()
      .trim()
      .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
      .max(50, 'Tên đăng nhập không được vượt quá 50 ký tự')
      .regex(
        /^[a-zA-Z0-9_.-]+$/,
        'Tên đăng nhập chỉ bao gồm chữ cái không dấu, chữ số và các ký tự _ . -'
      ),
    email: z
      .string()
      .trim()
      .min(1, 'Email không được để trống')
      .email('Định dạng email không hợp lệ (ví dụ: name@example.com)'),
    phone: z
      .string()
      .trim()
      .refine(
        (val) => !val || /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(val),
        'Số điện thoại không hợp lệ (gồm 10 số di động Việt Nam)'
      )
      .optional()
      .or(z.literal('')),
    password: z
      .string()
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
      .max(100, 'Mật khẩu tối đa 100 ký tự'),
    confirmPassword: z
      .string()
      .min(1, 'Vui lòng nhập lại mật khẩu xác nhận'),
    otp: z
      .string()
      .trim()
      .optional()
      .or(z.literal('')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không trùng khớp',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Tên đăng nhập hoặc email không được để trống'),
  password: z
    .string()
    .min(1, 'Mật khẩu không được để trống'),
  captchaId: z.string().optional(),
  captchaAnswer: z.string().optional(),
});

export const profileUpdateSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ và tên không được vượt quá 100 ký tự'),
  email: z
    .string()
    .trim()
    .min(1, 'Email không được để trống')
    .email('Định dạng email không hợp lệ (ví dụ: name@example.com)'),
  phone: z
    .string()
    .trim()
    .refine(
      (val) => !val || /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(val),
      'Số điện thoại không hợp lệ (gồm 10 số di động Việt Nam)'
    )
    .optional()
    .or(z.literal('')),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Vui lòng nhập mật khẩu hiện tại'),
    newPassword: z
      .string()
      .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
      .max(100, 'Mật khẩu tối đa 100 ký tự'),
    confirmNewPassword: z
      .string()
      .min(1, 'Vui lòng xác nhận mật khẩu mới'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Xác nhận mật khẩu mới không trùng khớp',
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'Mật khẩu mới không được trùng với mật khẩu hiện tại',
    path: ['newPassword'],
  });