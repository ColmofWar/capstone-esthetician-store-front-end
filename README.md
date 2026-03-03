# Esthetician Store Front-End

[Live Site][(https://capstone-esthetician-store-front-end-1.onrender.com)]

## Overview
Esthetician Store is an e-commerce web application for beauty and skincare products. Users can browse products, filter by category or price, add items to their cart, sign up, log in, manage their profile and addresses, and complete purchases securely.

## Features
- **User Authentication:** Sign up, log in, and persistent sessions using context and local storage.
- **Product Catalog:** Browse all products, filter by category and price, and view product details.
- **Shopping Cart:** Add, update, and remove items; view cart summary and proceed to checkout.
- **Order Placement:** Review order summary and confirm purchase; cart is cleared after purchase. This is a partially complete feature as purchases are not finalized until a payment processor is added.
- **Profile Management:** Update profile info, shipping, and billing addresses with validation.
- **Form Validation:** Prevents bad requests and ensures data integrity for all forms.
- **Error Handling:** User-friendly error messages for failed actions or invalid input.
- **Responsive Design:** Usable on desktop and mobile devices.
- **Testing:** Unit and integration tests for components, hooks, and API logic.

These features were chosen to provide a complete, realistic e-commerce experience, focusing on usability, security, and robust user flows.

## Tests
- All tests are located in `src/__tests__/`.
- To run tests:
  1. Install dependencies: `npm install`
  2. Run tests: `npm test` or `npm run test`

## Standard User Flow
1. **Visit the Home Page:** Browse featured products or use filters to find items.
2. **Sign Up / Log In:** Create an account or log in to access cart and profile features.
3. **Add Products to Cart:** Select quantity and add desired products to your cart.
4. **View Cart:** Review items, update quantities, or remove products as needed.
5. **Checkout:** Click the purchase button to review your order summary and confirm purchase.
6. **Profile Management:** Update your profile, shipping, and billing addresses at any time.
7. **Order Confirmation:** After purchase, receive a confirmation and see your cart cleared.

## Technology Stack
- **React** (with Hooks & Context API)
- **Vite** (development/build tooling)
- **Jest** & **React Testing Library** (testing)
- **CSS** (modular component styles)
- **JavaScript (ES6+)**
- **REST API** (integration)

