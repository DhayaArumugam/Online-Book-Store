import { useState } from "react";
import {
  BookOpen,
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useCart } from "../context/useCart";

export default function Navbar({
  searchTerm,
  onSearchChange,
  onHomeClick,
  onExploreClick,
  onBestsellersClick,
}) {
  const {
    cartCount,
    subtotal,
    setCartOpen,
    wishlistCount,
    setWishlistOpen,
  } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="site-header">
      {/* Top Announcement Bar */}
      <aside className="announcement-bar" aria-label="Announcement">
        <div className="announcement-content">
          <span className="announcement-badge">
            <Sparkles size={13} /> Exclusive
          </span>
          <span className="announcement-text">
            Free Express Shipping on orders over ₹499 · Use code{" "}
            <strong>READMORE</strong> for 15% off
          </span>
          <a
            href="#books"
            className="announcement-link"
            onClick={(e) => {
              e.preventDefault();
              onExploreClick?.();
            }}
          >
            Shop Collection <ArrowRight size={12} />
          </a>
        </div>
      </aside>

      {/* Main Navigation Bar */}
      <nav className="navbar-container" aria-label="Primary navigation">
        <div className="navbar-inner">
          {/* Logo & Brand */}
          <button
            type="button"
            className="brand-link"
            onClick={onHomeClick}
            aria-label="BookNest Home"
          >
            <div className="brand-logo-mark">
              <BookOpen size={22} strokeWidth={2.4} />
            </div>
            <div className="brand-typography">
              <span className="brand-name">BookNest</span>
              <span className="brand-tagline">Curated Books & Minds</span>
            </div>
          </button>

          {/* Center Search Input */}
          <div className="navbar-search-wrapper">
            <div className="navbar-search-box">
              <Search size={16} className="search-icon" />
              <input
                type="search"
                placeholder="Search by title, author, or category..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                aria-label="Search books"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => onSearchChange("")}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons & Nav Links */}
          <div className="navbar-actions">
            <nav className="nav-links-desktop">
              <button
                type="button"
                className="nav-link-btn"
                onClick={onHomeClick}
              >
                Home
              </button>
              <button
                type="button"
                className="nav-link-btn"
                onClick={onExploreClick}
              >
                All Books
              </button>
              <button
                type="button"
                className="nav-link-btn"
                onClick={onBestsellersClick}
              >
                Bestsellers
              </button>
            </nav>

            <div className="action-buttons-group">
              {/* Wishlist Button */}
              <button
                type="button"
                className="icon-action-btn"
                onClick={() => setWishlistOpen(true)}
                aria-label={`View Wishlist (${wishlistCount} items)`}
                title="Your Wishlist"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="badge-pill" aria-hidden="true">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                type="button"
                className="cart-action-btn"
                onClick={() => setCartOpen(true)}
                aria-label={`View Cart (${cartCount} items)`}
              >
                <div className="cart-icon-wrapper">
                  <ShoppingBag size={20} />
                  {cartCount > 0 && (
                    <span className="cart-badge-dot">{cartCount}</span>
                  )}
                </div>
                <div className="cart-action-details">
                  <span className="cart-label">Bag</span>
                  <span className="cart-amount">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                className="mobile-toggle-btn"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label="Toggle mobile menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Dropdown */}
        {mobileMenuOpen && (
          <div className="mobile-menu-drawer">
            <div className="mobile-search-box">
              <Search size={16} />
              <input
                type="search"
                placeholder="Search 50+ books..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>

            <div className="mobile-nav-links">
              <button
                type="button"
                onClick={() => {
                  onHomeClick();
                  setMobileMenuOpen(false);
                }}
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => {
                  onExploreClick();
                  setMobileMenuOpen(false);
                }}
              >
                Explore All Books
              </button>
              <button
                type="button"
                onClick={() => {
                  onBestsellersClick();
                  setMobileMenuOpen(false);
                }}
              >
                Bestsellers & Classics
              </button>
              <button
                type="button"
                onClick={() => {
                  setWishlistOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                Saved Wishlist ({wishlistCount})
              </button>
              <button
                type="button"
                onClick={() => {
                  setCartOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                Shopping Bag ({cartCount} items · ₹{subtotal.toLocaleString("en-IN")})
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
