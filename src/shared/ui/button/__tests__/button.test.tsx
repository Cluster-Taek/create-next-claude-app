import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/shared/config/test';
import { Button } from '../button';

describe('Button', () => {
  it('children 텍스트를 렌더링한다', () => {
    renderWithProviders(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('클릭 이벤트를 처리한다', async () => {
    const handleClick = vi.fn();
    const { user } = renderWithProviders(<Button onClick={handleClick}>Click</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disabled 상태에서는 클릭되지 않는다', async () => {
    const handleClick = vi.fn();
    const { user } = renderWithProviders(
      <Button disabled onClick={handleClick}>
        Click
      </Button>
    );

    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('type 속성을 전달할 수 있다', () => {
    renderWithProviders(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});
