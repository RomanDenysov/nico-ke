"use server";

import { eq } from "drizzle-orm";
import { refresh, updateTag } from "next/cache";
import { z } from "zod";
import db from "@/db";
import { menuCategories, type NewMenuCategory } from "@/db/schema";
import {
  getMenuCategories,
  getMenuCategoryById,
  reorderMenuCategories,
} from "./queries";

const menuCategorySchema = z.object({
  name: z.string().min(1, "Názov je povinný"),
  slug: z.string().min(1, "Slug je povinný"),
  description: z.string().optional(),
  typeId: z.coerce.number().int().positive(),
});

export async function createMenuCategory(data: NewMenuCategory) {
  const [result] = await db.insert(menuCategories).values(data).returning();
  return result;
}

export async function updateMenuCategory(
  id: number,
  data: Partial<NewMenuCategory>
) {
  const [result] = await db
    .update(menuCategories)
    .set(data)
    .where(eq(menuCategories.id, id))
    .returning();
  return result;
}

export async function deleteMenuCategory(id: number) {
  await db.delete(menuCategories).where(eq(menuCategories.id, id));
}

export async function createMenuCategoryAction(formData: FormData) {
  const typeId = z.coerce
    .number()
    .int()
    .positive()
    .parse(formData.get("typeId"));
  const categories = await getMenuCategories(typeId);
  const maxOrder =
    categories.length > 0 ? Math.max(...categories.map((c) => c.order)) : -1;

  const data = menuCategorySchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    typeId,
  });

  await createMenuCategory({ ...data, order: maxOrder + 1 });
  updateTag(`menu-type-id-${typeId}`);
  updateTag("menu-categories");
  refresh();
}

export async function updateMenuCategoryAction(formData: FormData) {
  const id = z.coerce.number().int().positive().parse(formData.get("id"));
  const data = menuCategorySchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    typeId: formData.get("typeId"),
  });

  const typeId = z.coerce.number().int().positive().parse(data.typeId);
  await updateMenuCategory(id, data);
  updateTag(`menu-type-id-${typeId}`);
  updateTag("menu-categories");
  refresh();
}

export async function deleteMenuCategoryAction(formData: FormData) {
  const id = z.coerce.number().int().positive().parse(formData.get("id"));
  // Get category to find typeId before deletion
  const category = await getMenuCategoryById(id);
  const typeId = category?.typeId;
  await deleteMenuCategory(id);
  if (typeId) {
    updateTag(`menu-type-id-${typeId}`);
  }
  updateTag("menu-categories");
  refresh();
}

export async function reorderMenuCategoriesAction(categoryIds: number[]) {
  // Get typeId from first category before reordering
  const firstCategory = await getMenuCategoryById(categoryIds[0]);
  const typeId = firstCategory?.typeId;
  await reorderMenuCategories(categoryIds);
  if (typeId) {
    updateTag(`menu-type-id-${typeId}`);
  }
  updateTag("menu-categories");
  refresh();
}
