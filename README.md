# 🛍️ Emaar E-commerce Website

A complete React.js e-commerce website built with modern technologies, featuring Arabic/English support with RTL, and full integration with the Emaar E-commerce Platform Backend API.

## 🚀 Features

- ✅ User Authentication (Register, Login, Logout, Password Reset)
- ✅ Product Browsing with Filters and Search
- ✅ Shopping Cart Management
- ✅ Checkout Process
- ✅ Order Management and Tracking
- ✅ User Profile Management
- ✅ Arabic/English Support with RTL
- ✅ Responsive Design
- ✅ Modern UI with Tailwind CSS

## 🛠️ Technology Stack

- **React 18+** with Hooks
- **React Router v6** for routing
- **Redux Toolkit** for state management
- **React Query (TanStack Query)** for data fetching
- **React Hook Form + Zod** for form validation
- **Axios** for API calls
- **Tailwind CSS** for styling
- **i18next** for internationalization
- **React Toastify** for notifications

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=https://api.emaar-platform.com/api
VITE_APP_NAME=Emaar E-commerce
VITE_DEFAULT_LANGUAGE=ar
VITE_CURRENCY=SAR
VITE_CURRENCY_SYMBOL=ر.س
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable components (Button, Input, Card, etc.)
│   ├── layout/          # Layout components (Header, Footer, Layout)
│   ├── products/        # Product-related components
│   ├── cart/            # Cart components
│   └── orders/          # Order components
├── pages/               # Page components
├── services/api/        # API service functions
├── store/               # Redux store and slices
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── i18n/                # Internationalization files
└── App.jsx              # Main App component
```

## 🔑 Key Features

### Authentication
- User registration with phone and optional email
- Login with phone and password
- Password reset via OTP
- Token-based authentication with auto-refresh

### Products
- Browse products with pagination
- Filter by category, brand, and price
- Search functionality
- Product details with image gallery
- Related products

### Shopping Cart
- Add/remove items
- Update quantities
- Persistent cart
- Mini cart dropdown

### Checkout
- Order summary
- Shipping address form
- Payment method selection
- Order confirmation

### Orders
- View order history
- Filter by status
- Order details with status timeline
- Receipt upload for pending payments

### Profile
- Update profile information
- Change password
- Upload profile image
- Language preference

## 🌍 Internationalization

The app supports Arabic and English with automatic RTL/LTR switching. Language preference is saved in localStorage.

## 🔒 Protected Routes

Certain routes require authentication:
- `/checkout`
- `/orders`
- `/orders/:id`
- `/profile`

## 📝 API Integration

All API endpoints are configured in `src/services/api/`. The axios instance includes:
- Automatic token injection
- Token refresh on 401 errors
- Error handling and notifications

## 🎨 Styling

The project uses Tailwind CSS for styling. Custom colors and configurations are in `tailwind.config.js`.

## 🚢 Deployment

The project can be deployed to:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Any static hosting service

Make sure to set environment variables in your deployment platform.

## 📄 License

This project is part of the Emaar E-commerce Platform.

