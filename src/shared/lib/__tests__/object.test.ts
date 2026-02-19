import { getClearObject } from '../utils/object';

describe('getClearObject', () => {
  it('undefined 값을 제거한다', () => {
    expect(getClearObject({ a: 1, b: undefined })).toEqual({ a: 1 });
  });

  it('null 값을 제거한다', () => {
    expect(getClearObject({ a: 'hello', b: null })).toEqual({ a: 'hello' });
  });

  it('undefined와 null 모두 제거한다', () => {
    expect(getClearObject({ a: 1, b: undefined, c: null, d: 'test' })).toEqual({ a: 1, d: 'test' });
  });

  it('제거할 값이 없으면 원본 객체와 동일한 결과를 반환한다', () => {
    expect(getClearObject({ a: 1, b: 'test' })).toEqual({ a: 1, b: 'test' });
  });

  it('빈 객체는 빈 객체를 반환한다', () => {
    expect(getClearObject({})).toEqual({});
  });

  it('0과 빈 문자열은 유지한다', () => {
    expect(getClearObject({ a: 0, b: '' })).toEqual({ a: 0, b: '' });
  });
});
