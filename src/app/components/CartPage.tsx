import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';

// GraphQL query to get customer info
const GET_CUSTOMER_INFO = gql`
  query getCustomerInfo($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
      phone
    }
  }
`;

// GraphQL mutation to create cart with buyer identity
const CREATE_CART_WITH_BUYER = gql`
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        buyerIdentity {
          email
          customer {
            id
            email
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// GraphQL mutation to add delivery address to cart
const ADD_DELIVERY_ADDRESS = gql`
  mutation cartDeliveryAddressesAdd($cartId: ID!, $addresses: [CartSelectableAddressInput!]!) {
    cartDeliveryAddressesAdd(cartId: $cartId, addresses: $addresses) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const [checkoutError, setCheckoutError] = React.useState<string | null>(null);
  
  // Get access token
  const getAccessToken = () => {
    return localStorage.getItem('pizza_auth_token');
  };

  const accessToken = getAccessToken();
  
  const [createCart] = useMutation(CREATE_CART_WITH_BUYER);
  const [addDeliveryAddress] = useMutation(ADD_DELIVERY_ADDRESS);

  // Get customer info for name prefill
  const { data: customerData } = useQuery(GET_CUSTOMER_INFO, {
    variables: { customerAccessToken: accessToken || '' },
    skip: !accessToken || !isAuthenticated,
    errorPolicy: 'all',
  });

  // Format price
  const formatPrice = (amount: string, currencyCode: string): string => {
    try {
      const price = parseFloat(amount);
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
      }).format(price);
    } catch (err) {
      console.error('Error formatting price:', err);
      return amount;
    }
  };

  // Handle checkout
  const handleCheckout = useCallback(async () => {
    if (cartItems.length === 0) {
      setCheckoutError('Your cart is empty.');
      return;
    }

    if (!isAuthenticated || !accessToken) {
      navigate('/login');
      return;
    }

    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      // Prepare cart lines
      const lines = cartItems.map(item => ({
        merchandiseId: item.variantId,
        quantity: item.quantity,
      }));

      // Create cart with buyer identity
      const { data: cartData } = await createCart({
        variables: {
          input: {
            lines,
            buyerIdentity: {
              customerAccessToken: accessToken,
            },
          },
        },
      });

      if (cartData?.cartCreate?.userErrors?.length > 0) {
        const errorMessages = cartData.cartCreate.userErrors
          .map((err: { message: string }) => err.message)
          .join(', ');
        setCheckoutError(errorMessages);
        setIsCheckingOut(false);
        return;
      }

      const cartId = cartData?.cartCreate?.cart?.id;
      let checkoutUrl = cartData?.cartCreate?.cart?.checkoutUrl;

      // Get customer's first name and last name for name prefill
      const customerFirstName = customerData?.customer?.firstName || '';
      const customerLastName = customerData?.customer?.lastName || '';

      // Add delivery address with customer name for auto-fill
      if (cartId && (customerFirstName || customerLastName)) {
        try {
          const { data: addressData } = await addDeliveryAddress({
            variables: {
              cartId: cartId,
              addresses: [
                {
                  address: {
                    deliveryAddress: {
                      firstName: customerFirstName || '',
                      lastName: customerLastName || '',
                    },
                  },
                  selected: true, // Pre-select this address
                },
              ],
            },
          });

          // Use the updated checkout URL if available
          if (addressData?.cartDeliveryAddressesAdd?.cart?.checkoutUrl) {
            checkoutUrl = addressData.cartDeliveryAddressesAdd.cart.checkoutUrl;
          }

          // Log any address errors but don't block checkout
          if (addressData?.cartDeliveryAddressesAdd?.userErrors?.length > 0) {
            console.warn('Address prefill warning:', addressData.cartDeliveryAddressesAdd.userErrors);
          }
        } catch (addressErr) {
          // Don't block checkout if address prefill fails, just log it
          console.warn('Could not prefill customer name:', addressErr);
        }
      }

      if (checkoutUrl) {
        // Clear cart after successful checkout creation
        clearCart();
        // Redirect to Shopify checkout with customer email and name auto-filled
        window.location.href = checkoutUrl;
      } else {
        setCheckoutError('Failed to create checkout. Please try again.');
        setIsCheckingOut(false);
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      setCheckoutError(error.message || 'Failed to process checkout. Please try again.');
      setIsCheckingOut(false);
    }
  }, [cartItems, isAuthenticated, accessToken, createCart, addDeliveryAddress, customerData, clearCart, navigate]);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <ShoppingCart className="w-24 h-24 text-slate-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Your Cart is Empty</h2>
            <p className="text-slate-600 mb-8">Add some products to get started!</p>
            <motion.button
              onClick={() => navigate('/shop')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Continue Shopping
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  const totalPrice = getTotalPrice();
  const currencyCode = cartItems[0]?.price.currencyCode || 'USD';

  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Shopping Cart</h1>
            <p className="text-slate-600 mt-2">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
          </div>
          <motion.button
            onClick={() => navigate('/shop')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </motion.button>
        </div>

        {/* Error Message */}
        {checkoutError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Checkout Error</h3>
              <p className="text-red-700 text-sm">{checkoutError}</p>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-blue-300 transition-all"
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div
                    className="w-24 h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                    onClick={() => navigate(`/shop/${item.handle}`)}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="w-8 h-8 text-slate-300" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-lg font-semibold text-slate-900 mb-1 cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => navigate(`/shop/${item.handle}`)}
                    >
                      {item.title}
                    </h3>
                    {item.variantTitle && (
                      <p className="text-sm text-slate-600 mb-2">{item.variantTitle}</p>
                    )}
                    {!item.availableForSale && (
                      <p className="text-sm text-red-600 font-medium mb-2">Out of Stock</p>
                    )}
                    <p className="text-xl font-bold text-blue-600 mb-4">
                      {formatPrice(item.price.amount, item.price.currencyCode)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 border-2 border-slate-200 rounded-lg">
                        <motion.button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </motion.button>
                        <span className="px-4 py-2 font-semibold text-slate-900 min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <motion.button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </motion.button>
                      </div>

                      <motion.button
                        onClick={() => removeFromCart(item.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-bold text-slate-900">
                      {formatPrice(
                        (parseFloat(item.price.amount) * item.quantity).toString(),
                        item.price.currencyCode
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6 sticky top-24"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Order Summary</h2>

              {/* Subtotal */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    {formatPrice(totalPrice.toString(), currencyCode)}
                  </span>
                </div>
                <div className="border-t border-slate-300 pt-4">
                  <div className="flex justify-between text-xl font-bold text-slate-900">
                    <span>Total</span>
                    <span className="text-blue-600">
                      {formatPrice(totalPrice.toString(), currencyCode)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <motion.button
                onClick={handleCheckout}
                disabled={isCheckingOut || cartItems.some(item => !item.availableForSale)}
                whileHover={{ scale: isCheckingOut ? 1 : 1.02 }}
                whileTap={{ scale: isCheckingOut ? 1 : 0.98 }}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg text-center transition-all flex items-center justify-center gap-3 ${
                  isCheckingOut || cartItems.some(item => !item.availableForSale)
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30'
                }`}
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-6 h-6" />
                    Proceed to Checkout
                  </>
                )}
              </motion.button>

              {cartItems.some(item => !item.availableForSale) && (
                <p className="mt-4 text-sm text-red-600 text-center">
                  Please remove out of stock items to proceed
                </p>
              )}

              {/* Clear Cart Button */}
              <motion.button
                onClick={clearCart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 py-2 px-4 text-slate-600 hover:text-red-600 font-medium text-sm transition-colors"
              >
                Clear Cart
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
