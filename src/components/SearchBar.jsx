
import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(value);
  }

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="search"
        placeholder="Search by book or author..."
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />

      <button type="submit">Search</button>
    </form>
  );
}
