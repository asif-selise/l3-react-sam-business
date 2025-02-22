import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Root from './modules/Root/Root';
import './configs/i18n.config';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import '../src/index.css';
import '../src/fonts.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Root />
    </Provider>
  </StrictMode>
);
