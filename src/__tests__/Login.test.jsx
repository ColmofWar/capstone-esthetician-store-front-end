import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Login';
import UserContext from '../UserContext';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../api', () => ({
  apiRequest: jest.fn((endpoint) => {
    if (endpoint === '/auth/token') {
      return Promise.resolve({ token: btoa('header') + '.' + btoa(JSON.stringify({ username: 'testuser' })) + '.sig' });
    }
    if (endpoint.startsWith('/users/')) {
      return Promise.resolve({ username: 'testuser', email: 'test@example.com' });
    }
    return Promise.resolve({});
  })
}));

describe('Login', () => {
  it('renders and submits login form', async () => {
    const setToken = jest.fn();
    render(
      <MemoryRouter>
        <UserContext.Provider value={{ setToken }}>
          <Login />
        </UserContext.Provider>
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    await waitFor(() => expect(setToken).toHaveBeenCalled());
    expect(setToken.mock.calls[0][0]).toBeDefined();
  });

  it('shows error on failed login', async () => {
    const setToken = jest.fn();
    require('../api').apiRequest.mockImplementationOnce(() => Promise.reject(new Error('Login failed')));
    render(
      <MemoryRouter>
        <UserContext.Provider value={{ setToken }}>
          <Login />
        </UserContext.Provider>
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'baduser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'badpass' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    await screen.findByText(/login failed/i);
    expect(screen.getByText(/login failed/i)).toBeInTheDocument();
  });
});
