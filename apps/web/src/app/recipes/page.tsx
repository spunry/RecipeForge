"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Recipe } from "@/types/recipe";
import Link from "next/link";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchRecipes = (searchTerm: string = "") => {
    setLoading(true);
    const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : "";
    api<Recipe[]>(`/recipes${query}`)
      .then(setRecipes)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecipes(search);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    try {
      await api(`/recipes/${id}`, { method: "DELETE" });
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete recipe");
    }
  };

  if (loading && recipes.length === 0)
    return (
      <div className="py-10 text-center text-zinc-500">Loading recipes...</div>
    );

  return (
    <div className="px-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Recipes</h1>
        <div className="flex w-full md:w-auto gap-3">
          <form onSubmit={handleSearch} className="relative flex-1 md:w-80 flex gap-2">
            <input
              type="text"
              placeholder="Search recipes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
            <button
              type="submit"
              className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all border border-zinc-200 dark:border-zinc-700"
            >
              Search
            </button>
          </form>
          <Link
            href="/recipes/new"
            className="bg-black dark:bg-zinc-50 text-white dark:text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm shrink-0 flex items-center"
          >
            + New Recipe
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-zinc-500">Searching recipes...</div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-500">
            {search ? `No recipes found for "${search}"` : "No recipes found. Start by adding one!"}
          </p>
          {search && (
            <button
              onClick={() => {
                setSearch("");
                fetchRecipes("");
              }}
              className="mt-4 text-orange-500 font-semibold hover:underline"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              className="group border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:shadow-md transition-all bg-white dark:bg-zinc-900 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
                    {recipe.title}
                  </h2>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDelete(recipe.id);
                    }}
                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors relative z-10"
                    title="Delete Recipe"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>
                {recipe.description && (
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 line-clamp-2">
                    {recipe.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                {recipe.servings && <span>{recipe.servings} Servings</span>}
                {recipe.cookMinutes && (
                  <span>{recipe.cookMinutes} Mins Cook</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
