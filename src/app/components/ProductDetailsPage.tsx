import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { AlertCircle, ArrowLeft, CheckCircle, ChevronDown, HelpCircle, Loader2, Package, Shield, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

// GraphQL query to check customer approval status and get default address
const GET_CUSTOMER_INFO = gql`
  query getCustomerInfo($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
      phone
      tags
      defaultAddress {
        id
        firstName
        lastName
        address1
        address2
        city
        province
        provinceCode
        country
        countryCodeV2
        zip
        phone
      }
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
            firstName
            lastName
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

// GraphQL query to fetch single product by handle
const GET_PRODUCT = gql`
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
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
    maxVariantPrice: {
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

export function ProductDetailsPage() {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [selectedVariantId, setSelectedVariantId] = React.useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  
  // Collapsible sections state
  const [openSections, setOpenSections] = useState<{
    description: boolean;
    shipping: boolean;
    manufacturing: boolean;
  }>({
    description: false,
    shipping: true,
    manufacturing: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Get access token
  const getAccessToken = () => {
    return localStorage.getItem('pizza_auth_token');
  };
  
  const accessToken = getAccessToken();

  // Cart creation mutation with buyer identity
  const [createCart] = useMutation(CREATE_CART_WITH_BUYER);
  
  // Add delivery address to cart mutation
  const [addDeliveryAddress] = useMutation(ADD_DELIVERY_ADDRESS);
  
  // Check customer approval status and get customer info including address
  const { data: customerData, loading: customerLoading } = useQuery(GET_CUSTOMER_INFO, {
    variables: { customerAccessToken: accessToken || '' },
    skip: !accessToken || !isAuthenticated,
    errorPolicy: 'all',
  });

  // Redirect to account review page if not approved
  useEffect(() => {
    if (!authLoading && !customerLoading && isAuthenticated && customerData?.customer) {
      const customerTags = customerData.customer.tags || [];
      
      // Parse tags - Shopify Storefront API returns as array
      let tagsArray: string[] = [];
      if (Array.isArray(customerTags)) {
        tagsArray = customerTags;
      } else if (typeof customerTags === 'string') {
        tagsArray = customerTags.split(',').map((t: string) => t.trim());
      }
      
      const isApproved = tagsArray.some((tag: string) => tag.toLowerCase() === 'approved');
      
      if (!isApproved) {
        navigate('/account-under-review', { replace: true });
      }
    } else if (!authLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [authLoading, customerLoading, isAuthenticated, customerData, navigate]);

  const { loading, error, data } = useQuery(GET_PRODUCT, {
    variables: { handle: handle || '' },
    skip: !handle || !isAuthenticated || customerLoading || !customerData?.customer,
    errorPolicy: 'all',
  });

  // Function to handle checkout with customer association (automatic prefill)
  const handleCheckout = useCallback(async () => {
    if (!selectedVariantId || !accessToken) {
      setCheckoutError('Please select a variant and ensure you are logged in.');
      return;
    }

    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      // Get customer's default address for prefilling
      const defaultAddress = customerData?.customer?.defaultAddress;
      const customerEmail = customerData?.customer?.email;

      // Create cart with buyer identity using customerAccessToken
      // This associates the logged-in customer with the cart
      const { data: cartData } = await createCart({
        variables: {
          input: {
            lines: [
              {
                merchandiseId: selectedVariantId,
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
        setCheckoutError(errorMessages);
        setIsCheckingOut(false);
        return;
      }

      const cartId = cartData?.cartCreate?.cart?.id;
      let checkoutUrl = cartData?.cartCreate?.cart?.checkoutUrl;

      // Get customer's first name and last name (prioritize customer info over address)
      const customerFirstName = customerData?.customer?.firstName || '';
      const customerLastName = customerData?.customer?.lastName || '';
      const customerPhone = customerData?.customer?.phone || '';

      // Always try to add delivery address with customer info (even if no saved address)
      if (cartId && (defaultAddress || customerFirstName || customerLastName)) {
        try {
          const { data: addressData } = await addDeliveryAddress({
            variables: {
              cartId: cartId,
              addresses: [
                {
                  address: {
                    deliveryAddress: {
                      // Always use customer's name first, fallback to address name
                      firstName: customerFirstName || defaultAddress?.firstName || '',
                      lastName: customerLastName || defaultAddress?.lastName || '',
                      // Use address fields if available
                    //   address1: defaultAddress?.address1 || '',
                    //   address2: defaultAddress?.address2 || '',
                    //   city: defaultAddress?.city || '',
                    //   provinceCode: defaultAddress?.provinceCode || '',
                    //   countryCode: defaultAddress?.countryCodeV2 || 'US',
                    //   zip: defaultAddress?.zip || '',
                    //   phone: defaultAddress?.phone || customerPhone || '',
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
          console.warn('Could not prefill address:', addressErr);
        }
      }

      if (checkoutUrl) {
        // Redirect to Shopify checkout with customer info prefilled
        window.location.href = checkoutUrl;
      } else {
        setCheckoutError('Failed to create checkout. Please try again.');
        setIsCheckingOut(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setCheckoutError('An error occurred during checkout. Please try again.');
      setIsCheckingOut(false);
    }
  }, [selectedVariantId, accessToken, createCart, addDeliveryAddress, customerData]);

  // Set default selected variant when product loads
  React.useEffect(() => {
    if (data?.product?.variants?.edges && data.product.variants.edges.length > 0) {
      const defaultVariant = data.product.variants.edges.find(({ node }) => node.availableForSale) || data.product.variants.edges[0];
      if (defaultVariant) {
        setSelectedVariantId(defaultVariant.node.id);
      }
    }
  }, [data?.product]);

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

  // If not authenticated, will redirect (don't show product)
  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.product) {
    return (
      <div className="min-h-screen pt-20 bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Not Found</h2>
          <p className="text-slate-600 mb-4">
            {error?.message || 'The product you are looking for does not exist.'}
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const product: Product = data.product;
  const images = product.images.edges || [];
  const mainImage = images[selectedImageIndex]?.node?.url || images[0]?.node?.url || '';
  const minPrice = formatPrice(
    product.priceRange.minVariantPrice.amount,
    product.priceRange.minVariantPrice.currencyCode
  );
  const maxPrice = formatPrice(
    product.priceRange.maxVariantPrice.amount,
    product.priceRange.maxVariantPrice.currencyCode
  );
  
  // Get selected variant
  const selectedVariant = product.variants.edges.find(
    ({ node }) => node.id === selectedVariantId
  )?.node || product.variants.edges[0]?.node;
  
  const isAvailable = selectedVariant?.availableForSale ?? false;
  const selectedPrice = selectedVariant 
    ? formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode)
    : minPrice;

  // Clean HTML from description
  const cleanDescription = product.description?.replace(/<[^>]*>/g, '') || '';

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Header Section with Back Button */}
      <section className="relative py-12 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.button
            onClick={() => navigate('/shop')}
            whileHover={{ scale: 1.05, x: -4 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Shop</span>
          </motion.button>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="aspect-square rounded-xl overflow-hidden bg-slate-100 border-2 border-slate-200"
              >
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingCart className="w-24 h-24 text-slate-300" />
                  </div>
                )}
              </motion.div>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map(({ node: image }, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? 'border-blue-600 ring-2 ring-blue-200'
                          : 'border-slate-200 hover:border-blue-400'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.altText || `${product.title} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-xl p-8 border-2 border-slate-200 shadow-lg"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                  {product.title}
                </h1>

                {/* Price */}
                <div className="mb-6 pb-6 border-b-2 border-slate-200">
                  <span className="text-4xl md:text-5xl font-bold text-blue-600">{selectedPrice}</span>
                  {minPrice !== maxPrice && (
                    <p className="text-sm text-slate-500 mt-2">
                      Price range: {minPrice} - {maxPrice}
                    </p>
                  )}
                </div>

                {/* Availability Status */}
                {!isAvailable && (
                  <div className="mb-6 px-4 py-3 bg-red-50 border-2 border-red-200 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-600 font-semibold">Currently Out of Stock</span>
                  </div>
                )}

                {/* Variants Dropdown */}
                {product.variants.edges.length > 1 && (
                  <div className="mb-8">
                    <label htmlFor="variant-select" className="block text-xl font-semibold text-slate-900 mb-3">
                      Pack Options:
                    </label>
                    <div className="relative">
                      <select
                        id="variant-select"
                        value={selectedVariantId || ''}
                        onChange={(e) => {
                          const variantId = e.target.value;
                          if (variantId) {
                            setSelectedVariantId(variantId);
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

                {/* Checkout Error Message */}
                {checkoutError && (
                  <div className="mb-4 px-4 py-3 bg-red-50 border-2 border-red-200 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span className="text-red-600 text-sm font-medium">{checkoutError}</span>
                  </div>
                )}

                {/* Checkout Button */}
                <motion.button
                  onClick={handleCheckout}
                  disabled={!isAvailable || isCheckingOut}
                  whileHover={isAvailable && !isCheckingOut ? { scale: 1.02, boxShadow: '0 20px 40px rgba(37, 99, 235, 0.3)' } : {}}
                  whileTap={isAvailable && !isCheckingOut ? { scale: 0.98 } : {}}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg text-center transition-all flex items-center justify-center gap-3 mb-6 ${
                    isAvailable && !isCheckingOut
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Creating Checkout...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-6 h-6" />
                      Checkout Now
                    </>
                  )}
                </motion.button>

                {/* Collapsible Sections - Improved UI */}
                <div className="mt-6 pt-6 border-t-2 border-slate-200 space-y-3">
                  {/* Product Description Section */}
                  {cleanDescription && (
                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                      <button
                        onClick={() => toggleSection('description')}
                        className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-slate-50 to-white hover:from-blue-50/50 hover:to-white transition-all group"
                      >
                        <span className="text-base font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                          Product Description
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-500 group-hover:text-blue-600 transition-all duration-300 ${
                            openSections.description ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {openSections.description && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="p-5 pt-0 bg-white">
                            <div className="prose prose-slate max-w-none">
                              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {cleanDescription}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Shipping Section */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                    <button
                      onClick={() => toggleSection('shipping')}
                      className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-slate-50 to-white hover:from-blue-50/50 hover:to-white transition-all group"
                    >
                      <span className="text-base font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                        Shipping
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-500 group-hover:text-blue-600 transition-all duration-300 ${
                          openSections.shipping ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openSections.shipping && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 pt-0 bg-white">
                          <p className="text-sm text-slate-600 leading-relaxed">
                            We will work quickly to ship your order as soon as possible. Once your order has shipped, you will receive an email with further information. Delivery times vary depending on your location.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Manufacturing Section */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                    <button
                      onClick={() => toggleSection('manufacturing')}
                      className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-slate-50 to-white hover:from-blue-50/50 hover:to-white transition-all group"
                    >
                      <span className="text-base font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                        Manufacturing
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-500 group-hover:text-blue-600 transition-all duration-300 ${
                          openSections.manufacturing ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openSections.manufacturing && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 pt-0 bg-white">
                          <p className="text-sm text-slate-600 leading-relaxed">
                            Our products are manufactured both locally and globally. We carefully select our manufacturing partners to ensure our products are high quality and a fair value.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Product Features */}
                <div className="mt-8 pt-8 border-t-2 border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Product Features</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { icon: Package, text: 'Ready to Use' },
                      { icon: Shield, text: 'Quality Assured' },
                      { icon: CheckCircle, text: 'Compatible with Our Machines' },
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 text-slate-700">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <feature.icon className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="relative py-24 bg-blue-600">
        {/* Curved Top Wave Design */}
        <div className="absolute top-0 left-0 right-0 z-0">
          <svg className="w-full h-24" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 0L60 15C120 30 240 60 360 75C480 90 600 90 720 82.5C840 75 960 60 1080 52.5C1200 45 1320 45 1380 45L1440 45V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0Z" fill="#ffffff" />
          </svg>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
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
            <p className="text-xl text-blue-50 mb-8">
              Our enterprise technical support team is available 24/7 to assist you
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
