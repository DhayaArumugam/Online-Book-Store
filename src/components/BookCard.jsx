import { useState } from "react";
import { Star, Heart, Eye, ShoppingBag, Check } from "lucide-react";
import { useCart } from "../context/useCart";

export default function BookCard({ book, viewMode = "grid" }) {
  const { addToCart, toggleWishlist, isInWishlist, openQuickView } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isFavorited = isInWishlist(book.id);

  const discountPercent =
    book.originalPrice && book.originalPrice > book.price
      ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
      : null;

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(book, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(book);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    openQuickView(book);
  };

  return (
    <article
      className={`book-card ${viewMode === "list" ? "book-card-list" : ""}`}
      onClick={() => openQuickView(book)}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${book.title} by ${book.author}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openQuickView(book);
        }
      }}
    >
      {/* Book Cover Container with 3D drop shadow */}
      <div className="book-cover-stage">
        {/* Wishlist Heart Button */}
        <button
          type="button"
          className={`book-wishlist-btn ${isFavorited ? "is-active" : ""}`}
          onClick={handleWishlist}
          aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
          title={isFavorited ? "In your Wishlist" : "Save to Wishlist"}
        >
          <Heart
            size={16}
            fill={isFavorited ? "#EF4444" : "none"}
            color={isFavorited ? "#EF4444" : "currentColor"}
          />
        </button>

        {/* Badge (Bestseller, Discount, etc.) */}
        {discountPercent ? (
          <span className="book-badge-pill discount-badge">
            -{discountPercent}%
          </span>
        ) : book.badge ? (
          <span className="book-badge-pill badge-primary">
            {book.badge}
          </span>
        ) : null}

        {/* Cover Image or Fallback */}
        <div className="book-image-wrapper">
          {!imageError && book.image ? (
            <img
              src={book.image}
              alt={`Cover of ${book.title}`}
              loading="lazy"
              onError={() => setImageError(true)}
              className="book-cover-img"
            />
          ) : (
            <div className="book-cover-fallback">
              <span className="fallback-title">{book.title}</span>
              <span className="fallback-author">{book.author}</span>
            </div>
          )}
          <div className="book-spine-sheen" aria-hidden="true" />
        </div>

        {/* Quick View Hover Button */}
        <button
          type="button"
          className="book-quick-view-btn"
          onClick={handleQuickView}
          aria-label="Quick preview"
        >
          <Eye size={15} />
          <span>Quick View</span>
        </button>
      </div>

      {/* Book Details */}
      <div className="book-card-body">
        <div className="book-meta-top">
          <span className="book-category-tag">{book.category}</span>
          {book.rating && (
            <div className="book-rating-badge">
              <Star size={12} fill="#F59E0B" color="#F59E0B" />
              <span>{book.rating}</span>
              {book.reviewsCount && (
                <span className="rating-count">
                  ({book.reviewsCount > 999 ? `${(book.reviewsCount / 1000).toFixed(1)}k` : book.reviewsCount})
                </span>
              )}
            </div>
          )}
        </div>

        <h3 className="book-card-title" title={book.title}>
          {book.title}
        </h3>

        <p className="book-card-author">by {book.author}</p>

        {/* List view description snippet */}
        {viewMode === "list" && book.description && (
          <p className="book-card-description">
            {book.description.substring(0, 160)}...
          </p>
        )}

        <div className="book-card-footer">
          <div className="book-price-block">
            <span className="price-current">
              ₹{Number(book.price).toLocaleString("en-IN")}
            </span>
            {book.originalPrice && book.originalPrice > book.price && (
              <span className="price-original">
                ₹{Number(book.originalPrice).toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <button
            type="button"
            className={`book-add-btn ${justAdded ? "added-success" : ""}`}
            onClick={handleAdd}
            aria-label={`Add ${book.title} to bag`}
          >
            {justAdded ? (
              <>
                <Check size={15} strokeWidth={2.5} />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag size={15} />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
