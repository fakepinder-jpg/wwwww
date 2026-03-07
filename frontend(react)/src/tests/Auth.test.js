import { render, screen, fireEvent } from '@testing-library/react';
import Auth from '../pages/Auth';

test('renders Auth form and toggles signup/login', () => {
  render(<Auth onLogin={jest.fn()} />);
  
  expect(screen.getByText(/Se connecter/i)).toBeInTheDocument();

  fireEvent.click(screen.getByText(/S'inscrire/i));
  expect(screen.getByText(/Inscription/i)).toBeInTheDocument();
});
