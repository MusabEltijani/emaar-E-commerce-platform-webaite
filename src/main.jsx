import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { store } from './store/store.js'
import './i18n/i18n.js'
import './index.css'

// Get current direction from document or localStorage
const getDirection = () => {
  const savedLanguage = localStorage.getItem('language') || 'ar';
  return savedLanguage === 'ar' ? 'rtl' : 'ltr';
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <App />
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{
              direction: getDirection(),
            }}
            toastOptions={{
              // Default options
              className: '',
              duration: 3000,
              style: {
                background: '#fff',
                color: '#363636',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                padding: '12px 16px',
                fontSize: '14px',
                direction: getDirection(),
                maxWidth: '400px',
              },
              // Success styles
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
                style: {
                  background: '#fff',
                  color: '#363636',
                  border: '1px solid #10b981',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  padding: '12px 16px',
                  fontSize: '14px',
                  direction: getDirection(),
                  maxWidth: '400px',
                },
              },
              // Error styles
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
                style: {
                  background: '#fff',
                  color: '#363636',
                  border: '1px solid #ef4444',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  padding: '12px 16px',
                  fontSize: '14px',
                  direction: getDirection(),
                  maxWidth: '400px',
                },
              },
            }}
          />
        </HelmetProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
)

