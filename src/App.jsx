import { useMemo, useState, useRef } from "react";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  RotateCcw,
  Sparkles,
  BookOpen,
} from "lucide-react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturesBanner from "./components/FeaturesBanner";
import BookCard from "./components/BookCard";
import BookDetailsModal from "./components/BookDetailsModal";
import Cart from "./components/Cart";
import WishlistDrawer from "./components/WishlistDrawer";
import Checkout from "./components/Checkout";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import ToastContainer from "./components/ToastContainer";

import { books } from "./data/books";
import { useCart } from "./context/useCart";

import "./assets/styles/global.css";

const categories = [
  "All",
  "Self-Help",
  "Finance",
  "Fiction",
  "Technology",
  "Business",
  "Lifestyle",
  "Science",
  "Biography",
  "Fantasy",
  "Design",
];

function StoreContent() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured"); // featured, rating-desc, price-asc, price-desc, title-asc
  const [priceRange, setPriceRange] = useState("all"); // all, under-300, 300-500, above-500
  const [minRating, setMinRating] = useState("all"); // all, 4.5
  const [viewMode, setViewMode] = useState("grid"); // grid, list
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const catalogRef = useRef(null);

  const {
    cartOpen,
    setCartOpen,
    wishlistOpen,
    setWishlistOpen,
    quickViewBook,
  } = useCart();

  const scrollToCatalog = () => {
    setCheckoutOpen(false);
    setTimeout(() => {
      catalogRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleSelectBestsellers = () => {
    setSelectedCategory("All");
    setSortBy("rating-desc");
    scrollToCatalog();
  };

  const handleCategoryFromFooter = (cat) => {
    setSelectedCategory(cat);
    scrollToCatalog();
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedCategory !== "All" ||
    sortBy !== "featured" ||
    priceRange !== "all" ||
    minRating !== "all";

  const resetAllFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSortBy("featured");
    setPriceRange("all");
    setMinRating("all");
  };

  // Filter and Sort Pipeline
  const filteredAndSortedBooks = useMemo(() => {
    const query = search.trim().toLowerCase();

    // 1. Filtering
    const result = books.filter((book) => {
      // Search matching (title, author, category)
      const matchesSearch =
        !query ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query);

      // Category matching
      const matchesCategory =
        selectedCategory === "All" || book.category === selectedCategory;

      // Price range matching
      let matchesPrice = true;
      if (priceRange === "under-300") {
        matchesPrice = book.price < 300;
      } else if (priceRange === "300-500") {
        matchesPrice = book.price >= 300 && book.price <= 500;
      } else if (priceRange === "above-500") {
        matchesPrice = book.price > 500;
      }

      // Rating matching
      let matchesRating = true;
      if (minRating === "4.5") {
        matchesRating = (book.rating || 0) >= 4.5;
      }

      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });

    // 2. Sorting
    return [...result].sort((a, b) => {
      if (sortBy === "rating-desc") {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === "price-asc") {
        return a.price - b.price;
      }
      if (sortBy === "price-desc") {
        return b.price - a.price;
      }
      if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
      }
      // 'featured': preserve natural editorial list ordering
      return 0;
    });
  }, [search, selectedCategory, priceRange, minRating, sortBy]);

  return (
    <div className="app-layout">
      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Main Navbar */}
      <Navbar
        searchTerm={search}
        onSearchChange={(val) => {
          setSearch(val);
          if (checkoutOpen) setCheckoutOpen(false);
        }}
        onHomeClick={() => {
          setCheckoutOpen(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onExploreClick={scrollToCatalog}
        onBestsellersClick={handleSelectBestsellers}
      />

      {/* Main Content Router (Store vs Checkout) */}
      {checkoutOpen ? (
        <Checkout
          onBack={() => setCheckoutOpen(false)}
          onCompleteOrder={() => {
            // order state managed in Checkout
          }}
        />
      ) : (
        <main className="main-content">
          {/* Hero Section */}
          <Hero
            onExploreClick={scrollToCatalog}
            onBestsellersClick={handleSelectBestsellers}
          />

          {/* Trust Highlights Row */}
          <FeaturesBanner />

          {/* Books Catalog Section */}
          <section
            ref={catalogRef}
            id="books"
            className="catalog-section"
            aria-labelledby="catalog-heading"
          >
            {/* Catalog Section Header */}
            <div className="catalog-header-bar">
              <div className="catalog-heading-left">
                <span className="eyebrow-chip">
                  <Sparkles size={12} /> THE CURATED BOOKSHELF
                </span>
                <h2 id="catalog-heading" className="catalog-title">
                  Discover Your Next Read
                </h2>
                <p className="catalog-subtitle">
                  Browse handpicked paperbacks, classic literature, and contemporary insights.
                </p>
              </div>

              <div className="catalog-results-stats">
                <span className="count-pill">
                  <strong>{filteredAndSortedBooks.length}</strong> of {books.length} books
                </span>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="category-chips-scroll" role="tablist" aria-label="Book categories">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    className={`category-chip-btn ${isSelected ? "is-selected" : ""}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Filter & Sort Controls Toolbar */}
            <div className="catalog-toolbar">
              <div className="toolbar-left-filters">
                {/* Search Box inside catalog */}
                <div className="toolbar-search-wrap">
                  <Search size={15} className="toolbar-search-icon" />
                  <input
                    type="search"
                    placeholder="Search by title, author, or keyword..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Filter catalog books"
                  />
                  {search && (
                    <button
                      type="button"
                      className="toolbar-search-clear"
                      onClick={() => setSearch("")}
                      aria-label="Clear keyword search"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Price Range Filter */}
                <div className="filter-group">
                  <span className="filter-label">Price:</span>
                  <div className="filter-pills-row">
                    <button
                      type="button"
                      className={`filter-pill-btn ${priceRange === "all" ? "active" : ""}`}
                      onClick={() => setPriceRange("all")}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      className={`filter-pill-btn ${priceRange === "under-300" ? "active" : ""}`}
                      onClick={() => setPriceRange("under-300")}
                    >
                      Under ₹300
                    </button>
                    <button
                      type="button"
                      className={`filter-pill-btn ${priceRange === "300-500" ? "active" : ""}`}
                      onClick={() => setPriceRange("300-500")}
                    >
                      ₹300 - ₹500
                    </button>
                    <button
                      type="button"
                      className={`filter-pill-btn ${priceRange === "above-500" ? "active" : ""}`}
                      onClick={() => setPriceRange("above-500")}
                    >
                      ₹500+
                    </button>
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="filter-group">
                  <span className="filter-label">Rating:</span>
                  <div className="filter-pills-row">
                    <button
                      type="button"
                      className={`filter-pill-btn ${minRating === "all" ? "active" : ""}`}
                      onClick={() => setMinRating("all")}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      className={`filter-pill-btn ${minRating === "4.5" ? "active" : ""}`}
                      onClick={() => setMinRating("4.5")}
                    >
                      ★ 4.5+
                    </button>
                  </div>
                </div>
              </div>

              {/* Toolbar Right: Sorting & View Mode Switch */}
              <div className="toolbar-right-controls">
                <div className="sort-dropdown-wrap">
                  <SlidersHorizontal size={14} className="sort-icon" />
                  <label htmlFor="sort-select" className="sr-only">
                    Sort books by
                  </label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select-input"
                  >
                    <option value="featured">Featured & Curated</option>
                    <option value="rating-desc">Highest Rated (★)</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="title-asc">Title: A to Z</option>
                  </select>
                </div>

                {/* Grid / List View Toggle */}
                <div className="view-mode-toggle" aria-label="Display mode">
                  <button
                    type="button"
                    className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid layout"
                    title="Grid view"
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    type="button"
                    className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                    onClick={() => setViewMode("list")}
                    aria-label="List layout"
                    title="List view"
                  >
                    <List size={16} />
                  </button>
                </div>

                {/* Reset Filters Button */}
                {hasActiveFilters && (
                  <button
                    type="button"
                    className="btn-reset-filters"
                    onClick={resetAllFilters}
                    title="Reset all active filters"
                  >
                    <RotateCcw size={13} />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Book Cards Grid / List Display */}
            {filteredAndSortedBooks.length > 0 ? (
              <div
                className={`books-display-container ${
                  viewMode === "list" ? "books-list-view" : "books-grid-view"
                }`}
              >
                {filteredAndSortedBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="catalog-empty-state">
                <div className="empty-book-icon">
                  <BookOpen size={44} />
                </div>
                <h3>No books match your criteria</h3>
                <p>
                  We couldn't find any titles matching your current filter combination.
                  Try clearing some filters or searching with different terms.
                </p>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={resetAllFilters}
                >
                  <RotateCcw size={15} />
                  <span>Clear All Filters</span>
                </button>
              </div>
            )}
          </section>

          {/* Community Newsletter Subscription */}
          <Newsletter />

          {/* Footer */}
          <Footer onCategoryClick={handleCategoryFromFooter} />
        </main>
      )}

      {/* Quick View Modal */}
      <BookDetailsModal
        key={quickViewBook?.id || "modal"}
        onBuyNow={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      {/* Cart Slide-over Drawer */}
      {cartOpen && (
        <Cart
          onClose={() => setCartOpen(false)}
          onCheckout={() => {
            setCartOpen(false);
            setCheckoutOpen(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}

      {/* Wishlist Slide-over Drawer */}
      {wishlistOpen && (
        <WishlistDrawer onClose={() => setWishlistOpen(false)} />
      )}
    </div>
  );
}

export default function App() {
  return <StoreContent />;
}
