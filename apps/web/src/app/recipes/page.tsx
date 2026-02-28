"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Recipe } from "@/types/recipe";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Recipe[]>("/recipes")
      .then(setRecipes)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-10 text-center text-zinc-500">Loading recipes...</div>;

  return (
    <div className="px-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Recipes</h1>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-500">No recipes found. Start by adding one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="group border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:shadow-md transition-all bg-white dark:bg-zinc-900"
            >
              <h2 className="text-xl font-bold mb-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
                {recipe.title}
              </h2>
              {recipe.description && (
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4 line-clamp-2">
                  {recipe.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                {recipe.servings && (
                  <span>{recipe.servings} Servings</span>
                )}
                {recipe.cookMinutes && (
                  <span>{recipe.cookMinutes} Mins Cook</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
