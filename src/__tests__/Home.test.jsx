import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../components/Home';
import UserContext from '../UserContext';

describe('Home', () => {
  it('shows generic welcome if no user', () => {
    render(
      <UserContext.Provider value={{ currentUser: null }}>
        <Home />
      </UserContext.Provider>
    );
    expect(screen.getByText(/welcome to the home page/i)).toBeInTheDocument();
  });

  it('shows personalized welcome if user', () => {
    render(
      <UserContext.Provider value={{ currentUser: { username: 'testuser' } }}>
        <Home />
      </UserContext.Provider>
    );
    expect(screen.getByText(/welcome, testuser/i)).toBeInTheDocument();
  });
});
