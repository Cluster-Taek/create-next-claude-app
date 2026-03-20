import { z } from 'zod';
import { fetchApi } from '@/shared/api';
import { type User, type UsersParams, type UserCreateFormValues, userSchema } from '../model/schemas';

/**
 * 사용자 목록 조회
 */
export const fetchUsers = async (params: UsersParams): Promise<User[]> => {
  const response = await fetchApi.get<User[]>(`/api/users`, params);
  return z.array(userSchema).parse(response);
};

/**
 * 사용자 생성
 */
export const createUser = async (data: UserCreateFormValues): Promise<User> => {
  const response = await fetchApi.post(`/api/users`, data);
  return userSchema.parse(response);
};
