import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ChevronDown, User, ShoppingCart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import logo from '@/assets/pizza-anytime-logo.svg';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, customer } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [aboutUsOpen, setAboutUsOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [mobileAboutUsOpen, setMobileAboutUsOpen] = useState(false);

  // Helper function to check if current path matches
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 backdrop-blur-xl bg-white/95 shadow-sm">
      <nav className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 w-full">
          {/* Logo */}
          <motion.div
            className="flex items-center cursor-pointer py-2"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.02 }}
          >
            <img src={logo} alt="Pizza Anytime Logo" className="w-auto object-contain h-[8.125rem] sm:h-[8.625rem] md:h-[9.125rem]" />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            {/* 1. Home */}
            <motion.button
              onClick={() => navigate("/")}
              whileHover={{ 
                scale: 1.02,
                color: "#2563eb"
              }}
              whileTap={{ scale: 0.98 }}
              className={`relative px-3 py-2 rounded-lg transition-all font-medium ${isActive("/") ? "text-blue-600" : "text-slate-700 hover:text-blue-600"}`}
            >
              <motion.div
                className="absolute inset-0 bg-blue-50 rounded-lg z-0"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
              <span className="relative z-10">Home</span>
              {isActive("/") && (
                <motion.div
                  className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-blue-600 z-20 rounded-full"
                  layoutId="activeTab"
                />
              )}
            </motion.button>

            {/* 2. Product Information */}
            <motion.button
              onClick={() => navigate("/product")}
              whileHover={{ 
                scale: 1.02,
                color: "#2563eb"
              }}
              whileTap={{ scale: 0.98 }}
              className={`relative px-3 py-2 rounded-lg transition-all font-medium whitespace-nowrap ${isActive("/product") ? "text-blue-600" : "text-slate-700 hover:text-blue-600"}`}
            >
              <motion.div
                className="absolute inset-0 bg-blue-50 rounded-lg z-0"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
              <span className="relative z-10 text-sm xl:text-base">Product Information</span>
              {isActive("/product") && (
                <motion.div
                  className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-blue-600 z-20 rounded-full"
                  layoutId="activeTab"
                />
              )}
            </motion.button>

            {/* 3. About Us Dropdown */}
            <div className="relative">
              <motion.button
                onMouseEnter={() => setAboutUsOpen(true)}
                whileHover={{ 
                  scale: 1.02,
                  color: "#2563eb"
                }}
                whileTap={{ scale: 0.98 }}
              className={`relative flex items-center gap-1 px-3 py-2 rounded-lg transition-all font-medium whitespace-nowrap ${aboutUsOpen ? "text-blue-600" : "text-slate-700 hover:text-blue-600"}`}
            >
              <motion.div
                className="absolute inset-0 bg-blue-50 rounded-lg z-0"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
              <span className="relative z-10 text-sm xl:text-base">About Us</span>
                <ChevronDown className="w-4 h-4 relative z-10" />
              </motion.button>

              <AnimatePresence>
                {aboutUsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    onMouseLeave={() => setAboutUsOpen(false)}
                    className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden"
                  >
                    <motion.button
                      onClick={() => {
                        navigate("/company");
                        setAboutUsOpen(false);
                      }}
                      whileHover={{ 
                        x: 4,
                        backgroundColor: "#f1f5f9"
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="block w-full text-left px-4 py-3 text-slate-700 transition-all hover:text-blue-600"
                    >
                      Company Page
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        navigate("/why-pizza-anytime");
                        setAboutUsOpen(false);
                      }}
                      whileHover={{ 
                        x: 4,
                        backgroundColor: "#f1f5f9"
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="block w-full text-left px-4 py-3 text-slate-700 transition-all hover:text-blue-600"
                    >
                      Why Pizza Anytime
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        navigate("/onsite-support");
                        setAboutUsOpen(false);
                      }}
                      whileHover={{ 
                        x: 4,
                        backgroundColor: "#f1f5f9"
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="block w-full text-left px-4 py-3 text-slate-700 transition-all hover:text-blue-600"
                    >
                      Onsite Support
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        navigate("/privacy-terms");
                        setAboutUsOpen(false);
                      }}
                      whileHover={{ 
                        x: 4,
                        backgroundColor: "#f1f5f9"
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="block w-full text-left px-4 py-3 text-slate-700 transition-all hover:text-blue-600"
                    >
                      Privacy Policy/ Terms
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 4. Cash Flow Calculator */}
            <motion.button
              onClick={() => navigate("/roi-calculator")}
              whileHover={{ 
                scale: 1.02,
                color: "#2563eb"
              }}
              whileTap={{ scale: 0.98 }}
              className={`relative px-3 py-2 rounded-lg transition-all font-medium whitespace-nowrap ${isActive("/roi-calculator") ? "text-blue-600" : "text-slate-700 hover:text-blue-600"}`}
            >
              <motion.div
                className="absolute inset-0 bg-blue-50 rounded-lg z-0"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
              <span className="relative z-10 text-sm xl:text-base">Cash Flow Calculator</span>
              {isActive("/roi-calculator") && (
                <motion.div
                  className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-blue-600 z-20 rounded-full"
                  layoutId="activeTab"
                />
              )}
            </motion.button>

            {/* 5. Marketing */}
            {/* <motion.button
              onClick={() => navigate("/marketing")}
              whileHover={{ 
                scale: 1.02,
                color: "#2563eb"
              }}
              whileTap={{ scale: 0.98 }}
              className={`relative px-3 py-2 rounded-lg transition-all font-medium whitespace-nowrap ${isActive("/marketing") ? "text-blue-600" : "text-slate-700 hover:text-blue-600"}`}
            >
              <motion.div
                className="absolute inset-0 bg-blue-50 rounded-lg z-0"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
              <span className="relative z-10 text-sm xl:text-base">Marketing</span>
              {isActive("/marketing") && (
                <motion.div
                  className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-blue-600 z-20 rounded-full"
                  layoutId="activeTab"
                />
              )}
            </motion.button> */}

            {/* 6. Request Access - Only show if not logged in */}
            {!isAuthenticated && (
              <motion.button
                onClick={() => navigate("/request-access")}
                whileHover={{ 
                  scale: 1.02,
                  color: "#2563eb"
                }}
                whileTap={{ scale: 0.98 }}
                className={`relative px-3 py-2 rounded-lg transition-all font-medium whitespace-nowrap ${isActive("/request-access") ? "text-blue-600" : "text-slate-700 hover:text-blue-600"}`}
              >
                <motion.div
                  className="absolute inset-0 bg-blue-50 rounded-lg z-0"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
                <span className="relative z-10 text-sm xl:text-base">Request Access</span>
                {isActive("/request-access") && (
                  <motion.div
                    className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-blue-600 z-20 rounded-full"
                    layoutId="activeTab"
                  />
                )}
              </motion.button>
            )}

            {/* 7. Contact Us */}
            <motion.button
              onClick={() => navigate("/contact")}
              whileHover={{ 
                scale: 1.02,
                color: "#2563eb"
              }}
              whileTap={{ scale: 0.98 }}
              className={`relative px-3 py-2 rounded-lg transition-all font-medium whitespace-nowrap ${isActive("/contact") ? "text-blue-600" : "text-slate-700 hover:text-blue-600"}`}
            >
              <motion.div
                className="absolute inset-0 bg-blue-50 rounded-lg z-0"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
              <span className="relative z-10 text-sm xl:text-base">Contact Us</span>
              {isActive("/contact") && (
                <motion.div
                  className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-blue-600 z-20 rounded-full"
                  layoutId="activeTab"
                />
              )}
            </motion.button>

            {/* 8. Resources Dropdown */}
            <div className="relative">
              <motion.button
                onMouseEnter={() => setResourcesOpen(true)}
                whileHover={{ 
                  scale: 1.02,
                  color: "#2563eb"
                }}
                whileTap={{ scale: 0.98 }}
              className={`relative flex items-center gap-1 px-3 py-2 rounded-lg transition-all font-medium whitespace-nowrap ${resourcesOpen ? "text-blue-600" : "text-slate-700 hover:text-blue-600"}`}
            >
              <motion.div
                className="absolute inset-0 bg-blue-50 rounded-lg z-0"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
              <span className="relative z-10 text-sm xl:text-base">Resources</span>
                <ChevronDown className="w-4 h-4 relative z-10" />
              </motion.button>

              <AnimatePresence>
                {resourcesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    onMouseLeave={() => setResourcesOpen(false)}
                    className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden"
                  >
                    {isAuthenticated && (
                      <motion.button
                        onClick={() => {
                          navigate("/manual");
                          setResourcesOpen(false);
                        }}
                        whileHover={{ 
                          x: 4,
                          backgroundColor: "#f1f5f9"
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="block w-full text-left px-4 py-3 text-slate-700 transition-all hover:text-blue-600"
                      >
                        User Manual
                      </motion.button>
                    )}
                    <motion.button
                      onClick={() => {
                        navigate("/blog");
                        setResourcesOpen(false);
                      }}
                      whileHover={{ 
                        x: 4,
                        backgroundColor: "#f1f5f9"
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="block w-full text-left px-4 py-3 text-slate-700 transition-all hover:text-blue-600"
                    >
                      Latest Updates
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart Icon - Only show on shop page */}
            {isAuthenticated && location.pathname === "/shop" && (
              <motion.button
                onClick={() => navigate('/cart')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-3 py-2 text-slate-700 hover:text-blue-600 transition-colors"
                title="Shopping Cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </motion.span>
                )}
              </motion.button>
            )}

            {/* Login Button or Profile */}
            {!isAuthenticated ? (
              <motion.button
                onClick={() => navigate('/login')}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 30px rgba(37, 99, 235, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all font-medium"
              >
                Login
              </motion.button>
            ) : (
              <motion.button
                onClick={() => navigate('/dashboard')}
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2.5 px-3.5 py-2 bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-200/50 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group"
              >
                <div className="relative">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs text-slate-500 leading-none hidden xl:block">Account</span>
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">
                    {customer?.firstName 
                      ? customer.firstName
                      : customer?.email?.split('@')[0] || 'Profile'}
                  </span>
                </div>
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t border-slate-200 bg-white"
            >
              <div className="py-4 space-y-3">
                {/* 1. Home */}
                <motion.button
                  onClick={() => {
                    navigate("/");
                    setMobileMenuOpen(false);
                  }}
                  whileHover={{ 
                    x: 8,
                    backgroundColor: "#f1f5f9",
                    color: "#2563eb"
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="block w-full text-left px-4 py-2 text-slate-700 rounded-lg transition-all font-medium"
                >
                  Home
                </motion.button>
                
                {/* 2. Product Information */}
                <motion.button
                  onClick={() => {
                    navigate("/product");
                    setMobileMenuOpen(false);
                  }}
                  whileHover={{ 
                    x: 8,
                    backgroundColor: "#f1f5f9",
                    color: "#2563eb"
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="block w-full text-left px-4 py-2 text-slate-700 rounded-lg transition-all font-medium"
                >
                  Product Information
                </motion.button>
                
                {/* 3. About Us Dropdown */}
                <div>
                  <motion.button
                    onClick={() => setMobileAboutUsOpen(!mobileAboutUsOpen)}
                    whileHover={{ 
                      x: 8,
                      backgroundColor: "#f1f5f9",
                      color: "#2563eb"
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-between w-full text-left px-4 py-2 text-slate-700 rounded-lg transition-all font-medium"
                  >
                    <span>About Us</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileAboutUsOpen ? 'rotate-180' : ''}`} />
                  </motion.button>
                  <AnimatePresence>
                    {mobileAboutUsOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-8 space-y-2 pt-2">
                          <motion.button
                            onClick={() => {
                              navigate("/company");
                              setMobileMenuOpen(false);
                              setMobileAboutUsOpen(false);
                            }}
                            whileHover={{ 
                              x: 4,
                              backgroundColor: "#f1f5f9",
                              color: "#2563eb"
                            }}
                            className="block w-full text-left px-4 py-2 text-slate-600 rounded-lg transition-all text-sm"
                          >
                            Company Page
                          </motion.button>
                          <motion.button
                            onClick={() => {
                              navigate("/why-pizza-anytime");
                              setMobileMenuOpen(false);
                              setMobileAboutUsOpen(false);
                            }}
                            whileHover={{ 
                              x: 4,
                              backgroundColor: "#f1f5f9",
                              color: "#2563eb"
                            }}
                            className="block w-full text-left px-4 py-2 text-slate-600 rounded-lg transition-all text-sm"
                          >
                            Why Pizza Anytime
                          </motion.button>
                          <motion.button
                            onClick={() => {
                              navigate("/onsite-support");
                              setMobileMenuOpen(false);
                              setMobileAboutUsOpen(false);
                            }}
                            whileHover={{ 
                              x: 4,
                              backgroundColor: "#f1f5f9",
                              color: "#2563eb"
                            }}
                            className="block w-full text-left px-4 py-2 text-slate-600 rounded-lg transition-all text-sm"
                          >
                            Onsite Support
                          </motion.button>
                          <motion.button
                            onClick={() => {
                              navigate("/privacy-terms");
                              setMobileMenuOpen(false);
                              setMobileAboutUsOpen(false);
                            }}
                            whileHover={{ 
                              x: 4,
                              backgroundColor: "#f1f5f9",
                              color: "#2563eb"
                            }}
                            className="block w-full text-left px-4 py-2 text-slate-600 rounded-lg transition-all text-sm"
                          >
                            Privacy Policy/ Terms
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* 4. Cash Flow Calculator */}
                <motion.button
                  onClick={() => {
                    navigate("/roi-calculator");
                    setMobileMenuOpen(false);
                  }}
                  whileHover={{ 
                    x: 8,
                    backgroundColor: "#f1f5f9",
                    color: "#2563eb"
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="block w-full text-left px-4 py-2 text-slate-700 rounded-lg transition-all font-medium"
                >
                  Cash Flow Calculator
                </motion.button>
                
                {/* 5. Marketing */}
                <motion.button
                  onClick={() => {
                    navigate("/marketing");
                    setMobileMenuOpen(false);
                  }}
                  whileHover={{ 
                    x: 8,
                    backgroundColor: "#f1f5f9",
                    color: "#2563eb"
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="block w-full text-left px-4 py-2 text-slate-700 rounded-lg transition-all font-medium"
                >
                  Marketing
                </motion.button>
                
                {/* 6. Request Access - Only show if not logged in */}
                {!isAuthenticated && (
                  <motion.button
                    onClick={() => {
                      navigate("/request-access");
                      setMobileMenuOpen(false);
                    }}
                    whileHover={{ 
                      x: 8,
                      backgroundColor: "#f1f5f9",
                      color: "#2563eb"
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="block w-full text-left px-4 py-2 text-slate-700 rounded-lg transition-all font-medium"
                  >
                    Request Access
                  </motion.button>
                )}
                
                {/* 7. Contact Us */}
                <motion.button
                  onClick={() => {
                    navigate("/contact");
                    setMobileMenuOpen(false);
                  }}
                  whileHover={{ 
                    x: 8,
                    backgroundColor: "#f1f5f9",
                    color: "#2563eb"
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="block w-full text-left px-4 py-2 text-slate-700 rounded-lg transition-all font-medium"
                >
                  Contact Us
                </motion.button>
                
                {/* 8. Resources Dropdown */}
                <div>
                  <motion.button
                    onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                    whileHover={{ 
                      x: 8,
                      backgroundColor: "#f1f5f9",
                      color: "#2563eb"
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-between w-full text-left px-4 py-2 text-slate-700 rounded-lg transition-all font-medium"
                  >
                    <span>Resources</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileResourcesOpen ? 'rotate-180' : ''}`} />
                  </motion.button>
                  <AnimatePresence>
                    {mobileResourcesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-8 space-y-2 pt-2">
                          {isAuthenticated && (
                            <motion.button
                              onClick={() => {
                                navigate("/manual");
                                setMobileMenuOpen(false);
                                setMobileResourcesOpen(false);
                              }}
                              whileHover={{ 
                                x: 4,
                                backgroundColor: "#f1f5f9",
                                color: "#2563eb"
                              }}
                              className="block w-full text-left px-4 py-2 text-slate-600 rounded-lg transition-all text-sm"
                            >
                              User Manual
                            </motion.button>
                          )}
                          <motion.button
                            onClick={() => {
                              navigate("/blog");
                              setMobileMenuOpen(false);
                              setMobileResourcesOpen(false);
                            }}
                            whileHover={{ 
                              x: 4,
                              backgroundColor: "#f1f5f9",
                              color: "#2563eb"
                            }}
                            className="block w-full text-left px-4 py-2 text-slate-600 rounded-lg transition-all text-sm"
                          >
                            Latest Updates
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                    {/* Cart Icon - Mobile - Only show on shop page */}
                    {isAuthenticated && location.pathname === "/shop" && (
                      <motion.button
                        onClick={() => {
                          navigate('/cart');
                          setMobileMenuOpen(false);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-between px-4 py-3 text-slate-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <ShoppingCart className="w-5 h-5" />
                          <span className="font-medium">Shopping Cart</span>
                        </div>
                        {cartCount > 0 && (
                          <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                            {cartCount > 99 ? '99+' : cartCount}
                          </span>
                        )}
                      </motion.button>
                    )}

                {/* Login Button or Profile - Mobile */}
                {!isAuthenticated ? (
                  <motion.button
                    onClick={() => {
                      navigate('/login');
                      setMobileMenuOpen(false);
                    }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 10px 30px rgba(37, 99, 235, 0.3)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-2.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all font-medium"
                  >
                    Login
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={() => {
                      navigate('/dashboard');
                      setMobileMenuOpen(false);
                    }}
                    whileHover={{
                      scale: 1.02,
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-200/50 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex flex-col items-start flex-1">
                      <span className="text-xs text-slate-500 leading-none">My Account</span>
                      <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {customer?.firstName 
                          ? `${customer.firstName}${customer.lastName ? ' ' + customer.lastName : ''}`.trim()
                          : customer?.email?.split('@')[0] || 'Profile'}
                      </span>
                    </div>
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}