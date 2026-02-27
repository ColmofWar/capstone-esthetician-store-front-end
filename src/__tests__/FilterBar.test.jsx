import React from 'react';
import { render, screen } from '@testing-library/react';
import FilterBar from '../components/FilterBar';

jest.mock('../components/CategoryList', () => ({
  __esModule: true,
  default: ({ onSelectCategory, selectedCategory }) => (
    <div data-testid="mock-category-list">CategoryListMock</div>
  )
}));

jest.mock('../components/PriceRange', () => ({
  __esModule: true,
  default: ({ value, onChange, min, max }) => (
    <div data-testid="mock-price-range">PriceRangeMock</div>
  )
}));

describe('FilterBar', () => {
  it('renders CategoryList and PriceRange', () => {
    render(
      <FilterBar
        categories={[]}
        selectedCategory={null}
        onSelectCategory={() => {}}
        priceRange={[0, 100]}
        onPriceRangeChange={() => {}}
        min={0}
        max={100}
      />
    );
    expect(screen.getByTestId('mock-category-list')).toBeInTheDocument();
    expect(screen.getByTestId('mock-price-range')).toBeInTheDocument();
  });
});
