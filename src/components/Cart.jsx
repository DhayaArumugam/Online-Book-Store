import { useEffect, useState } from "react";
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Truck,
  Tag,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useCart } from "../context/useCart";

export default function Cart({ onClose, onCheckout }) {
  const {
    cart,
    subtotal,
    discountAmount,
    shippingFee,
    isFreeShipping,
    freeShippingProgress,
    freeShippingRemaining,
    grandTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState(null);

  // Close on Escape & lock body scroll
  useEffect(() => {
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = origOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponMsg({ type: "error", text: res.message });
    } else {
      setCouponMsg({ type: "success", text: "Coupon applied successfully!" });
      setCouponInput("");
    }
  };

  const handleQuickCoupon = (code) => {
    setCouponInput(code);
    applyCoupon(code);
  };

  return (
    <div className="drawer-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <aside
        className="cart-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        aria-label="Shopping Cart"
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-header-title">
            <div className="drawer-icon-wrap">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h3>Your Reading Bag</h3>
              <span className="drawer-item-count">
                {cart.length} {cart.length === 1 ? "book" : "books"} selected
              </span>
            </div>
          </div>

          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Tracker */}
        <div className="shipping-progress-banner">
          <div className="shipping-progress-label">
            <div className="progress-text-left">
              <Truck size={16} className="truck-icon" />
              <span>
                {isFreeShipping ? (
                  <strong className="text-success">
                    🎉 Free Express Delivery Unlocked!
                  </strong>
                ) : (
                  <>
                    Add <strong>₹{freeShippingRemaining}</strong> more for{" "}
                    <strong>Free Delivery</strong>
                  </>
                )}
              </span>
            </div>
            <span className="progress-percent">{freeShippingProgress}%</span>
          </div>

          <div className="shipping-progress-track">
            <div
              className="shipping-progress-fill"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="drawer-items-list">
          {cart.length === 0 ? (
            <div className="cart-empty-state">
              <div className="empty-cart-illustration">
                <ShoppingBag size={56} strokeWidth={1.4} />
              </div>
              <h4>Your bag is currently empty</h4>
              <p>
                Looks like you haven't discovered your next favorite book yet.
                Explore our collection to get started.
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={onClose}
              >
                <span>Browse Collection</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item-card">
                <div className="cart-item-cover">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                  />
                </div>

                <div className="cart-item-details">
                  <div className="cart-item-top">
                    <div>
                      <span className="cart-item-category">{item.category}</span>
                      <h4 className="cart-item-title">{item.title}</h4>
                      <p className="cart-item-author">by {item.author}</p>
                    </div>

                    <button
                      type="button"
                      className="cart-item-delete"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.title} from cart`}
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="cart-item-bottom">
                    <div className="cart-stepper">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="stepper-count">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="cart-item-price-col">
                      <span className="cart-item-total-price">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                      {item.quantity > 1 && (
                        <span className="cart-item-unit-price">
                          (₹{item.price} each)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer with Coupon & Checkout */}
        {cart.length > 0 && (
          <div className="drawer-footer">
            {/* Promo Code Section */}
            <div className="coupon-box">
              {coupon ? (
                <div className="coupon-applied-pill">
                  <div className="coupon-applied-info">
                    <Tag size={15} className="tag-icon" />
                    <div>
                      <strong>{coupon.code}</strong>
                      <span> · {coupon.description}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="coupon-remove-btn"
                    onClick={removeCoupon}
                    aria-label="Remove coupon"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="coupon-form">
                  <div className="coupon-input-group">
                    <Tag size={15} className="coupon-input-icon" />
                    <input
                      type="text"
                      placeholder="Promo code (e.g. READMORE)"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponMsg(null);
                      }}
                      aria-label="Enter promo code"
                    />
                    <button type="submit" className="coupon-submit-btn">
                      Apply
                    </button>
                  </div>

                  <div className="coupon-hints">
                    <span className="hints-label">Try:</span>
                    <button
                      type="button"
                      className="coupon-hint-chip"
                      onClick={() => handleQuickCoupon("READMORE")}
                    >
                      <Sparkles size={11} /> READMORE (15% OFF)
                    </button>
                    <button
                      type="button"
                      className="coupon-hint-chip"
                      onClick={() => handleQuickCoupon("WELCOME10")}
                    >
                      WELCOME10 (10% OFF)
                    </button>
                  </div>

                  {couponMsg && (
                    <p className={`coupon-status-msg ${couponMsg.type}`}>
                      {couponMsg.text}
                    </p>
                  )}
                </form>
              )}
            </div>

            {/* Price Calculations */}
            <div className="drawer-price-summary">
              <div className="summary-row">
                <span>Items Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              {discountAmount > 0 && (
                <div className="summary-row row-discount">
                  <span>Discount ({coupon?.code})</span>
                  <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Standard Delivery</span>
                <span>
                  {isFreeShipping ? (
                    <strong className="text-free">FREE</strong>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>

              <div className="summary-divider" />

              <div className="summary-row row-total">
                <span>Estimated Total</span>
                <span className="total-amount">
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="drawer-actions">
              <button
                type="button"
                className="btn-checkout-primary"
                onClick={onCheckout}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>

              <div className="drawer-sub-actions">
                <button
                  type="button"
                  className="btn-clear-cart"
                  onClick={clearCart}
                >
                  Clear Bag
                </button>
                <span className="secure-badge">
                  <CheckCircle2 size={13} /> 256-Bit Encrypted
                </span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
