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

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Recipes</h1>

      {recipes.length === 0 && (
        <p className="text-gray-500">No recipes yet.</p>
      )}

      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          className="border rounded p-4 shadow-sm"
        >
          <h2 className="text-lg font-semibold">{recipe.title}</h2>
          {recipe.servings && (
            <p className="text-sm text-gray-600">
              Servings: {recipe.servings}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
