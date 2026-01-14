import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

// Cart Item Interface
export interface CartItem {
  id: string; // Unique cart item ID (productId_variantId)
  productId: string;
  variantId: string;
  title: string;
  variantTitle: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  quantity: number;
  image?: string;
  handle: string;
  availableForSale: boolean;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  saveCartSnapshot: () => void;
  clearCartSnapshot: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'pizza_cart_items';
const CART_SNAPSHOT_KEY = 'pizza_cart_snapshot';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);

  // Load cart from localStorage on mount and restore from snapshot if needed
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const items = JSON.parse(stored) as CartItem[];
        setCartItems(items);
        setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
      } else {
        // If cart is empty, check for snapshot (user returned from checkout without completing)
        const snapshot = localStorage.getItem(CART_SNAPSHOT_KEY);
        if (snapshot) {
          try {
            const snapshotItems = JSON.parse(snapshot) as CartItem[];
            if (snapshotItems && snapshotItems.length > 0) {
              console.log('Restoring cart from snapshot:', snapshotItems.length, 'items');
              // Restore cart from snapshot
              setCartItems(snapshotItems);
              setCartCount(snapshotItems.reduce((sum, item) => sum + item.quantity, 0));
              // Save restored cart to localStorage
              localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(snapshotItems));
              // Clear snapshot after restoring
              localStorage.removeItem(CART_SNAPSHOT_KEY);
              console.log('Cart restored successfully from snapshot');
            } else {
              // Empty snapshot, remove it
              localStorage.removeItem(CART_SNAPSHOT_KEY);
            }
          } catch (error) {
            console.error('Error restoring cart from snapshot:', error);
            // Clear invalid snapshot
            localStorage.removeItem(CART_SNAPSHOT_KEY);
          }
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      setCartCount(cartItems.reduce((sum, item) => sum + item.quantity, 0));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = useCallback((item: Omit<CartItem, 'id'>) => {
    const itemId = `${item.productId}_${item.variantId}`;
    
    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(i => i.id === itemId);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        const updated = [...prev];
        updated[existingItemIndex] = {
          ...updated[existingItemIndex],
          quantity: updated[existingItemIndex].quantity + item.quantity,
        };
        return updated;
      } else {
        // Add new item
        return [...prev, { ...item, id: itemId }];
      }
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  const getTotalPrice = useCallback((): number => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.amount);
      return total + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const getTotalItems = useCallback((): number => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  // Save current cart state as snapshot before redirecting to checkout
  const saveCartSnapshot = useCallback(() => {
    try {
      if (cartItems.length > 0) {
        localStorage.setItem(CART_SNAPSHOT_KEY, JSON.stringify(cartItems));
      }
    } catch (error) {
      console.error('Error saving cart snapshot:', error);
    }
  }, [cartItems]);

  // Clear cart snapshot (called after successful checkout or when no longer needed)
  const clearCartSnapshot = useCallback(() => {
    try {
      localStorage.removeItem(CART_SNAPSHOT_KEY);
    } catch (error) {
      console.error('Error clearing cart snapshot:', error);
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        saveCartSnapshot,
        clearCartSnapshot,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
