
const categories = [
  "Fiction",
  "Science",
  "History",
  "Business",
  "Romance",
  "Fantasy",
  "Technology",
  "Education",
];

export default function CategoryFilter({ onSelectCategory }) {
  return (
    <div className="category-filter">
      {categories.map((category) => (
        <button
          type="button"
          key={category}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
