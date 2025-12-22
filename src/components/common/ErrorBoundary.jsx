import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          We're sorry, but something unexpected happened. Please try again.
        </p>
        {error && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 mb-2">
              Error details
            </summary>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
        <button
          onClick={resetErrorBoundary}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <FiRefreshCw className="w-5 h-5" />
          Try again
        </button>
      </div>
    </div>
  );
}

function AppErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // Log error to error tracking service (e.g., Sentry, LogRocket)
        // In production, send to error tracking service instead of console
        if (import.meta.env.DEV) {
          console.error('Error caught by boundary:', error, errorInfo);
        }
      }}
      onReset={() => {
        // Reset app state if needed
        window.location.href = '/';
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export default AppErrorBoundary;

