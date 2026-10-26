import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Banknote,
  Building,
  Truck,
  Package,
  Calendar,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "../context/useCart";

export default function Checkout({ onBack, onCompleteOrder }) {
  const {
    cart,
    subtotal,
    discountAmount,
    shippingFee,
    isFreeShipping,
    grandTotal,
    coupon,
    clearCart,
  } = useCart();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    landmark: "",
    city: "",
    state: "Karnataka",
    postalCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [completedOrder, setCompletedOrder] = useState(null);

  const indianStates = [
    "Andhra Pradesh",
    "Delhi",
    "Gujarat",
    "Karnataka",
    "Kerala",
    "Maharashtra",
    "Punjab",
    "Rajasthan",
    "Tamil Nadu",
    "Telangana",
    "Uttar Pradesh",
    "West Bengal",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cart.length === 0) return;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);

    const order = {
      orderId: `BN-${Math.floor(100000 + Math.random() * 900000)}`,
      customer: { ...form },
      paymentMethod,
      items: [...cart],
      subtotal,
      discount: discountAmount,
      shipping: shippingFee,
      total: grandTotal,
      coupon: coupon ? coupon.code : null,
      orderDate: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      estimatedDelivery: deliveryDate.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "short",
      }),
    };

    setCompletedOrder(order);
    clearCart();
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (onCompleteOrder) {
      onCompleteOrder(order);
    }
  };

  // If order is completed, show celebratory confirmation receipt
  if (completedOrder) {
    return (
      <main className="order-confirmation-page">
        <div className="confirmation-card">
          <div className="confirmation-hero">
            <div className="confetti-icon-wrap">
              <CheckCircle2 size={42} strokeWidth={2.4} />
            </div>
            <span className="confirmation-eyebrow">ORDER CONFIRMED</span>
            <h1>Thank you, {completedOrder.customer.fullName}!</h1>
            <p className="confirmation-subtitle">
              Your order <strong>{completedOrder.orderId}</strong> has been received and is being prepared with care.
            </p>
          </div>

          {/* Delivery Tracker Visualizer */}
          <div className="delivery-tracker-box">
            <div className="tracker-header">
              <div className="tracker-header-left">
                <Truck size={18} />
                <span>Estimated Delivery:</span>
                <strong>{completedOrder.estimatedDelivery}</strong>
              </div>
              <span className="live-status-pill">
                <span className="pulsing-dot" /> Preparing Shipment
              </span>
            </div>

            <div className="tracker-steps">
              <div className="tracker-step step-done">
                <div className="step-node">
                  <CheckCircle2 size={16} />
                </div>
                <div className="step-content">
                  <strong>Order Placed</strong>
                  <small>{completedOrder.orderDate}</small>
                </div>
              </div>

              <div className="tracker-step step-active">
                <div className="step-node">
                  <Package size={16} />
                </div>
                <div className="step-content">
                  <strong>Quality Check & Packing</strong>
                  <small>In progress</small>
                </div>
              </div>

              <div className="tracker-step">
                <div className="step-node">
                  <Truck size={16} />
                </div>
                <div className="step-content">
                  <strong>Dispatched</strong>
                  <small>Pending pickup</small>
                </div>
              </div>

              <div className="tracker-step">
                <div className="step-node">
                  <Calendar size={16} />
                </div>
                <div className="step-content">
                  <strong>Delivered</strong>
                  <small>{completedOrder.estimatedDelivery}</small>
                </div>
              </div>
            </div>
          </div>

          {/* Receipt Breakdown */}
          <div className="receipt-summary-grid">
            <div className="receipt-items-col">
              <h3>Purchased Titles ({completedOrder.items.length})</h3>
              <div className="receipt-items-list">
                {completedOrder.items.map((item) => (
                  <div key={item.id} className="receipt-item-row">
                    <img src={item.image} alt={item.title} />
                    <div className="receipt-item-info">
                      <h4>{item.title}</h4>
                      <p>
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <strong className="receipt-item-subtotal">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="receipt-delivery-col">
              <h3>Delivery Details</h3>
              <div className="receipt-address-box">
                <p>
                  <strong>{completedOrder.customer.fullName}</strong>
                </p>
                <p>{completedOrder.customer.address}</p>
                {completedOrder.customer.landmark && (
                  <p>Landmark: {completedOrder.customer.landmark}</p>
                )}
                <p>
                  {completedOrder.customer.city},{" "}
                  {completedOrder.customer.state} -{" "}
                  {completedOrder.customer.postalCode}
                </p>
                <p>Phone: {completedOrder.customer.phone}</p>
                <p>Email: {completedOrder.customer.email}</p>
              </div>

              <div className="receipt-financials-box">
                <div className="fin-row">
                  <span>Subtotal:</span>
                  <span>₹{completedOrder.subtotal.toLocaleString("en-IN")}</span>
                </div>
                {completedOrder.discount > 0 && (
                  <div className="fin-row text-discount">
                    <span>Discount ({completedOrder.coupon}):</span>
                    <span>-₹{completedOrder.discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="fin-row">
                  <span>Shipping:</span>
                  <span>
                    {completedOrder.shipping === 0
                      ? "FREE"
                      : `₹${completedOrder.shipping}`}
                  </span>
                </div>
                <div className="fin-divider" />
                <div className="fin-row fin-total">
                  <span>Total Paid:</span>
                  <strong>₹{completedOrder.total.toLocaleString("en-IN")}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="confirmation-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={onBack}
            >
              <span>Continue Shopping</span>
              <ShoppingBag size={18} />
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page-container">
      <div className="checkout-top-bar">
        <button type="button" className="checkout-back-link" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Return to Collection</span>
        </button>

        <div className="checkout-security-tag">
          <ShieldCheck size={16} />
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
      </div>

      <div className="checkout-grid-layout">
        {/* Left Column: Delivery & Payment Details Form */}
        <section className="checkout-form-section">
          <form onSubmit={handleSubmit} className="checkout-main-form">
            {/* Step 1: Contact Details */}
            <div className="form-card-block">
              <div className="block-header">
                <span className="step-circle">1</span>
                <div>
                  <h3>Contact Information</h3>
                  <p>Where we should send your order receipt and tracking updates.</p>
                </div>
              </div>

              <div className="form-fields-group">
                <div className="form-field">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    placeholder="e.g. Aryan Sharma"
                    value={form.fullName}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>

                <div className="form-field-row">
                  <div className="form-field">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="aryan@example.com"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Address */}
            <div className="form-card-block">
              <div className="block-header">
                <span className="step-circle">2</span>
                <div>
                  <h3>Shipping Address</h3>
                  <p>Enter your full delivery address for doorstep parcel delivery.</p>
                </div>
              </div>

              <div className="form-fields-group">
                <div className="form-field">
                  <label htmlFor="address">Flat, House no., Building, Street *</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    placeholder="Flat 402, Green Valley Apartments, 12th Main Rd"
                    value={form.address}
                    onChange={handleChange}
                    autoComplete="street-address"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="landmark">Landmark (Optional)</label>
                  <input
                    id="landmark"
                    name="landmark"
                    type="text"
                    placeholder="Near City Central Library"
                    value={form.landmark}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field-row-three">
                  <div className="form-field">
                    <label htmlFor="city">City *</label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      placeholder="Bengaluru"
                      value={form.city}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="state">State *</label>
                    <select
                      id="state"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                    >
                      {indianStates.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label htmlFor="postalCode">PIN Code *</label>
                    <input
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      required
                      placeholder="560001"
                      value={form.postalCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="form-card-block">
              <div className="block-header">
                <span className="step-circle">3</span>
                <div>
                  <h3>Payment Method</h3>
                  <p>Choose your preferred payment gateway. Demo simulation only.</p>
                </div>
              </div>

              <div className="payment-options-grid">
                <label
                  className={`payment-option-card ${paymentMethod === "upi" ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-card-content">
                    <Smartphone size={22} className="payment-icon" />
                    <div>
                      <strong>Instant UPI</strong>
                      <small>Google Pay, PhonePe, Paytm, BHIM</small>
                    </div>
                  </div>
                </label>

                <label
                  className={`payment-option-card ${paymentMethod === "card" ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-card-content">
                    <CreditCard size={22} className="payment-icon" />
                    <div>
                      <strong>Credit / Debit Card</strong>
                      <small>Visa, Mastercard, RuPay</small>
                    </div>
                  </div>
                </label>

                <label
                  className={`payment-option-card ${paymentMethod === "netbanking" ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="netbanking"
                    checked={paymentMethod === "netbanking"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-card-content">
                    <Building size={22} className="payment-icon" />
                    <div>
                      <strong>Net Banking</strong>
                      <small>HDFC, ICICI, SBI, Axis & more</small>
                    </div>
                  </div>
                </label>

                <label
                  className={`payment-option-card ${paymentMethod === "cod" ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-card-content">
                    <Banknote size={22} className="payment-icon" />
                    <div>
                      <strong>Cash on Delivery</strong>
                      <small>Pay cash or UPI upon delivery</small>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="btn-place-order"
              disabled={cart.length === 0}
            >
              <span>Place Order · ₹{grandTotal.toLocaleString("en-IN")}</span>
              <Sparkles size={18} />
            </button>
          </form>
        </section>

        {/* Right Column: Sticky Order Summary */}
        <aside className="checkout-summary-section">
          <div className="summary-sticky-card">
            <div className="summary-header">
              <h3>Order Summary</h3>
              <span className="summary-qty-tag">
                {cart.length} {cart.length === 1 ? "title" : "titles"}
              </span>
            </div>

            <div className="summary-items-scroll">
              {cart.map((item) => (
                <div key={item.id} className="checkout-item-row">
                  <div className="checkout-item-thumb">
                    <img src={item.image} alt={item.title} />
                    <span className="thumb-qty-bubble">{item.quantity}</span>
                  </div>

                  <div className="checkout-item-meta">
                    <h4>{item.title}</h4>
                    <span className="item-author">{item.author}</span>
                  </div>

                  <span className="item-price">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            {coupon && (
              <div className="summary-coupon-badge">
                <Sparkles size={14} />
                <span>Coupon {coupon.code} Applied</span>
                <strong>-₹{discountAmount}</strong>
              </div>
            )}

            <div className="summary-totals-breakdown">
              <div className="summary-line">
                <span>Items Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              {discountAmount > 0 && (
                <div className="summary-line text-discount">
                  <span>Discount</span>
                  <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="summary-line">
                <span>Shipping</span>
                <span>
                  {isFreeShipping ? (
                    <strong className="text-free">FREE</strong>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>

              <div className="summary-line-divider" />

              <div className="summary-line grand-total-line">
                <span>Total Amount</span>
                <span className="grand-price">
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="summary-perks-box">
              <div className="perk-bullet">
                <Truck size={14} />
                <span>Estimated delivery within 2-3 business days</span>
              </div>
              <div className="perk-bullet">
                <ShieldCheck size={14} />
                <span>No cancellation fees · 7-day easy returns</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
