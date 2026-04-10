import { z } from 'zod';
import { REGEX } from '@/shared/config/regex';
import { VALIDATION_MESSAGES } from './validation-messages';

/**
 * 재사용 가능한 필드 스키마 정의
 */

export const emailSchema = z
  .string()
  .min(1, VALIDATION_MESSAGES.required('이메일'))
  .regex(REGEX.EMAIL, VALIDATION_MESSAGES.email.invalid);

export const passwordSchema = z.string().min(1, VALIDATION_MESSAGES.required('비밀번호'));

export const nameSchema = z
  .string()
  .min(1, VALIDATION_MESSAGES.required('이름'))
  .min(2, VALIDATION_MESSAGES.name.min(2))
  .max(50, VALIDATION_MESSAGES.name.max(50));
