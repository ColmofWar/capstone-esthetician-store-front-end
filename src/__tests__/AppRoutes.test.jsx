import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from '../routes/AppRoutes';

// Mock all lazy-loaded components
jest.mock('../components/Home', () => () => <div>HomeMock</div>);
jest.mock('../components/Shop', () => () => <div>ShopMock</div>);
jest.mock('../components/Profile', () => () => <div>ProfileMock</div>);
jest.mock('../components/ShoppingCart', () => () => <div>CartMock</div>);
jest.mock('../components/ProductList', () => () => <div>ProductListMock</div>);
jest.mock('../components/CategoryList', () => () => <div>CategoryListMock</div>);
jest.mock('../components/AuthPage', () => () => <div>AuthPageMock</div>);

describe('AppRoutes', () => {
  it('renders Home on /', async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(await screen.findByText('HomeMock')).toBeInTheDocument();
  });

  it('renders Shop on /shop', async () => {
    render(
      <MemoryRouter initialEntries={["/shop"]}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(await screen.findByText('ShopMock')).toBeInTheDocument();
  });

  it('renders ProductList on /products', async () => {
    render(
      <MemoryRouter initialEntries={["/products"]}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(await screen.findByText('ProductListMock')).toBeInTheDocument();
  });

  it('renders CategoryList on /categories', async () => {
    render(
      <MemoryRouter initialEntries={["/categories"]}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(await screen.findByText('CategoryListMock')).toBeInTheDocument();
  });

  it('renders Profile on /profile', async () => {
    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(await screen.findByText('ProfileMock')).toBeInTheDocument();
  });

  it('renders AuthPage on /auth', async () => {
    render(
      <MemoryRouter initialEntries={["/auth"]}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(await screen.findByText('AuthPageMock')).toBeInTheDocument();
  });

  it('renders ShoppingCart on /cart', async () => {
    render(
      <MemoryRouter initialEntries={["/cart"]}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(await screen.findByText('CartMock')).toBeInTheDocument();
  });

  it('renders 404 on unknown route', async () => {
    render(
      <MemoryRouter initialEntries={["/notfound"]}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(await screen.findByText('404 Not Found')).toBeInTheDocument();
  });
});
