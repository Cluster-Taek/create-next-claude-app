import { getHypenNumber, getOnlyNumber } from '../utils/format';

describe('getHypenNumber', () => {
  it('11자리 숫자를 XXX-XXXX-XXXX 형식으로 변환한다', () => {
    expect(getHypenNumber('01012345678')).toBe('010-1234-5678');
  });

  it('이미 하이픈이 포함된 경우 그대로 반환한다', () => {
    expect(getHypenNumber('010-1234-5678')).toBe('010-1234-5678');
  });

  it('11자리 미만은 변환하지 않고 반환한다', () => {
    expect(getHypenNumber('0101234')).toBe('0101234');
  });

  it('빈 문자열은 빈 문자열을 반환한다', () => {
    expect(getHypenNumber('')).toBe('');
  });
});

describe('getOnlyNumber', () => {
  it('문자열에서 숫자만 추출한다', () => {
    expect(getOnlyNumber('010-1234-5678')).toBe('01012345678');
  });

  it('숫자가 없으면 빈 문자열을 반환한다', () => {
    expect(getOnlyNumber('abc')).toBe('');
  });

  it('순수 숫자 문자열은 그대로 반환한다', () => {
    expect(getOnlyNumber('12345')).toBe('12345');
  });
});
