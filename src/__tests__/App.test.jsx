import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

describe('App', () => {
  it('renders without crashing and shows main content', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    // Wait for a known element/text to appear after loading
    const elements = await screen.findAllByText(/shop|login|sign up|home/i);
    expect(elements.length).toBeGreaterThan(0);
  });
});
