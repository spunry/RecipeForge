export interface Recipe {
  id: string;
  title: string;
  description?: string;
  servings?: number;
  prepMinutes?: number;
  cookMinutes?: number;
  createdAt: string;
  updatedAt: string;
}
