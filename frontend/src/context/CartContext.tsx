import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Cart } from '../types';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const EMPTY_CART: Cart = { id: 0, userId: 0, items: [], totalPrice: 0, totalItems: 0 };

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart] = useState<Cart | null>(EMPTY_CART);

  const noop = async () => {};

  return (
    <CartContext.Provider
      value={{
        cart,
        loading: false,
        addToCart: noop,
        updateQuantity: noop,
        removeFromCart: noop,
        clearCart: noop,
        refreshCart: noop,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
