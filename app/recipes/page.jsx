// app/recipes/page.tsx - Recipes List Page
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { unstable_cache } from "next/cache";

// Loading component for Suspense
function LoadingState() {
  return (
    <div className="w-full flex justify-center items-center min-h-96">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Fetching recipes...</p>
      </div>
    </div>
  );
}

// Cache the API call for 1 minute (60,000 ms)
const fetchRecipes = unstable_cache(
  async (query, cuisine, maxReadyTime) => {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const params = new URLSearchParams();

    if (query) params.append("query", query);
    if (cuisine) params.append("cuisine", cuisine);
    if (maxReadyTime) params.append("maxReadyTime", maxReadyTime);
    params.append("apiKey", apiKey);

    const url = `https://api.spoonacular.com/recipes/complexSearch?${params.toString()}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error fetching recipes: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
      throw error;
    }
  },
  ["recipes-search"],
  { revalidate: 60 } // Cache for 1 minute
);

// RecipeList component
async function RecipeList({ query, cuisine, maxReadyTime }) {
  const data = await fetchRecipes(query, cuisine, maxReadyTime);

  if (!data || !data.results || data.results.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold">No recipes found</h2>
        <p className="mt-2 text-gray-600">Try different search criteria</p>
        <Link
          href="/"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          Back to Search
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.results.map((recipe) => (
        <Link
          href={`/recipes/${recipe.id}`}
          key={recipe.id}
          className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="relative h-48 w-full">
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h2 className="text-lg font-semibold line-clamp-2">
              {recipe.title}
            </h2>
          </div>
        </Link>
      ))}
    </div>
  );
}

// Main page component
export default function RecipesPage({ searchParams }) {
  const query = searchParams.query || "";
  const cuisine = searchParams.cuisine || "";
  const maxReadyTime = searchParams.maxReadyTime || "";

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Recipes Results</h1>
        <Link
          href="/"
          className="bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-800 transition-colors"
        >
          New Search
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {query && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            Search: {query}
          </span>
        )}
        {cuisine && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Cuisine: {cuisine}
          </span>
        )}
        {maxReadyTime && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            Max Time: {maxReadyTime} mins
          </span>
        )}
      </div>

      <Suspense fallback={<LoadingState />}>
        <RecipeList
          query={query}
          cuisine={cuisine}
          maxReadyTime={maxReadyTime}
        />
      </Suspense>
    </main>
  );
}
