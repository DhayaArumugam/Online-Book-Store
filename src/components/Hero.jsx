import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  BookMarked,
  TrendingUp,
} from "lucide-react";
import { useCart } from "../context/useCart";
import { books } from "../data/books";

export default function Hero({ onExploreClick, onBestsellersClick }) {
  const { openQuickView, addToCart } = useCart();

  // Pick 3 standout spotlight books
  const featuredBook = books.find((b) => b.id === 1) || books[0]; // Atomic Habits
  const bookTwo = books.find((b) => b.id === 7) || books[1]; // Psychology of Money
  const bookThree = books.find((b) => b.id === 13) || books[2]; // The Alchemist

  return (
    <section className="hero-section">
      <div className="hero-backdrop-gradient" aria-hidden="true" />

      <div className="hero-container">
        {/* Left Column: Editorial Copy & CTAs */}
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} className="hero-badge-icon" />
            <span>Independent Literary Curation</span>
          </div>

          <h1 className="hero-headline">
            Stories that shape you.
            <br />
            <span className="hero-gradient-text">Ideas that endure.</span>
          </h1>

          <p className="hero-subtext">
            Immerse yourself in handpicked paperbacks, modern masterworks, and
            timeless perspectives. Thoughtfully curated for readers who value depth.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={onExploreClick}
            >
              <span>Explore Collection</span>
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={onBestsellersClick}
            >
              <TrendingUp size={16} />
              <span>Bestsellers</span>
            </button>
          </div>

          {/* Social Proof / Trust Highlights */}
          <div className="hero-metrics-bar">
            <div className="metric-item">
              <div className="metric-icon-wrap">
                <Star size={16} className="star-gold" />
              </div>
              <div className="metric-info">
                <strong>4.9 / 5.0</strong>
                <span>from 12k+ readers</span>
              </div>
            </div>

            <div className="metric-separator" aria-hidden="true" />

            <div className="metric-item">
              <div className="metric-icon-wrap">
                <ShieldCheck size={16} className="shield-green" />
              </div>
              <div className="metric-info">
                <strong>100% Genuine</strong>
                <span>Original prints</span>
              </div>
            </div>

            <div className="metric-separator" aria-hidden="true" />

            <div className="metric-item">
              <div className="metric-icon-wrap">
                <BookMarked size={16} className="book-accent" />
              </div>
              <div className="metric-info">
                <strong>50+ Curated</strong>
                <span>Top shelf classics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Book Visual Showcase */}
        <div className="hero-visual">
          <div className="hero-art-stage">
            {/* Ambient Backlight Glow */}
            <div className="glow-orb orb-1" aria-hidden="true" />
            <div className="glow-orb orb-2" aria-hidden="true" />

            {/* Background floating books with 3D tilt */}
            <div
              className="showcase-card showcase-side showcase-left"
              onClick={() => openQuickView(bookTwo)}
              title={`Quick preview: ${bookTwo.title}`}
            >
              <img
                src={bookTwo.image}
                alt={bookTwo.title}
                loading="eager"
              />
              <span className="mini-badge">Finance #1</span>
            </div>

            <div
              className="showcase-card showcase-side showcase-right"
              onClick={() => openQuickView(bookThree)}
              title={`Quick preview: ${bookThree.title}`}
            >
              <img
                src={bookThree.image}
                alt={bookThree.title}
                loading="eager"
              />
              <span className="mini-badge">Fiction Classic</span>
            </div>

            {/* Primary Hero Spotlight Book */}
            <div className="showcase-card showcase-center">
              <div className="spotlight-tag">
                <Sparkles size={12} /> Staff Spotlight
              </div>

              <div
                className="spotlight-cover"
                onClick={() => openQuickView(featuredBook)}
              >
                <img
                  src={featuredBook.image}
                  alt={featuredBook.title}
                  loading="eager"
                />
                <div className="spine-highlight" aria-hidden="true" />
              </div>

              <div className="spotlight-card-body">
                <div className="spotlight-header">
                  <span className="spotlight-category">
                    {featuredBook.category}
                  </span>
                  <span className="spotlight-rating">
                    <Star size={12} fill="#F59E0B" color="#F59E0B" />{" "}
                    {featuredBook.rating}
                  </span>
                </div>

                <h3 className="spotlight-title">{featuredBook.title}</h3>
                <p className="spotlight-author">by {featuredBook.author}</p>

                <div className="spotlight-footer">
                  <div className="spotlight-price">
                    <span className="current-price">₹{featuredBook.price}</span>
                    <span className="original-price">
                      ₹{featuredBook.originalPrice}
                    </span>
                  </div>

                  <div className="spotlight-buttons">
                    <button
                      type="button"
                      className="btn-quick-preview"
                      onClick={() => openQuickView(featuredBook)}
                    >
                      Quick View
                    </button>
                    <button
                      type="button"
                      className="btn-spotlight-add"
                      onClick={() => addToCart(featuredBook)}
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
