"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [maxReadyTime, setMaxReadyTime] = useState("");
  const [loadingImages, setLoadingImages] = useState(true);

  const isFormValid =
    query.trim() !== "" || cuisine !== "" || maxReadyTime !== "";

  const handleSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (query) params.append("query", query);
    if (cuisine) params.append("cuisine", cuisine);
    if (maxReadyTime) params.append("maxReadyTime", maxReadyTime);

    router.push(`/recipes?${params.toString()}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-200 p-6">
      <div className="bg-orange-200 p-8 rounded-2xl shadow-xl w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-center mb-6">Recipe Finder</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              id="query"
              placeholder="e.g., pasta, chicken, salad"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />

            <select
              id="cuisine"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Select cuisine (optional)</option>
              <option value="Italian">Italian</option>
              <option value="Mexican">Mexican</option>
              <option value="Chinese">Chinese</option>
              <option value="Indian">Indian</option>
              <option value="Japanese">Japanese</option>
              <option value="Mediterranean">Mediterranean</option>
            </select>

            <input
              type="number"
              id="maxReadyTime"
              placeholder="e.g., 30"
              min="1"
              value={maxReadyTime}
              onChange={(e) => setMaxReadyTime(e.target.value)}
              className="w-24 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-2 px-4 rounded-full font-medium text-white ${
              isFormValid
                ? "bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Search Recipes
          </button>
        </form>
      </div>

      <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {["/img1.jpg", "/img2.jpg", "/img3.jpg", "/img4.jpg"].map(
          (src, index) => (
            <div
              key={index}
              className="relative w-32 h-32 md:w-40 md:h-40 rounded-lg overflow-hidden shadow-md"
            >
              {loadingImages && (
                <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
              )}

              <Image
                src={src}
                alt={`Food ${index + 1}`}
                fill
                className="object-cover"
                loading="lazy"
                onLoadingComplete={() => setLoadingImages(false)}
              />
            </div>
          )
        )}
      </div>
    </main>
  );
}
