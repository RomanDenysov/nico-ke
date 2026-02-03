import "server-only";

import { asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import db from "@/db";
import { menuCategories } from "@/db/schema";

export async function getMenuCategories(typeId: number) {
  "use cache";
  cacheLife("max");
  cacheTag(`menu-type-id-${typeId}`);

  return await db.query.menuCategories.findMany({
    where: eq(menuCategories.typeId, typeId),
    orderBy: [asc(menuCategories.order)],
  });
}

export async function getMenuCategory(slug: string) {
  "use cache";
  cacheLife("max");
  cacheTag("menu-categories");

  return await db.query.menuCategories.findFirst({
    where: eq(menuCategories.slug, slug),
  });
}

export async function getMenuCategoryById(id: number) {
  "use cache";
  cacheLife("max");
  cacheTag("menu-categories");

  return await db.query.menuCategories.findFirst({
    where: eq(menuCategories.id, id),
  });
}

export async function reorderMenuCategories(
  categoryIds: number[]
): Promise<void> {
  await Promise.all(
    categoryIds.map((id, index) =>
      db
        .update(menuCategories)
        .set({ order: index })
        .where(eq(menuCategories.id, id))
    )
  );
}
