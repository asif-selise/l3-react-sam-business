import { store } from '@/src/redux/store';
import { type ReactNode } from 'react';
import { Provider } from 'react-redux';

interface Props {
  children: ReactNode;
}

const StoreProvider = ({ children }: Props) => {
  return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
