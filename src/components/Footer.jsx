import { BookOpen, ArrowUp, Heart, Shield, Truck, RefreshCw } from "lucide-react";

export default function Footer({ onCategoryClick }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const categories = [
    "Self-Help",
    "Finance",
    "Fiction",
    "Technology",
    "Business",
    "Science",
    "Fantasy",
  ];

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-main-grid">
          {/* Column 1: Brand Info */}
          <div className="footer-col footer-col-brand">
            <div className="footer-brand">
              <div className="footer-logo-mark">
                <BookOpen size={20} />
              </div>
              <span className="footer-brand-name">BookNest</span>
            </div>

            <p className="footer-desc">
              Your destination for handpicked paperbacks, modern masterworks, and
              ideas worth sharing. Crafted with care for passionate readers.
            </p>

            <div className="footer-perks-list">
              <span className="perk-tag">
                <Shield size={12} /> Genuine Prints
              </span>
              <span className="perk-tag">
                <Truck size={12} /> Free Express Delivery
              </span>
              <span className="perk-tag">
                <RefreshCw size={12} /> 7-Day Returns
              </span>
            </div>
          </div>

          {/* Column 2: Curated Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">Top Categories</h4>
            <ul className="footer-links-list">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    className="footer-link-btn"
                    onClick={() => onCategoryClick?.(cat)}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="footer-col">
            <h4 className="footer-heading">Customer Care</h4>
            <ul className="footer-links-list">
              <li>
                <a href="#books" className="footer-link-text">
                  Delivery & Shipping Rates
                </a>
              </li>
              <li>
                <a href="#books" className="footer-link-text">
                  7-Day Return Policy
                </a>
              </li>
              <li>
                <a href="#books" className="footer-link-text">
                  Order Tracking
                </a>
              </li>
              <li>
                <a href="#books" className="footer-link-text">
                  Packaging Guarantee
                </a>
              </li>
              <li>
                <a href="#books" className="footer-link-text">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Payment & Security */}
          <div className="footer-col">
            <h4 className="footer-heading">Payment & Security</h4>
            <p className="footer-security-text">
              We support all major payment options with bank-grade 256-bit encryption.
            </p>

            <div className="payment-badges-row">
              <span className="pay-badge">UPI</span>
              <span className="pay-badge">Google Pay</span>
              <span className="pay-badge">PhonePe</span>
              <span className="pay-badge">Visa</span>
              <span className="pay-badge">Mastercard</span>
              <span className="pay-badge">RuPay</span>
              <span className="pay-badge">COD</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © 2026 BookNest. Curated with{" "}
            <Heart size={12} fill="#EF4444" color="#EF4444" style={{ display: "inline", verticalAlign: "middle" }} />{" "}
            for book lovers worldwide.
          </p>

          <button
            type="button"
            className="btn-back-to-top"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
