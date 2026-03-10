import { QueryProvider } from './QueryProvider';

interface ICoreProviderProps {
  children?: React.ReactNode;
}

export const CoreProvider = ({ children }: ICoreProviderProps) => {
  return <QueryProvider>{children}</QueryProvider>;
};
