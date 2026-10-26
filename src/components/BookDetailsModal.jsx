import { useEffect, useState } from "react";
import {
  X,
  Star,
  Heart,
  ShoppingBag,
  Check,
  BookOpen,
  Calendar,
  Languages,
  Layers,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "../context/useCart";

export default function BookDetailsModal({ onBuyNow }) {
  const {
    quickViewBook,
    closeQuickView,
    addToCart,
    toggleWishlist,
    isInWishlist,
  } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  // Close on Escape key & manage body scroll lock
  useEffect(() => {
    if (!quickViewBook) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeQuickView();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [quickViewBook, closeQuickView]);

  if (!quickViewBook) return null;

  const book = quickViewBook;
  const isFavorited = isInWishlist(book.id);

  const discountPercent =
    book.originalPrice && book.originalPrice > book.price
      ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
      : null;

  const handleAddToCart = () => {
    addToCart(book, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleBuyNow = () => {
    addToCart(book, quantity);
    closeQuickView();
    onBuyNow?.();
  };

  return (
    <div
      className="modal-overlay"
      onClick={closeQuickView}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-book-title"
    >
      <div
        className="modal-dialog book-details-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={closeQuickView}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        <div className="modal-content-grid">
          {/* Left Column: Book Cover Presentation */}
          <div className="modal-cover-column">
            <div className="modal-cover-frame">
              {book.image ? (
                <img
                  src={book.image}
                  alt={book.title}
                  className="modal-cover-image"
                />
              ) : (
                <div className="modal-cover-placeholder">
                  <BookOpen size={48} />
                  <span>{book.title}</span>
                </div>
              )}
              <div className="modal-cover-shadow" aria-hidden="true" />
            </div>

            <div className="modal-guarantees">
              <div className="guarantee-chip">
                <Truck size={14} />
                <span>Express 2-Day Delivery Available</span>
              </div>
              <div className="guarantee-chip">
                <ShieldCheck size={14} />
                <span>Original Paperback · Verified Seller</span>
              </div>
            </div>
          </div>

          {/* Right Column: Book Details & Actions */}
          <div className="modal-details-column">
            <div className="modal-header-meta">
              <span className="modal-category-tag">{book.category}</span>
              {discountPercent && (
                <span className="modal-discount-tag">Save {discountPercent}%</span>
              )}
            </div>

            <h2 id="modal-book-title" className="modal-book-title">
              {book.title}
            </h2>

            <p className="modal-book-author">
              Written by <strong>{book.author}</strong>
            </p>

            {/* Rating Stars & Reviews */}
            <div className="modal-rating-row">
              <div className="stars-cluster">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.floor(book.rating || 5) ? "#F59E0B" : "none"}
                    color="#F59E0B"
                  />
                ))}
              </div>
              <span className="modal-rating-score">{book.rating}</span>
              <span className="modal-rating-count">
                ({book.reviewsCount?.toLocaleString() || "1,240"} verified reviews)
              </span>
            </div>

            {/* Price Box */}
            <div className="modal-price-box">
              <div className="price-primary">
                <span className="price-symbol">₹</span>
                <span className="price-value">{book.price}</span>
              </div>
              {book.originalPrice && book.originalPrice > book.price && (
                <span className="price-strikethrough">
                  M.R.P. ₹{book.originalPrice}
                </span>
              )}
              <span className="tax-inclusive-tag">Inclusive of all taxes</span>
            </div>

            {/* Synopsis / Description */}
            <div className="modal-synopsis-section">
              <h4>About this book</h4>
              <p>{book.description || "No description available."}</p>
            </div>

            {/* Book Specifications Grid */}
            <div className="modal-specs-grid">
              <div className="spec-card">
                <Layers size={16} className="spec-icon" />
                <div className="spec-info">
                  <span className="spec-label">Pages</span>
                  <strong className="spec-val">{book.pages || 320}</strong>
                </div>
              </div>

              <div className="spec-card">
                <Calendar size={16} className="spec-icon" />
                <div className="spec-info">
                  <span className="spec-label">Published</span>
                  <strong className="spec-val">{book.publishedYear || "2020"}</strong>
                </div>
              </div>

              <div className="spec-card">
                <Languages size={16} className="spec-icon" />
                <div className="spec-info">
                  <span className="spec-label">Language</span>
                  <strong className="spec-val">English</strong>
                </div>
              </div>

              <div className="spec-card">
                <BookOpen size={16} className="spec-icon" />
                <div className="spec-info">
                  <span className="spec-label">Format</span>
                  <strong className="spec-val">Paperback</strong>
                </div>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="modal-actions-wrapper">
              <div className="modal-qty-picker">
                <span className="qty-label">Quantity:</span>
                <div className="stepper-controls">
                  <button
                    type="button"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="stepper-val">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="modal-buttons-row">
                <button
                  type="button"
                  className={`modal-btn-cart ${justAdded ? "btn-success" : ""}`}
                  onClick={handleAddToCart}
                >
                  {justAdded ? (
                    <>
                      <Check size={18} />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      <span>Add to Bag (₹{(book.price * quantity).toLocaleString("en-IN")})</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="modal-btn-buynow"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>

                <button
                  type="button"
                  className={`modal-btn-wishlist ${isFavorited ? "active" : ""}`}
                  onClick={() => toggleWishlist(book)}
                  title={isFavorited ? "Saved in Wishlist" : "Save to Wishlist"}
                  aria-label="Toggle wishlist"
                >
                  <Heart
                    size={20}
                    fill={isFavorited ? "#EF4444" : "none"}
                    color={isFavorited ? "#EF4444" : "currentColor"}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
