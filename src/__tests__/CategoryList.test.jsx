import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CategoryList from '../components/CategoryList';

jest.mock('../api', () => ({
  apiRequest: jest.fn(() => Promise.resolve({ categories: [
    { id: 1, name: 'Skincare' },
    { id: 2, name: 'Makeup' },
  ] }))
}));

describe('CategoryList', () => {
  let originalError;
  beforeAll(() => {
    originalError = console.error;
    console.error = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('not wrapped in act')) return;
      originalError(...args);
    };
  });
  afterAll(() => {
    console.error = originalError;
  });
  it('renders loading state initially', () => {
    render(<CategoryList onSelectCategory={() => {}} />);
    expect(screen.getByText(/loading categories/i)).toBeInTheDocument();
  });

  it('renders categories and handles selection', async () => {
    const handleSelect = jest.fn();
    await act(async () => {
      render(<CategoryList onSelectCategory={handleSelect} selectedCategory={null} />);
    });
    // Wait for categories to load
    const skincareBtn = await screen.findByText('Skincare');
    const makeupBtn = await screen.findByText('Makeup');
    expect(skincareBtn).toBeInTheDocument();
    expect(makeupBtn).toBeInTheDocument();
    fireEvent.click(skincareBtn);
    expect(handleSelect).toHaveBeenCalledWith({ id: 1, name: 'Skincare' });
  });
});
