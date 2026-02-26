import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateRecipeDto } from "./dto/create-recipe.dto";
import { UpdateRecipeDto } from "./dto/update-recipe.dto";
import { RecipesService } from "./recipes.service";

@Controller("recipes")
export class RecipesController {
  constructor(private readonly recipes: RecipesService) {}

  @Post()
  create(@Body() dto: CreateRecipeDto) {
    return this.recipes.create(dto);
  }

  @Get()
  findAll() {
    return this.recipes.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.recipes.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateRecipeDto) {
    return this.recipes.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.recipes.remove(id);
  }
}
