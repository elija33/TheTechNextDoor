import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart } from '../types';
import { cartApi } from '../services/api';

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

// For demo purposes, we'll use a fixed user ID
const DEMO_USER_ID = 1;

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshCart = async () => {
    try {
      const response = await cartApi.get(DEMO_USER_ID);
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      // Initialize empty cart if user doesn't exist yet
      setCart({
        id: 0,
        userId: DEMO_USER_ID,
        items: [],
        totalPrice: 0,
        totalItems: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      const response = await cartApi.addItem(DEMO_USER_ID, productId, quantity);
      setCart(response.data);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      const response = await cartApi.updateItem(DEMO_USER_ID, productId, quantity);
      setCart(response.data);
    } catch (error) {
      console.error('Failed to update cart item:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      const response = await cartApi.removeItem(DEMO_USER_ID, productId);
      setCart(response.data);
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clear(DEMO_USER_ID);
      setCart({
        id: cart?.id || 0,
        userId: DEMO_USER_ID,
        items: [],
        totalPrice: 0,
        totalItems: 0,
      });
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
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
