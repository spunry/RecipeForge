import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateRecipeDto } from "./dto/create-recipe.dto";
import { UpdateRecipeDto } from "./dto/update-recipe.dto";

@Injectable()
export class RecipesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllCategories() {
    const categories = await this.prisma.recipe.findMany({
      select: { category: true },
      where: {
        AND: [
          { category: { not: null } },
          { category: { not: "" } },
        ],
      },
      distinct: ["category"],
    });
    return categories.map((c) => c.category as string).sort();
  }

  async create(dto: CreateRecipeDto) {
    const { ingredients, steps, ...recipeData } = dto;

    return this.prisma.recipe.create({
      data: {
        ...recipeData,
        ingredients: ingredients
          ? {
              create: ingredients.map((ing) => ({
                quantity: ing.quantity,
                unit: ing.unit,
                note: ing.note,
                ingredient: {
                  connectOrCreate: {
                    where: { name: ing.name },
                    create: { name: ing.name },
                  },
                },
              })),
            }
          : undefined,
        steps: steps
          ? {
              create: steps.map((step) => ({
                instruction: step.instruction,
                order: step.order,
              })),
            }
          : undefined,
      },
      include: {
        ingredients: {
          include: { ingredient: true },
        },
        steps: true,
      },
    });
  }

  findAll(search?: string) {
    return this.prisma.recipe.findMany({
      where: search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              { category: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
      include: {
        ingredients: {
          include: { ingredient: true },
        },
        steps: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  async findOne(id: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: {
        ingredients: {
          include: { ingredient: true },
        },
        steps: {
          orderBy: { order: "asc" },
        },
      },
    });
    if (!recipe) throw new NotFoundException("Recipe not found");
    return recipe;
  }

  async update(id: string, dto: UpdateRecipeDto) {
    await this.findOne(id);
    const { ingredients, steps, ...recipeData } = dto;

    // Use a transaction to ensure atomic updates
    return this.prisma.$transaction(async (tx) => {
      // 1. Delete existing relations if new ones are provided
      if (ingredients) {
        await tx.recipeIngredient.deleteMany({ where: { recipeId: id } });
      }
      if (steps) {
        await tx.recipeStep.deleteMany({ where: { recipeId: id } });
      }

      // 2. Update the main recipe data and recreate relations
      return tx.recipe.update({
        where: { id },
        data: {
          ...recipeData,
          ingredients: ingredients
            ? {
                create: ingredients.map((ing) => ({
                  quantity: ing.quantity,
                  unit: ing.unit,
                  note: ing.note,
                  ingredient: {
                    connectOrCreate: {
                      where: { name: ing.name },
                      create: { name: ing.name },
                    },
                  },
                })),
              }
            : undefined,
          steps: steps
            ? {
                create: steps.map((step) => ({
                  instruction: step.instruction,
                  order: step.order,
                })),
              }
            : undefined,
        },
        include: {
          ingredients: {
            include: { ingredient: true },
          },
          steps: {
            orderBy: { order: "asc" },
          },
        },
      });
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.recipe.delete({ where: { id } });
  }
}
