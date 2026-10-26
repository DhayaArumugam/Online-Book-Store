import {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  CartContext,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
} from "./cartContextInstance";




const STORAGE_KEYS = {
  CART: "booknest_cart_v1",
  WISHLIST: "booknest_wishlist_v1",
  COUPON: "booknest_coupon_v1",
};

const VALID_COUPONS = {
  READMORE: { code: "READMORE", discountPercent: 15, description: "15% off storewide" },
  WELCOME10: { code: "WELCOME10", discountPercent: 10, description: "10% off welcome gift" },
  FREESHIP: { code: "FREESHIP", discountPercent: 0, freeShipping: true, description: "Free standard delivery" },
};

export function CartProvider({ children }) {
  // 1. Cart state with localStorage persistence
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 2. Wishlist state with localStorage persistence
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 3. Coupon state
  const [coupon, setCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COUPON);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 4. Modal / Drawer states
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [quickViewBook, setQuickViewBook] = useState(null);

  // 5. Toast notification system
  const [toasts, setToasts] = useState([]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (err) {
      console.warn("Failed to persist cart to localStorage:", err);
    }
  }, [cart]);

  // Persist wishlist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch (err) {
      console.warn("Failed to persist wishlist to localStorage:", err);
    }
  }, [wishlist]);

  // Persist coupon
  useEffect(() => {
    try {
      if (coupon) {
        localStorage.setItem(STORAGE_KEYS.COUPON, JSON.stringify(coupon));
      } else {
        localStorage.removeItem(STORAGE_KEYS.COUPON);
      }
    } catch (err) {
      console.warn("Failed to persist coupon:", err);
    }
  }, [coupon]);

  // Toast dispatch
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const newToast = {
      id,
      title: toast.title || "Notification",
      message: toast.message || "",
      type: toast.type || "info", // "success" | "info" | "warning"
    };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 3500);
  }, [removeToast]);

  // Cart operations
  const addToCart = useCallback((book, quantity = 1) => {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === book.id);
      if (existing) {
        return currentCart.map((item) =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...currentCart, { ...book, quantity }];
    });

    addToast({
      type: "success",
      title: "Added to Cart",
      message: `"${book.title}" added to your bag.`,
    });
  }, [addToast]);

  const removeFromCart = useCallback((id) => {
    setCart((currentCart) => {
      const removed = currentCart.find((item) => item.id === id);
      if (removed) {
        addToast({
          type: "info",
          title: "Removed from Cart",
          message: `"${removed.title}" removed.`,
        });
      }
      return currentCart.filter((item) => item.id !== id);
    });
  }, [addToast]);

  const updateQuantity = useCallback((id, quantity) => {
    setCart((currentCart) => {
      if (quantity <= 0) {
        return currentCart.filter((item) => item.id !== id);
      }
      return currentCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Wishlist operations
  const toggleWishlist = useCallback((book) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === book.id);
      if (exists) {
        addToast({
          type: "info",
          title: "Wishlist Updated",
          message: `"${book.title}" removed from your saved books.`,
        });
        return prev.filter((item) => item.id !== book.id);
      } else {
        addToast({
          type: "success",
          title: "Saved to Wishlist",
          message: `"${book.title}" saved for later!`,
        });
        return [...prev, book];
      }
    });
  }, [addToast]);

  const isInWishlist = useCallback(
    (id) => wishlist.some((item) => item.id === id),
    [wishlist]
  );

  const removeFromWishlist = useCallback((id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Coupon handling
  const applyCoupon = useCallback((code) => {
    const cleanCode = (code || "").trim().toUpperCase();
    if (!cleanCode) return { success: false, message: "Please enter a coupon code." };

    const found = VALID_COUPONS[cleanCode];
    if (found) {
      setCoupon(found);
      addToast({
        type: "success",
        title: "Coupon Applied!",
        message: `Code ${found.code} applied: ${found.description}`,
      });
      return { success: true, coupon: found };
    } else {
      addToast({
        type: "warning",
        title: "Invalid Code",
        message: "Try code READMORE (15% off) or WELCOME10 (10% off).",
      });
      return { success: false, message: "Invalid promo code. Try 'READMORE'." };
    }
  }, [addToast]);

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    addToast({
      type: "info",
      title: "Coupon Removed",
      message: "Promo code has been cleared.",
    });
  }, [addToast]);

  // Quick view
  const openQuickView = useCallback((book) => {
    setQuickViewBook(book);
  }, []);

  const closeQuickView = useCallback(() => {
    setQuickViewBook(null);
  }, []);

  // Financial calculations
  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const subtotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );

  const discountAmount = useMemo(() => {
    if (!coupon || !coupon.discountPercent) return 0;
    return Math.round((subtotal * coupon.discountPercent) / 100);
  }, [subtotal, coupon]);

  const isFreeShipping = useMemo(() => {
    if (subtotal === 0) return true;
    if (coupon?.freeShipping) return true;
    return subtotal >= FREE_SHIPPING_THRESHOLD;
  }, [subtotal, coupon]);

  const shippingFee = useMemo(() => {
    if (subtotal === 0) return 0;
    return isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  }, [subtotal, isFreeShipping]);

  const freeShippingProgress = useMemo(() => {
    if (subtotal >= FREE_SHIPPING_THRESHOLD) return 100;
    return Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  }, [subtotal]);

  const freeShippingRemaining = useMemo(() => {
    return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  }, [subtotal]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + shippingFee);
  }, [subtotal, discountAmount, shippingFee]);

  const value = useMemo(
    () => ({
      cart,
      cartCount,
      subtotal,
      discountAmount,
      shippingFee,
      isFreeShipping,
      freeShippingProgress,
      freeShippingRemaining,
      grandTotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      // Wishlist
      wishlist,
      wishlistCount: wishlist.length,
      toggleWishlist,
      isInWishlist,
      removeFromWishlist,
      // Coupon
      coupon,
      applyCoupon,
      removeCoupon,
      // Drawers and Modals
      cartOpen,
      setCartOpen,
      wishlistOpen,
      setWishlistOpen,
      quickViewBook,
      openQuickView,
      closeQuickView,
      // Toasts
      toasts,
      addToast,
      removeToast,
    }),
    [
      cart,
      cartCount,
      subtotal,
      discountAmount,
      shippingFee,
      isFreeShipping,
      freeShippingProgress,
      freeShippingRemaining,
      grandTotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      wishlist,
      toggleWishlist,
      isInWishlist,
      removeFromWishlist,
      coupon,
      applyCoupon,
      removeCoupon,
      cartOpen,
      wishlistOpen,
      quickViewBook,
      openQuickView,
      closeQuickView,
      toasts,
      addToast,
      removeToast,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
