import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { motion } from 'motion/react';
import { ShoppingCart, Loader2, AlertCircle, Mail, Phone, MessageCircle, HelpCircle, ChevronDown, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import vend1Image from '@/assets/vend1.png';

// GraphQL query to fetch products from Shopify
const GET_PRODUCTS = gql`
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

// GraphQL query to check customer approval status and get customer info
const GET_CUSTOMER_TAGS = gql`
  query getCustomerTags($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
      phone
      tags
    }
  }
`;

// GraphQL mutation to create cart with buyer identity (for automatic prefill)
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

interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
}

export function ShopifyProductsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { addToCart, saveCartSnapshot, cartItems } = useCart();
  const [selectedVariantIds, setSelectedVariantIds] = useState<Record<string, string>>({});
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null); // Track which product is checking out
  
  // Get access token
  const getAccessToken = () => {
    return localStorage.getItem('pizza_auth_token');
  };
  
  const accessToken = getAccessToken();
  
  // Check customer approval status
  const { data: customerData, loading: customerLoading } = useQuery(GET_CUSTOMER_TAGS, {
    variables: { customerAccessToken: accessToken || '' },
    skip: !accessToken || !isAuthenticated,
    errorPolicy: 'all',
  });

  const { loading, error, data } = useQuery(GET_PRODUCTS, {
    variables: { first: 50 },
    errorPolicy: 'all',
    skip: !isAuthenticated || customerLoading || !customerData?.customer, // Skip if not authenticated or checking approval
  });

  // Cart creation mutation with buyer identity
  const [createCart] = useMutation(CREATE_CART_WITH_BUYER);
  
  // Add delivery address to cart mutation
  const [addDeliveryAddress] = useMutation(ADD_DELIVERY_ADDRESS);

  // Function to handle checkout with customer association (automatic prefill)
  const handleCheckout = useCallback(async (product: Product, variantId?: string) => {
    if (!accessToken || !isAuthenticated) {
      navigate('/login');
      return;
    }

    const targetVariantId = variantId || selectedVariantIds[product.id] || product.variants?.edges[0]?.node?.id;
    if (!targetVariantId) {
      return;
    }

    setCheckoutLoading(product.id);
    
    try {
      const customerEmail = customerData?.customer?.email;

      // Create cart with buyer identity using customerAccessToken
      // This associates the logged-in customer with the cart
      const { data: cartData } = await createCart({
        variables: {
          input: {
            lines: [
              {
                merchandiseId: targetVariantId,
                quantity: 1,
              },
            ],
            // Associate the logged-in customer with the cart
            // This enables automatic prefill of customer details at checkout
            buyerIdentity: {
              customerAccessToken: accessToken,
              email: customerEmail,
            },
          },
        },
      });

      if (cartData?.cartCreate?.userErrors?.length > 0) {
        const errorMessages = cartData.cartCreate.userErrors
          .map((err: { message: string }) => err.message)
          .join(', ');
        console.error('Checkout error:', errorMessages);
        alert('Checkout error: ' + errorMessages);
        setCheckoutLoading(null);
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
        // Save cart snapshot before redirecting (for restoration if user returns without completing checkout)
        // This handles the case where user has items in cart and uses direct checkout
        // Save snapshot directly from current cartItems to ensure we capture the exact state
        try {
          if (cartItems.length > 0) {
            const snapshotData = cartItems.map(item => ({
              id: item.id,
              productId: item.productId,
              variantId: item.variantId,
              title: item.title,
              variantTitle: item.variantTitle,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
              handle: item.handle,
              availableForSale: item.availableForSale,
            }));
            localStorage.setItem('pizza_cart_snapshot', JSON.stringify(snapshotData));
            console.log('Cart snapshot saved:', snapshotData.length, 'items');
          }
        } catch (error) {
          console.error('Error saving cart snapshot:', error);
        }
        // Redirect to Shopify checkout with customer email and name auto-filled
        window.location.href = checkoutUrl;
      } else {
        console.error('Failed to create checkout');
        alert('Failed to create checkout. Please try again.');
        setCheckoutLoading(null);
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert('Failed to process checkout: ' + (error.message || 'Please try again.'));
      setCheckoutLoading(null);
    }
  }, [accessToken, isAuthenticated, customerData, createCart, addDeliveryAddress, selectedVariantIds, navigate, cartItems, saveCartSnapshot]);

  // Initialize selected variants when products load
  useEffect(() => {
    if (data?.products?.edges) {
      setSelectedVariantIds(prev => {
        const newSelectedVariants: Record<string, string> = { ...prev };
        let hasUpdates = false;
        
        data.products.edges.forEach(({ node: product }: { node: Product }) => {
          if (!newSelectedVariants[product.id] && product.variants?.edges?.length > 0) {
            // Set first available variant or first variant
            const availableVariant = product.variants.edges.find(({ node }) => node.availableForSale);
            newSelectedVariants[product.id] = (availableVariant || product.variants.edges[0])?.node?.id || '';
            hasUpdates = true;
          }
        });
        
        return hasUpdates ? newSelectedVariants : prev;
      });
    }
  }, [data?.products?.edges]);

  // Redirect to account review page if not approved
  useEffect(() => {
    if (!authLoading && !customerLoading && isAuthenticated && customerData?.customer) {
      const customerTags = customerData.customer.tags || [];
      
      // Debug: Log tags
      console.log('ShopifyProductsPage - Customer tags raw:', customerTags);
      
      // Parse tags - Shopify Storefront API returns as array
      let tagsArray: string[] = [];
      if (Array.isArray(customerTags)) {
        tagsArray = customerTags;
      } else if (typeof customerTags === 'string') {
        tagsArray = customerTags.split(',').map((t: string) => t.trim());
      }
      
      console.log('ShopifyProductsPage - Parsed tags:', tagsArray);
      const isApproved = tagsArray.some((tag: string) => tag.toLowerCase() === 'approved');
      console.log('ShopifyProductsPage - Is approved?', isApproved);
      
      if (!isApproved) {
        navigate('/account-under-review', { replace: true });
      }
    } else if (!authLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [authLoading, customerLoading, isAuthenticated, customerData, navigate]);

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

  // Show loading while checking authentication and approval
  if (authLoading || customerLoading || (isAuthenticated && !customerData)) {
    return (
      <div className="min-h-screen pt-20 bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, will redirect (don't show products)
  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('ShopifyProductsPage Error:', error);
    return (
      <div className="min-h-screen pt-20 bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Products</h2>
          <p className="text-slate-600 mb-4">{error.message || 'Failed to load products from Shopify'}</p>
          <pre className="text-xs text-slate-500 bg-slate-100 p-4 rounded mb-4 overflow-auto max-h-40">
            {JSON.stringify(error, null, 2)}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const products = (data as any)?.products?.edges || [];

  if (products.length === 0) {
    return (
      <div className="min-h-screen pt-20 bg-white flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No Products Available</h2>
          <p className="text-slate-600">There are no products to display at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Hero Section - Shop Banner */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-[#0f172a] rounded-b-[3rem]">
        {/* Attractive Background Design */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-[#2563eb] rounded-full"
          />
          <motion.div
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.08, 0.12, 0.08],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -bottom-1/4 -left-1/4 w-[700px] h-[700px] bg-[#3b82f6] rounded-full"
          />
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.06, 0.10, 0.06],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#60a5fa] rounded-full"
          />
        </div>

        {/* Curved Bottom Wave Design */}
        <div className="absolute bottom-0 left-0 right-0 z-0">
          <svg className="w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#ffffff" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-white"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full mb-6 backdrop-blur-sm"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-blue-200 font-medium text-sm">Shop Now & Save</span>
              </motion.div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 font-extrabold text-white leading-tight">
                Everything You Need for Your
                <br />
                <span className="text-blue-400">
                  Vending Machine
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl leading-relaxed">
                Shop premium accessories, replacement parts, and consumables. Fast shipping, competitive prices, and everything your machine needs to operate at peak performance.
              </p>

              {/* Key Features */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-sm text-slate-200">Fast Shipping</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-sm text-slate-200">Direct Checkout</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-sm text-slate-200">Quality Guaranteed</span>
                </div>
              </div>

              {/* Product Count Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 rounded-xl shadow-lg"
              >
                <ShoppingCart className="w-5 h-5 text-white" />
                <div>
                  <div className="text-2xl font-bold text-white">{products.length}</div>
                  <div className="text-xs text-blue-100">Products Ready to Ship</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative"
            >
              {/* Glow Effect Behind Image */}
              <div className="absolute inset-0 bg-blue-500/30 rounded-3xl blur-3xl -z-10" />
              
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <ImageWithFallback
                  src={vend1Image}
                  alt="Pizza Vending Machine Products"
                  className="w-full h-auto transform hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Floating Price Tag */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute -bottom-4 -right-4 px-6 py-4 bg-white rounded-2xl shadow-2xl border-2 border-blue-200 z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Shop & Checkout</div>
                    <div className="text-lg font-bold text-slate-900">In Minutes</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Section - Single Product Featured Layout or Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Single Product - Featured Layout */}
          {products.length === 1 ? (
            <div className="max-w-5xl mx-auto">
              {products.map(({ node: product }: { node: Product }, index: number) => {
                const imageUrl = product.images.edges[0]?.node.url || '';
                const imageAlt = product.images.edges[0]?.node.altText || product.title;
                // Get selected variant or default to first
                const selectedVariantId = selectedVariantIds[product.id] || product.variants?.edges[0]?.node?.id;
                const selectedVariant = product.variants?.edges?.find(({ node }) => node.id === selectedVariantId)?.node;
                
                const price = selectedVariant
                  ? formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode)
                  : product.priceRange?.minVariantPrice 
                    ? formatPrice(
                        product.priceRange.minVariantPrice.amount,
                        product.priceRange.minVariantPrice.currencyCode
                      )
                    : 'N/A';
                const isAvailable = selectedVariant?.availableForSale ?? false;
                const cleanDescription = product.description?.replace(/<[^>]*>/g, '') || '';
                const truncatedDescription = cleanDescription.length > 200 
                  ? cleanDescription.substring(0, 200) + '...' 
                  : cleanDescription;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden hover:border-blue-300 transition-all"
                  >
                    <div className="grid md:grid-cols-2 gap-8 p-8">
                      {/* Product Image */}
                      <div className="relative">
                        <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 border-2 border-slate-200">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={imageAlt}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingCart className="w-24 h-24 text-slate-300" />
                            </div>
                          )}
                        </div>
                        {!isAvailable && (
                          <div className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-full">
                            Out of Stock
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex flex-col justify-center space-y-6">
                        <div>
                          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            {product.title}
                          </h2>
                          <div className="text-4xl font-bold text-blue-600 mb-4">
                            {price}
                          </div>
                          {truncatedDescription && (
                            <p className="text-slate-600 leading-relaxed mb-6">
                              {truncatedDescription}
                            </p>
                          )}
                        </div>

                        {/* Variants Dropdown */}
                        {product.variants.edges.length > 1 && (
                          <div className="mb-6">
                            <label htmlFor={`variant-select-${product.id}`} className="block text-base font-semibold text-slate-900 mb-3">
                              Pack Options:
                            </label>
                            <div className="relative">
                              <select
                                id={`variant-select-${product.id}`}
                                value={selectedVariantId || ''}
                                onChange={(e) => {
                                  const variantId = e.target.value;
                                  if (variantId) {
                                    setSelectedVariantIds(prev => ({
                                      ...prev,
                                      [product.id]: variantId
                                    }));
                                  }
                                }}
                                className="w-full px-4 py-3.5 pr-10 bg-white border-2 border-slate-200 rounded-xl text-slate-900 font-medium appearance-none cursor-pointer hover:border-blue-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
                              >
                                {product.variants.edges.map(({ node: variant }) => {
                                  const isVariantAvailable = variant.availableForSale;
                                  const variantPrice = formatPrice(variant.price.amount, variant.price.currencyCode);
                                  const optionText = isVariantAvailable 
                                    ? `${variant.title} - ${variantPrice}`
                                    : `${variant.title} - ${variantPrice} (Out of Stock)`;
                                  
                                  return (
                                    <option 
                                      key={variant.id} 
                                      value={variant.id}
                                      disabled={!isVariantAvailable}
                                      className={!isVariantAvailable ? 'text-slate-400' : ''}
                                    >
                                      {optionText}
                                    </option>
                                  );
                                })}
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                            </div>
                            {selectedVariant && !selectedVariant.availableForSale && (
                              <p className="mt-2 text-sm text-red-600 font-medium">
                                ⚠️ This option is currently out of stock
                              </p>
                            )}
                          </div>
                        )}

                        {/* Add to Cart and Checkout Buttons */}
                        <div className="flex gap-3">
                          <motion.button
                            onClick={() => {
                              if (isAvailable && selectedVariant) {
                                const imageUrl = product.images.edges[0]?.node.url || '';
                                addToCart({
                                  productId: product.id,
                                  variantId: selectedVariantId || '',
                                  title: product.title,
                                  variantTitle: selectedVariant.title || 'Default',
                                  price: selectedVariant.price,
                                  quantity: 1,
                                  image: imageUrl,
                                  handle: product.handle,
                                  availableForSale: selectedVariant.availableForSale,
                                });
                              }
                            }}
                            disabled={!isAvailable || !selectedVariant}
                            whileHover={{ scale: isAvailable ? 1.02 : 1 }}
                            whileTap={{ scale: isAvailable ? 0.98 : 1 }}
                            className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg text-center transition-all flex items-center justify-center gap-3 ${
                              isAvailable && selectedVariant
                                ? 'bg-slate-700 text-white hover:bg-slate-800 shadow-lg'
                                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            <Plus className="w-6 h-6" />
                            Add to Cart
                          </motion.button>
                          
                          <motion.button
                            onClick={() => handleCheckout(product, selectedVariantId)}
                            disabled={!isAvailable || !selectedVariant || checkoutLoading === product.id}
                            whileHover={{ scale: isAvailable && !checkoutLoading ? 1.02 : 1, boxShadow: isAvailable && !checkoutLoading ? '0 20px 40px rgba(37, 99, 235, 0.3)' : undefined }}
                            whileTap={{ scale: isAvailable && !checkoutLoading ? 0.98 : 1 }}
                            className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg text-center transition-all flex items-center justify-center gap-3 ${
                              isAvailable && !checkoutLoading && selectedVariant
                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30'
                                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            {checkoutLoading === product.id ? (
                              <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-6 h-6" />
                                Checkout
                              </>
                            )}
                          </motion.button>
                        </div>

                        {/* View Details Link */}
                        <motion.button
                          onClick={() => navigate(`/shop/${product.handle}`)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-2 self-start"
                        >
                          View Full Details →
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* Multiple Products - Grid Layout */
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(({ node: product }: { node: Product }, index: number) => {
              const imageUrl = product.images.edges[0]?.node.url || '';
              const imageAlt = product.images.edges[0]?.node.altText || product.title;
              const price = product.priceRange?.minVariantPrice 
                ? formatPrice(
                    product.priceRange.minVariantPrice.amount,
                    product.priceRange.minVariantPrice.currencyCode
                  )
                : 'N/A';
              const isAvailable = product.variants?.edges[0]?.node?.availableForSale ?? false;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden hover:border-blue-600 transition-all hover:shadow-xl group cursor-pointer"
                  onClick={() => navigate(`/shop/${product.handle}`)}
                >
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={imageAlt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100">
                        <ShoppingCart className="w-16 h-16 text-slate-300" />
                      </div>
                    )}
                    {!isAvailable && (
                      <div className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded-full">
                        Out of Stock
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                      {product.title}
                    </h3>
                    
                    {product.description && (
                      <p className="text-slate-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                        {product.description.replace(/<[^>]*>/g, '').substring(0, 100)}...
                      </p>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-blue-600">{price}</span>
                    </div>

                    {/* Add to Cart and Checkout Buttons */}
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isAvailable) {
                            const selectedVariant = product.variants?.edges[0]?.node;
                            const variantId = selectedVariantIds[product.id] || selectedVariant?.id;
                            if (variantId && selectedVariant) {
                              addToCart({
                                productId: product.id,
                                variantId: variantId,
                                title: product.title,
                                variantTitle: selectedVariant.title || 'Default',
                                price: selectedVariant.price,
                                quantity: 1,
                                image: imageUrl,
                                handle: product.handle,
                                availableForSale: selectedVariant.availableForSale,
                              });
                            }
                          }
                        }}
                        disabled={!isAvailable}
                        whileHover={{ scale: isAvailable ? 1.02 : 1 }}
                        whileTap={{ scale: isAvailable ? 0.98 : 1 }}
                        className={`flex-1 py-3 px-4 rounded-lg font-semibold text-center transition-colors flex items-center justify-center gap-2 ${
                          isAvailable
                            ? 'bg-slate-700 text-white hover:bg-slate-800 shadow-lg'
                            : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </motion.button>
                      
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isAvailable) {
                            handleCheckout(product);
                          }
                        }}
                        disabled={!isAvailable || checkoutLoading === product.id}
                        whileHover={{ scale: isAvailable && !checkoutLoading ? 1.02 : 1 }}
                        whileTap={{ scale: isAvailable && !checkoutLoading ? 0.98 : 1 }}
                        className={`flex-1 py-3 px-4 rounded-lg font-semibold text-center transition-colors flex items-center justify-center gap-2 ${
                          isAvailable && !checkoutLoading
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                            : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {checkoutLoading === product.id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" />
                            Buy
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Need Help Section - Better Design like Manual Page */}
      <section className="relative py-24 bg-blue-600">
        {/* Curved Top Wave Design */}
        <div className="absolute top-0 left-0 right-0 z-0">
          <svg className="w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 0L60 15C120 30 240 60 360 75C480 90 600 90 720 82.5C840 75 960 60 1080 52.5C1200 45 1320 45 1380 45L1440 45V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0Z" fill="#ffffff" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-4xl md:text-5xl mb-6 text-white font-bold">Need Additional Support?</h2>
            <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">
              Our enterprise technical support team is available 24/7 to assist you with any questions about our products or orders
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                onClick={() => navigate('/contact')}
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-lg"
              >
                Contact Support
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
