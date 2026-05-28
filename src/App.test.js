import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './redux/store';

test('renders registration form', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(screen.getByRole('heading', { name: /registration/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/company password/i)).toBeInTheDocument();
});
