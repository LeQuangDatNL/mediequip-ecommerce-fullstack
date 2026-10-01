import React from 'react';
import { AuthProvider } from './hooks/useAuth';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3500,
              style: {
                fontSize: '13px',
                borderRadius: '12px',
                padding: '12px 16px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0',
              },
            }}
          />
          <AppRoutes />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
