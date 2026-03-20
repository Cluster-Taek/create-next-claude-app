import { render, screen, fireEvent } from '@testing-library/react';
import { useModalStore } from '../../model/useModalStore';
import { Modal } from '../Modal';

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>,
  },
}));

vi.mock('@/shared/config', () => ({
  MOTION: { POP: {} },
}));

const TestModal = ({ onClose }: { onClose: () => void }) => (
  <div data-testid="test-modal">
    <button onClick={onClose}>닫기</button>
  </div>
);

const components = { 'test-modal': TestModal };

describe('Modal', () => {
  beforeEach(() => {
    useModalStore.setState({ openedModalIds: [], modalPropsMap: {} });
  });

  it('ESC 키를 누르면 최상위 모달이 닫힌다', () => {
    useModalStore.setState({
      openedModalIds: ['test-modal'],
      modalPropsMap: {},
    });

    render(<Modal components={components} />);
    expect(screen.getByTestId('test-modal')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(useModalStore.getState().openedModalIds).toEqual([]);
  });

  it('여러 모달이 열려있을 때 ESC는 마지막 모달만 닫는다', () => {
    const SecondModal = ({ onClose }: { onClose: () => void }) => (
      <div data-testid="second-modal">
        <button onClick={onClose}>닫기</button>
      </div>
    );

    const multiComponents = {
      'test-modal': TestModal,
      'second-modal': SecondModal,
    };

    useModalStore.setState({
      openedModalIds: ['test-modal', 'second-modal'],
      modalPropsMap: {},
    });

    render(<Modal components={multiComponents} />);
    fireEvent.keyDown(window, { key: 'Escape' });

    expect(useModalStore.getState().openedModalIds).toEqual(['test-modal']);
  });

  it('backdrop 클릭 시 해당 모달이 닫힌다', () => {
    useModalStore.setState({
      openedModalIds: ['test-modal'],
      modalPropsMap: {},
    });

    render(<Modal components={components} />);

    const backdrop = screen.getByTestId('modal-backdrop');
    fireEvent.click(backdrop);

    expect(useModalStore.getState().openedModalIds).toEqual([]);
  });

  it('모달이 열리면 role="dialog"와 aria-modal="true"가 설정된다', () => {
    useModalStore.setState({
      openedModalIds: ['test-modal'],
      modalPropsMap: {},
    });

    render(<Modal components={components} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });
});
