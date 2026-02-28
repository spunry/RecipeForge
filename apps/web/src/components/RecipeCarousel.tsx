"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import type { Recipe } from "@/types/recipe";

export default function RecipeCarousel() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Recipe[]>("/recipes")
      .then((data) => {
        // Repeat the recipes to ensure a seamless infinite scroll even with few items
        const repeated = [];
        while (repeated.length < 20 && data.length > 0) {
          repeated.push(...data);
        }
        setRecipes(repeated.length > 0 ? repeated : data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || recipes.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden py-10">
      <div className="flex w-max animate-scroll pause-on-hover">
        {recipes.map((recipe, index) => (
          <Link
            key={`${recipe.id}-${index}`}
            href={`/recipes/${recipe.id}`}
            className="w-72 mx-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all group shrink-0"
          >
            <div className="relative h-40 w-full mb-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
              {recipe.imageUrl ? (
                <Image
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-zinc-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
                    <path d="M12 13V7" />
                    <path d="M12 17h.01" />
                  </svg>
                </div>
              )}
            </div>
            <h3 className="font-bold text-lg mb-1 truncate group-hover:text-orange-500 transition-colors">
              {recipe.title}
            </h3>
            {recipe.description && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 h-10 mb-2">
                {recipe.description}
              </p>
            )}
            <div className="flex items-center gap-3 text-xs text-zinc-500 font-medium">
              {recipe.servings && <span>{recipe.servings} Servings</span>}
              {recipe.cookMinutes && <span>{recipe.cookMinutes} Mins</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
