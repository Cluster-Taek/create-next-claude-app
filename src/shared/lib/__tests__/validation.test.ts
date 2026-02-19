import { isEmpty } from '../utils/validation';

describe('isEmpty', () => {
  it('undefined는 비어있다고 판단한다', () => {
    expect(isEmpty(undefined)).toBe(true);
  });

  it('null은 비어있다고 판단한다', () => {
    expect(isEmpty(null)).toBe(true);
  });

  it('빈 문자열은 비어있다고 판단한다', () => {
    expect(isEmpty('')).toBe(true);
  });

  it('공백만 있는 문자열은 비어있다고 판단한다', () => {
    expect(isEmpty('   ')).toBe(true);
  });

  it('빈 배열은 비어있다고 판단한다', () => {
    expect(isEmpty([])).toBe(true);
  });

  it('빈 객체는 비어있다고 판단한다', () => {
    expect(isEmpty({})).toBe(true);
  });

  it('값이 있는 문자열은 비어있지 않다고 판단한다', () => {
    expect(isEmpty('hello')).toBe(false);
  });

  it('요소가 있는 배열은 비어있지 않다고 판단한다', () => {
    expect(isEmpty([1, 2])).toBe(false);
  });

  it('속성이 있는 객체는 비어있지 않다고 판단한다', () => {
    expect(isEmpty({ key: 'value' })).toBe(false);
  });

  it('숫자 0은 비어있지 않다고 판단한다', () => {
    expect(isEmpty(0)).toBe(false);
  });

  it('false는 비어있지 않다고 판단한다', () => {
    expect(isEmpty(false)).toBe(false);
  });

  it('NaN은 비어있지 않다고 판단한다', () => {
    expect(isEmpty(NaN)).toBe(false);
  });
});
