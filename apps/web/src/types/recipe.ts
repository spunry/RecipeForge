export interface Ingredient {
  id: string;
  name: string;
}

export interface RecipeIngredient {
  ingredient: Ingredient;
  quantity?: string;
  unit?: string;
  note?: string;
}

export interface RecipeStep {
  id: string;
  instruction: string;
  order: number;
}

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  category?: string;
  servings?: number;
  prepMinutes?: number;
  cookMinutes?: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  ingredients?: RecipeIngredient[];
  steps?: RecipeStep[];
}
