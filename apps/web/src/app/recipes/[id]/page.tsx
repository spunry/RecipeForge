"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Recipe } from "@/types/recipe";
import Link from "next/link";

export default function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Recipe>(`/recipes/${id}`)
      .then(setRecipe)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to load recipe"),
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    try {
      await api(`/recipes/${id}`, { method: "DELETE" });
      router.push("/recipes");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete recipe");
    }
  };

  if (loading)
    return (
      <div className="py-20 text-center text-zinc-500">
        Loading recipe details...
      </div>
    );
  if (error || !recipe)
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-red-500">{error || "Recipe not found"}</p>
        <Link href="/recipes" className="text-zinc-600 underline">
          Back to Recipes
        </Link>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Link
            href="/recipes"
            className="text-sm font-medium text-zinc-500 hover:text-zinc-800 transition-colors flex items-center gap-1"
          >
            ← Back to Recipes
          </Link>
          <h1 className="text-4xl font-extrabold tracking-tight">
            {recipe.title}
          </h1>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/recipes/${id}/edit`}
            className="p-2.5 text-zinc-500 hover:text-black dark:hover:text-white border border-zinc-200 dark:border-zinc-800 rounded-lg transition-colors"
            title="Edit Recipe"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </Link>
          <button
            onClick={handleDelete}
            className="p-2.5 text-zinc-400 hover:text-red-500 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-colors"
            title="Delete Recipe"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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
      </div>

      {recipe.imageUrl && (
        <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-zinc-100 dark:border-zinc-900">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="grid grid-cols-3 gap-6 py-6 border-y border-zinc-100 dark:border-zinc-900">
        <div className="text-center space-y-1">
          <p className="text-xs font-bold uppercase text-zinc-400 tracking-widest">
            Servings
          </p>
          <p className="text-xl font-semibold">{recipe.servings || "--"}</p>
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs font-bold uppercase text-zinc-400 tracking-widest">
            Prep Time
          </p>
          <p className="text-xl font-semibold">
            {recipe.prepMinutes ? `${recipe.prepMinutes}m` : "--"}
          </p>
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs font-bold uppercase text-zinc-400 tracking-widest">
            Cook Time
          </p>
          <p className="text-xl font-semibold">
            {recipe.cookMinutes ? `${recipe.cookMinutes}m` : "--"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 11 6a7 7 0 0 1 0 14Zm0-11v4m-2-2h4"/><path d="M11 2v4"/><path d="M11 21v1"/><path d="M11 21a1 1 0 0 0 1 1h6a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-6a1 1 0 0 0-1 1Z"/></svg>
              Ingredients
            </h2>
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              <ul className="space-y-3">
                {recipe.ingredients.map((item, idx) => (
                  <li key={idx} className="text-zinc-600 dark:text-zinc-400 text-sm flex gap-2 border-b border-zinc-50 dark:border-zinc-900 pb-2">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 min-w-[3rem]">
                      {item.quantity} {item.unit}
                    </span>
                    <span>{item.ingredient.name}</span>
                    {item.note && <span className="text-zinc-400 italic">({item.note})</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-zinc-400 italic">No ingredients listed.</p>
            )}
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          {recipe.description && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold">About this recipe</h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">
                {recipe.description}
              </p>
            </div>
          )}

          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              Instructions
            </h2>
            {recipe.steps && recipe.steps.length > 0 ? (
              <div className="space-y-6">
                {recipe.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-none w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed pt-1">
                      {step.instruction}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-400 italic">No instructions provided.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
