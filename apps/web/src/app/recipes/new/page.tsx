"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface IngredientInput {
  name: string;
  quantity: string;
  unit: string;
}

interface StepInput {
  instruction: string;
}

export default function NewRecipePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category: string;
    servings: number | undefined;
    prepMinutes: number | undefined;
    cookMinutes: number | undefined;
    imageUrl: string;
  }>({
    title: "",
    description: "",
    category: "",
    servings: 1,
    prepMinutes: 0,
    cookMinutes: 0,
    imageUrl: "",
  });

  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  useEffect(() => {
    api<string[]>("/recipes/meta/categories")
      .then(setExistingCategories)
      .catch(console.error);
  }, []);

  const [ingredients, setIngredients] = useState<IngredientInput[]>([
    { name: "", quantity: "", unit: "" },
  ]);

  const [steps, setSteps] = useState<StepInput[]>([{ instruction: "" }]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? undefined : parseInt(value)) : value,
    }));
  };

  const handleIngredientChange = (index: number, field: keyof IngredientInput, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index].instruction = value;
    setSteps(newSteps);
  };

  const addStep = () => {
    setSteps([...steps, { instruction: "" }]);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Clean payload: remove empty strings and use undefined for optional fields
    const payload = {
      ...formData,
      description: formData.description.trim() || undefined,
      category: formData.category.trim() || undefined,
      imageUrl: formData.imageUrl.trim() || undefined,
      ingredients: ingredients
        .filter(ing => ing.name.trim() !== "")
        .map(ing => ({
          ...ing,
          quantity: ing.quantity.trim() || undefined,
          unit: ing.unit.trim() || undefined,
        })),
      steps: steps
        .filter(step => step.instruction.trim() !== "")
        .map((step, index) => ({ instruction: step.instruction, order: index })),
    };

    try {
      await api("/recipes", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      router.push("/recipes");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8 tracking-tight">Create New Recipe</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-6 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h2 className="text-xl font-bold border-b pb-2">Basic Info</h2>
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Recipe Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Dragon Breath Chili"
              className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Category
            </label>
            <div className="space-y-3">
              <select
                id="category-select"
                className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                value={showNewCategoryInput ? "other" : formData.category}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "other") {
                    setShowNewCategoryInput(true);
                    setFormData(prev => ({ ...prev, category: "" }));
                  } else {
                    setShowNewCategoryInput(false);
                    setFormData(prev => ({ ...prev, category: val }));
                  }
                }}
              >
                <option value="">Select a category</option>
                {existingCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value="other">+ Add New Category (Other)</option>
              </select>

              {showNewCategoryInput && (
                <input
                  type="text"
                  id="category"
                  name="category"
                  required
                  autoFocus
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Type new category name..."
                  className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all animate-in slide-in-from-top-1 duration-200"
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us a bit about this dish..."
              className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="imageUrl" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Recipe Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/yummy-dish.jpg"
              className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="servings" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Servings
              </label>
              <input
                type="number"
                id="servings"
                name="servings"
                min="1"
                value={formData.servings ?? ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="prepMinutes" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Prep (mins)
              </label>
              <input
                type="number"
                id="prepMinutes"
                name="prepMinutes"
                min="0"
                value={formData.prepMinutes ?? ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="cookMinutes" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Cook (mins)
              </label>
              <input
                type="number"
                id="cookMinutes"
                name="cookMinutes"
                min="0"
                value={formData.cookMinutes ?? ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Ingredients Section */}
        <div className="space-y-4 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-xl font-bold">Ingredients</h2>
            <button
              type="button"
              onClick={addIngredient}
              className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors"
            >
              + Add Ingredient
            </button>
          </div>
          <div className="space-y-3">
            {ingredients.map((ing, index) => (
              <div key={index} className="flex gap-2 items-start">
                <input
                  type="text"
                  placeholder="Qty"
                  value={ing.quantity}
                  onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
                  className="w-20 px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-sm focus:border-orange-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Unit"
                  value={ing.unit}
                  onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                  className="w-24 px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-sm focus:border-orange-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Ingredient name"
                  value={ing.name}
                  onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                  className="flex-1 px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-sm focus:border-orange-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                  disabled={ingredients.length === 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Steps Section */}
        <div className="space-y-4 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-xl font-bold">Cooking Steps</h2>
            <button
              type="button"
              onClick={addStep}
              className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors"
            >
              + Add Step
            </button>
          </div>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 mt-1">
                  {index + 1}
                </div>
                <textarea
                  placeholder={`Step ${index + 1} instructions...`}
                  value={step.instruction}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                  rows={2}
                  className="flex-1 px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-sm focus:border-orange-500 outline-none resize-none"
                />
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="p-2 text-zinc-400 hover:text-red-500 transition-colors mt-1"
                  disabled={steps.length === 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 border border-zinc-200 dark:border-zinc-800 rounded-lg font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-black dark:bg-zinc-50 text-white dark:text-black px-6 py-3 rounded-lg font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? "Creating..." : "Forge Recipe"}
          </button>
        </div>
      </form>
    </div>
  );
}
