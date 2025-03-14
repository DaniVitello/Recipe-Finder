import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { unstable_cache } from 'next/cache';

// Constants
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/312x231?text=Recipe+Image+Not+Found';

// Loading component for Suspense
function LoadingState() {
  return (
    <div className="flex justify-center items-center min-h-[24rem]">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-gray-600">Loading recipe...</p>
      </div>
    </div>
  );
}

// Cached API fetch with error handling
const fetchRecipeDetails = unstable_cache(
  async (recipeId) => {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;
    const response = await fetch(url, { next: { revalidate: 60 } });
    if (!response.ok) throw new Error(response.status === 404 ? '404' : `${response.status}`);
    return response.json();
  },
  ['recipe-details'],
  { revalidate: 60 }
);

// Reusable Error/Not Found component
function Alert({ type = 'error', message }) {
  const isError = type === 'error';
  return (
    <div className="text-center py-10">
      <h2 className={`text-xl font-semibold ${isError ? 'text-red-600' : 'text-gray-700'}`}>
        {isError ? 'Error' : 'Recipe Not Found'}
      </h2>
      {message && <p className="text-gray-600">{message}</p>}
      <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
        Back to Search
      </Link>
    </div>
  );
}

// Icon components (memoized implicitly by React)
function ClockIcon() {
  return (
    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ServingsIcon() {
  return (
    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

// Recipe subcomponents
function RecipeHeader({ title, image }) {
  return (
    <>
      <div className="relative h-64 md:h-96">
        <Image
          src={image?.startsWith('http') ? image : PLACEHOLDER_IMAGE}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{title}</h1>
    </>
  );
}

function RecipeInfo({ readyInMinutes, servings }) {
  return (
    <div className="flex flex-wrap gap-4 mb-6 text-gray-600">
      <span className="flex items-center">
        <ClockIcon /> Ready in {readyInMinutes} min
      </span>
      <span className="flex items-center">
        <ServingsIcon /> {servings} servings
      </span>
    </div>
  );
}

function IngredientsList({ ingredients }) {
  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-3">Ingredients</h2>
      <ul className="space-y-2 pl-5 list-disc text-gray-700">
        {ingredients.map(({ id, original }) => (
          <li key={id}>{original}</li>
        ))}
      </ul>
    </section>
  );
}

function SummarySection({ summary }) {
  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-3">Summary</h2>
      <div className="text-gray-700 prose max-w-none" dangerouslySetInnerHTML={{ __html: summary }} />
    </section>
  );
}

// Main RecipeDetails component
async function RecipeDetails({ id }) {
  try {
    const recipe = await fetchRecipeDetails(id);
    if (!recipe) return <Alert type="not-found" />;

    return (
      <article className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto p-6">
        <RecipeHeader title={recipe.title} image={recipe.image} />
        <RecipeInfo readyInMinutes={recipe.readyInMinutes} servings={recipe.servings} />
        <IngredientsList ingredients={recipe.extendedIngredients} />
        {recipe.summary && <SummarySection summary={recipe.summary} />}
      </article>
    );
  } catch (error) {
    return <Alert type="error" message={error.message !== '404' ? error.message : null} />;
  }
}

// Dynamic route handler
export default async function RecipeDetailsPage({ params: { id } }) {
  return (
    <Suspense fallback={<LoadingState />}>
      <RecipeDetails id={id} />
    </Suspense>
  );
}


export async function generateMetadata({ params: { id } }) {
  
  try {
    const recipe = await fetchRecipeDetails(id);
    return { title: recipe?.title || 'Recipe Not Found' };
  } catch {
    return { title: 'Error Loading Recipe' };
  }
}