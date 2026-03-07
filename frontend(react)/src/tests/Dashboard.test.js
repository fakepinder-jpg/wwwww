import { render, screen } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';

test('renders Dashboard with no boards', () => {
  render(<Dashboard onOpenBoard={jest.fn()} />);
  expect(screen.getByText(/Aucun tableau pour le moment/i)).toBeInTheDocument();
});
