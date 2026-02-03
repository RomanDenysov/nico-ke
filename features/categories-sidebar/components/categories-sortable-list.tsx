"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { MenuCategory } from "@/db/schema";
import { reorderMenuCategoriesAction } from "../actions";
import { CategoriesSortableItem } from "./categories-sortable-item";
import { DeleteCategoryDialog } from "./delete-category-dialog";
import { EditCategoryDialog } from "./edit-category-dialog";

export function CategoriesSortableList({
  categories,
  typeId,
}: {
  categories: MenuCategory[];
  typeId: number;
}) {
  const pathname = usePathname();
  const [localCategories, setLocalCategories] = useState(categories);

  // Sync local state when server data changes (after create/update/delete)
  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) {
        return;
      }

      const oldIndex = localCategories.findIndex((cat) => cat.id === active.id);
      const newIndex = localCategories.findIndex((cat) => cat.id === over.id);

      const newCategories = arrayMove(localCategories, oldIndex, newIndex);
      setLocalCategories(newCategories);

      const categoryIds = newCategories.map((cat) => cat.id);
      await reorderMenuCategoriesAction(categoryIds);
    },
    [localCategories]
  );

  const isActive = (categorySlug: string) => {
    return pathname === `/admin/${typeId}/${categorySlug}`;
  };

  return (
    <nav className="flex-1 overflow-y-auto">
      <DndContext
        collisionDetection={closestCenter}
        id="categories-sortable-list"
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext
          items={localCategories.map((cat) => cat.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="flex flex-col">
            {localCategories.length === 0 ? (
              <li className="px-4 py-3 text-muted-foreground text-sm">
                Žiadne kategórie
              </li>
            ) : (
              localCategories.map((category) => (
                <CategoriesSortableItem
                  category={category}
                  isActive={isActive(category.slug)}
                  key={category.id}
                  typeId={typeId}
                >
                  <EditCategoryDialog category={category} typeId={typeId} />
                  <DeleteCategoryDialog categoryId={category.id} />
                </CategoriesSortableItem>
              ))
            )}
          </ul>
        </SortableContext>
      </DndContext>
    </nav>
  );
}
