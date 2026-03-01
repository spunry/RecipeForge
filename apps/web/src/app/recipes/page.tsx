"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import { formatMinutes } from "@/lib/format";
import type { Recipe } from "@/types/recipe";
import Link from "next/link";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const fetchRecipes = useCallback((searchTerm: string = "") => {
    setLoading(true);
    const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : "";
    api<Recipe[]>(`/recipes${query}`)
      .then(setRecipes)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let ignore = false;
    api<Recipe[]>(`/recipes`).then((res) => {
      if (!ignore) {
        setRecipes(res);
        setLoading(false);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  const categories = Array.from(
    new Set(
      recipes
        .map((r) => r.category)
        .filter((c): c is string => !!c && c.trim() !== ""),
    ),
  ).sort();

  const filteredRecipes = selectedCategory
    ? recipes.filter((r) => r.category === selectedCategory)
    : recipes;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedCategory(null);
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
        <div className="flex w-full md:w-auto gap-3 items-center">
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

          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as "grid" | "list")}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer font-medium"
          >
            <option value="grid">Grid</option>
            <option value="list">List</option>
          </select>

          <Link
            href="/recipes/new"
            className="bg-black dark:bg-zinc-50 text-white dark:text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm shrink-0 flex items-center"
          >
            + New Recipe
          </Link>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-4 border-b border-zinc-100 dark:border-zinc-900">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
              selectedCategory === null
                ? "bg-black dark:bg-zinc-50 text-white dark:text-black border-black dark:border-zinc-50 shadow-sm"
                : "bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                selectedCategory === category
                  ? "bg-black dark:bg-zinc-50 text-white dark:text-black border-black dark:border-zinc-50 shadow-sm"
                  : "bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-zinc-500">Searching recipes...</div>
      ) : filteredRecipes.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-500">
            {selectedCategory 
              ? `No recipes found in the "${selectedCategory}" category.` 
              : search 
                ? `No recipes found for "${search}"` 
                : "No recipes found. Start by adding one!"}
          </p>
          {(search || selectedCategory) && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory(null);
                fetchRecipes("");
              }}
              className="mt-4 text-orange-500 font-semibold hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRecipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              className="group border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:shadow-md transition-all bg-white dark:bg-zinc-900 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div className="space-y-1">
                    {recipe.category && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500">
                        {recipe.category}
                      </span>
                    )}
                    <h2 className="text-xl font-bold group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
                      {recipe.title}
                    </h2>
                  </div>
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
                  <span>{formatMinutes(recipe.cookMinutes)} Cook</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredRecipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              className="group flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:shadow-sm transition-all bg-white dark:bg-zinc-900"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 flex-1 min-w-0">
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-bold truncate group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
                    {recipe.title}
                  </h2>
                </div>
                
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                  {recipe.category && (
                    <span className="text-orange-500 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded whitespace-nowrap">
                      {recipe.category}
                    </span>
                  )}
                  <div className="flex items-center gap-3 text-zinc-400 whitespace-nowrap">
                    {recipe.servings && <span>{recipe.servings} Servings</span>}
                    {recipe.cookMinutes && (
                      <span>{formatMinutes(recipe.cookMinutes)} Cook</span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDelete(recipe.id);
                }}
                className="ml-4 p-2 text-zinc-400 hover:text-red-500 transition-colors"
                title="Delete Recipe"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
