
const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

export async function fetchBooks({
  query = "bestsellers",
  page = 0,
  limit = 24,
} = {}) {
  const safeLimit = Math.max(1, Math.min(limit, 40));

  const params = new URLSearchParams({
    q: query,
    startIndex: String(page * safeLimit),
    maxResults: String(safeLimit),
    printType: "books",
    orderBy: "relevance",
  });

  const response = await fetch(`${BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch books: HTTP ${response.status}`
    );
  }

  const data = await response.json();

  return {
    totalItems: data.totalItems ?? 0,
    books: (data.items ?? []).map((item) => {
      const info = item.volumeInfo ?? {};
      const sale = item.saleInfo ?? {};
      const identifiers = info.industryIdentifiers ?? [];

      return {
        id: item.id,
        title: info.title ?? "Untitled Book",
        author: info.authors?.join(", ") ?? "Unknown Author",
        description: info.description ?? "No description available.",
        category: info.categories?.[0] ?? "General",
        image:
          info.imageLinks?.thumbnail?.replace(/^http:/, "https:") ??
          "",
        rating: info.averageRating ?? null,
        ratingsCount: info.ratingsCount ?? 0,
        publishedDate: info.publishedDate ?? "",
        pageCount: info.pageCount ?? 0,
        language: info.language ?? "en",
        isbn: identifiers.find(
          (item) => item.type === "ISBN_13"
        )?.identifier ?? "",
        price: sale.listPrice?.amount ?? 299,
        currency: sale.listPrice?.currencyCode ?? "INR",
        previewLink: info.previewLink ?? "",
        infoLink: info.infoLink ?? "",
      };
    }),
  };
}
