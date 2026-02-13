import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
const Home = lazy(() => import('../components/Home'));
const Shop = lazy(() => import('../components/Shop'));
const Profile = lazy(() => import('../components/Profile'));
const ShoppingCart = lazy(() => import('../components/ShoppingCart'));
const ProductList = lazy(() => import('../components/ProductList'));
const CategoryList = lazy(() => import('../components/CategoryList'));
const AuthPage = lazy(() => import('../components/AuthPage'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />}/>
        <Route path="/products" element={<ProductList />} />
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/auth" element={<AuthPage onAuth={() => {}} />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Suspense>
  );
}
