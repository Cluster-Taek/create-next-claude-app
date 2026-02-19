import { act } from '@testing-library/react';
import { useModalStore } from '../useModalStore';

describe('useModalStore', () => {
  beforeEach(() => {
    act(() => {
      useModalStore.setState({
        openedModalIds: [],
        modalPropsMap: {},
      });
    });
  });

  it('초기 상태는 빈 배열과 빈 객체이다', () => {
    const state = useModalStore.getState();
    expect(state.openedModalIds).toEqual([]);
    expect(state.modalPropsMap).toEqual({});
  });

  it('openModal로 모달을 열 수 있다', () => {
    act(() => {
      useModalStore.getState().openModal('test-modal');
    });

    const state = useModalStore.getState();
    expect(state.openedModalIds).toContain('test-modal');
  });

  it('openModal에 props를 전달하면 modalPropsMap에 저장된다', () => {
    const props = { title: 'Test' };
    act(() => {
      useModalStore.getState().openModal('test-modal', props);
    });

    const state = useModalStore.getState();
    expect(state.modalPropsMap['test-modal']).toEqual(props);
  });

  it('closeModal로 특정 모달을 닫을 수 있다', () => {
    act(() => {
      useModalStore.getState().openModal('modal-1');
      useModalStore.getState().openModal('modal-2');
    });

    act(() => {
      useModalStore.getState().closeModal('modal-1');
    });

    const state = useModalStore.getState();
    expect(state.openedModalIds).toEqual(['modal-2']);
    expect(state.modalPropsMap['modal-1']).toBeUndefined();
  });

  it('closeModal로 props가 있는 모달을 닫으면 modalPropsMap에서도 제거된다', () => {
    act(() => {
      useModalStore.getState().openModal('modal-1', { title: 'A' });
      useModalStore.getState().openModal('modal-2', { title: 'B' });
    });

    act(() => {
      useModalStore.getState().closeModal('modal-1');
    });

    const state = useModalStore.getState();
    expect(state.modalPropsMap).toEqual({ 'modal-2': { title: 'B' } });
  });

  it('같은 ID로 openModal을 두 번 호출하면 중복으로 추가된다', () => {
    act(() => {
      useModalStore.getState().openModal('modal-1');
      useModalStore.getState().openModal('modal-1');
    });

    const state = useModalStore.getState();
    expect(state.openedModalIds).toEqual(['modal-1', 'modal-1']);
  });

  it('closeAllModals로 모든 모달을 닫을 수 있다', () => {
    act(() => {
      useModalStore.getState().openModal('modal-1', { data: 1 });
      useModalStore.getState().openModal('modal-2', { data: 2 });
    });

    act(() => {
      useModalStore.getState().closeAllModals();
    });

    const state = useModalStore.getState();
    expect(state.openedModalIds).toEqual([]);
    expect(state.modalPropsMap).toEqual({});
  });
});
