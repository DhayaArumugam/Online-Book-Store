import { useEffect } from "react";
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "../context/useCart";

export default function WishlistDrawer({ onClose }) {
  const {
    wishlist,
    removeFromWishlist,
    addToCart,
    setWishlistOpen,
    openQuickView,
  } = useCart();

  // Escape key & scroll lock
  useEffect(() => {
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = orig;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleMoveToCart = (book) => {
    addToCart(book);
    removeFromWishlist(book.id);
  };

  return (
    <div
      className="drawer-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <aside
        className="cart-drawer-panel wishlist-drawer"
        onClick={(e) => e.stopPropagation()}
        aria-label="Saved Wishlist"
      >
        <div className="drawer-header">
          <div className="drawer-header-title">
            <div className="drawer-icon-wrap icon-wishlist-wrap">
              <Heart size={20} fill="#EF4444" color="#EF4444" />
            </div>
            <div>
              <h3>Saved Books</h3>
              <span className="drawer-item-count">
                {wishlist.length} {wishlist.length === 1 ? "book" : "books"} saved
              </span>
            </div>
          </div>

          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close wishlist"
          >
            <X size={20} />
          </button>
        </div>

        <div className="drawer-items-list">
          {wishlist.length === 0 ? (
            <div className="cart-empty-state">
              <div className="empty-cart-illustration">
                <Heart size={56} strokeWidth={1.4} color="#9CA3AF" />
              </div>
              <h4>Your wishlist is empty</h4>
              <p>
                Click the heart icon on any book cover to save it for later,
                track prices, or build your personal reading list.
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={onClose}
              >
                <span>Discover Books</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            wishlist.map((book) => (
              <div key={book.id} className="cart-item-card wishlist-item-card">
                <div
                  className="cart-item-cover"
                  onClick={() => {
                    openQuickView(book);
                    setWishlistOpen(false);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <img src={book.image} alt={book.title} />
                </div>

                <div className="cart-item-details">
                  <div className="cart-item-top">
                    <div>
                      <span className="cart-item-category">{book.category}</span>
                      <h4
                        className="cart-item-title cursor-pointer"
                        onClick={() => {
                          openQuickView(book);
                          setWishlistOpen(false);
                        }}
                      >
                        {book.title}
                      </h4>
                      <p className="cart-item-author">by {book.author}</p>
                    </div>

                    <button
                      type="button"
                      className="cart-item-delete"
                      onClick={() => removeFromWishlist(book.id)}
                      aria-label={`Remove ${book.title} from wishlist`}
                      title="Remove from wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="cart-item-bottom">
                    <span className="cart-item-total-price">
                      ₹{book.price}
                    </span>

                    <button
                      type="button"
                      className="btn-move-to-cart"
                      onClick={() => handleMoveToCart(book)}
                    >
                      <ShoppingBag size={14} />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
