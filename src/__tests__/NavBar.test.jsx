import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NavBar from '../components/NavBar';
import UserContext from '../UserContext';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../assets/CartIcon', () => ({ __esModule: true, default: (props) => <svg data-testid="mock-cart-icon" {...props} /> }));

describe('NavBar', () => {

  it('renders links and cart count for logged-out user', () => {
    render(
      <MemoryRouter>
        <UserContext.Provider value={{ currentUser: null }}>
          <NavBar cartCount={3} />
        </UserContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText(/skinn savvy/i)).toBeInTheDocument();
    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/shop/i)).toBeInTheDocument();
    // Profile link should NOT be present when logged out
    expect(screen.queryByText(/profile/i)).not.toBeInTheDocument();
    expect(screen.getByTestId('mock-cart-icon')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText(/login \/ signup/i)).toBeInTheDocument();
  });

  it('renders Profile link for logged-in user', () => {
    render(
      <MemoryRouter>
        <UserContext.Provider value={{ currentUser: { username: 'test' } }}>
          <NavBar cartCount={2} />
        </UserContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText(/profile/i)).toBeInTheDocument();
  });

  it('renders logout for logged in user and calls logout', () => {
    const setToken = jest.fn();
    const setCurrentUser = jest.fn();
    render(
      <MemoryRouter>
        <UserContext.Provider value={{ currentUser: { username: 'test' }, setToken, setCurrentUser }}>
          <NavBar cartCount={0} />
        </UserContext.Provider>
      </MemoryRouter>
    );
    const logoutBtn = screen.getByText(/logout/i);
    fireEvent.click(logoutBtn);
    expect(setToken).toHaveBeenCalledWith(null);
    expect(setCurrentUser).toHaveBeenCalledWith(null);
  });
});
