
import { useEffect, useState } from "react";
import { fetchBooks } from "../services/bookService";
import BookCard from "./BookCard";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";

export default function BookList({ onAddToCart }) {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("subject:fiction");
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadBooks() {
      setLoading(true);
      setError("");

      try {
        const result = await fetchBooks({
          query,
          page,
          limit: 24,
        });

        if (!cancelled) {
          setBooks(result.books);
          setTotalItems(result.totalItems);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load books.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadBooks();

    return () => {
      cancelled = true;
    };
  }, [query, page]);

  function handleSearch(value) {
    if (!value.trim()) return;

    setPage(0);
    setQuery(value.trim());
  }

  function handleCategory(category) {
    setPage(0);
    setQuery(`subject:${category}`);
  }

  return (
    <section className="book-list">
      <div className="book-list-header">
        <div>
          <h2>Explore Our Books</h2>
          <p>Discover your next favorite read.</p>
        </div>

        <SearchBar onSearch={handleSearch} />
      </div>

      <CategoryFilter onSelectCategory={handleCategory} />

      {loading && <p>Loading books...</p>}

      {!loading && error && (
        <p role="alert">{error}</p>
      )}

      {!loading && !error && (
        <>
          <p className="book-count">
            {totalItems.toLocaleString()} books available
            {` · Page ${page + 1}`}
          </p>

          {books.length === 0 ? (
            <p>No books found. Try another search.</p>
          ) : (
            <div className="book-grid">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          )}

          <div className="pagination">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>

            <button
              disabled={(page + 1) * 24 >= totalItems}
              onClick={() => setPage((p) => p + 1)}
            >
              Load More
            </button>
          </div>
        </>
      )}
    </section>
  );
}
