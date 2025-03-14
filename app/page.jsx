// app/page.tsx - Search Page (Home Page)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [maxReadyTime, setMaxReadyTime] = useState("");

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
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Recipe Finder</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="query"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              What would you like to cook?
            </label>
            <input
              type="text"
              id="query"
              placeholder="e.g., pasta, chicken, salad"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label
              htmlFor="cuisine"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Cuisine Type
            </label>
            <select
              id="cuisine"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Select cuisine (optional)</option>
              <option value="Italian">Italian</option>
              <option value="Mexican">Mexican</option>
              <option value="Chinese">Chinese</option>
              <option value="Indian">Indian</option>
              <option value="Japanese">Japanese</option>
              <option value="Mediterranean">Mediterranean</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="maxReadyTime"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Maximum Preparation Time (minutes)
            </label>
            <input
              type="number"
              id="maxReadyTime"
              placeholder="e.g., 30"
              min="1"
              value={maxReadyTime}
              onChange={(e) => setMaxReadyTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-2 px-4 rounded-md font-medium text-white ${
              isFormValid
                ? "bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </form>
      </div>
    </main>
  );
}
