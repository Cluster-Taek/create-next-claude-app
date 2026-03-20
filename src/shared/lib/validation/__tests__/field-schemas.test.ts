import { emailSchema, passwordSchema, nameSchema } from '../field-schemas';

describe('emailSchema', () => {
  it('유효한 이메일을 통과시킨다', () => {
    expect(emailSchema.safeParse('user@example.com').success).toBe(true);
  });

  it('빈 문자열은 필수값 에러를 반환한다', () => {
    const result = emailSchema.safeParse('');
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain('이메일');
  });

  it('@ 없는 문자열은 형식 에러를 반환한다', () => {
    expect(emailSchema.safeParse('invalid-email').success).toBe(false);
  });

  it('도메인 없는 이메일은 실패한다', () => {
    expect(emailSchema.safeParse('user@').success).toBe(false);
  });
});

describe('passwordSchema', () => {
  it('비어있지 않은 문자열을 통과시킨다', () => {
    expect(passwordSchema.safeParse('1234').success).toBe(true);
  });

  it('빈 문자열은 필수값 에러를 반환한다', () => {
    const result = passwordSchema.safeParse('');
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain('비밀번호');
  });
});

describe('nameSchema', () => {
  it('2~50자 이름을 통과시킨다', () => {
    expect(nameSchema.safeParse('홍길동').success).toBe(true);
  });

  it('1자는 최소 길이 에러를 반환한다', () => {
    const result = nameSchema.safeParse('홍');
    expect(result.success).toBe(false);
  });

  it('빈 문자열은 필수값 에러를 반환한다', () => {
    const result = nameSchema.safeParse('');
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain('이름');
  });

  it('51자 이상은 최대 길이 에러를 반환한다', () => {
    const result = nameSchema.safeParse('가'.repeat(51));
    expect(result.success).toBe(false);
  });
});
