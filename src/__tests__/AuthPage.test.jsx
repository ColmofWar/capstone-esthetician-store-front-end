import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthPage from '../components/AuthPage';
import UserContext from '../UserContext';

describe('AuthPage', () => {
  const mockSetToken = jest.fn();
  function renderWithContext() {
    return render(
      <MemoryRouter>
        <UserContext.Provider value={{ setToken: mockSetToken }}>
          <AuthPage />
        </UserContext.Provider>
      </MemoryRouter>
    );
  }

  it('renders login and signup buttons', () => {
    renderWithContext();
    expect(screen.getAllByText(/login/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it('switches between login and signup views', () => {
    renderWithContext();
    const signupBtn = screen.getByText(/sign up/i);
    fireEvent.click(signupBtn);
    expect(signupBtn).toHaveStyle('background: #2196f3');
    const loginBtn = screen.getByText(/login/i);
    fireEvent.click(loginBtn);
    expect(loginBtn).toHaveStyle('background: #e91e63');
  });
});
