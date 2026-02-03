# Fix: Admin Category CRUD Operations

## Problem

Admin cannot rename, delete, or create categories - UI doesn't update after actions.

## Root Causes

### 1. Stale Local State in `CategoriesSortableList`

**File:** `features/categories-sidebar/components/categories-sortable-list.tsx`

The component uses `useState` to track categories locally for drag-and-drop, but doesn't sync when server data changes:

```tsx
const [localCategories, setLocalCategories] = useState(categories);
// Missing: useEffect to sync when categories prop changes
```

### 2. Broken `AlertDialogAction` Component

**File:** `components/ui/alert-dialog.tsx`

The component has `asChild` hardcoded internally but doesn't handle when consumers also pass `asChild`:

```tsx
// Broken: always renders Button, ignores consumer's asChild
<AlertDialogPrimitive.Action asChild {...props}>
  <Button {...props} />
</AlertDialogPrimitive.Action>
```

### 3. Missing Cache Configuration

**File:** `features/categories-sidebar/queries.ts`

Queries don't use `cacheLife("max")` and `cacheTag()` for proper cache invalidation.

---

## Fixes

### Fix 1: Add useEffect to sync state

**File:** `features/categories-sidebar/components/categories-sortable-list.tsx`

Add import:

```tsx
import { useCallback, useEffect, useState } from "react";
```

Add after useState:

```tsx
const [localCategories, setLocalCategories] = useState(categories);

// Sync local state when server data changes (after create/update/delete)
useEffect(() => {
  setLocalCategories(categories);
}, [categories]);
```

### Fix 2: Fix AlertDialogAction component

**File:** `components/ui/alert-dialog.tsx`

Replace the AlertDialogAction function:

```tsx
function AlertDialogAction({
  className,
  asChild,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
  if (asChild) {
    return (
      <AlertDialogPrimitive.Action asChild className={cn(className)} {...props} />
    );
  }
  return (
    <AlertDialogPrimitive.Action asChild className={cn(className)} {...props}>
      <Button className="rounded-none" />
    </AlertDialogPrimitive.Action>
  );
}
```

### Fix 3: Add caching to queries

**File:** `features/categories-sidebar/queries.ts`

Add import:

```tsx
import { cacheLife, cacheTag } from "next/cache";
```

Update each query function:

```tsx
export async function getMenuCategories(typeId: number) {
  "use cache";
  cacheLife("max");
  cacheTag(`menu-type-id-${typeId}`);
  // ... rest of function with await
}

export async function getMenuCategory(slug: string) {
  "use cache";
  cacheLife("max");
  cacheTag("menu-categories");
  // ... rest of function with await
}

export async function getMenuCategoryById(id: number) {
  "use cache";
  cacheLife("max");
  cacheTag("menu-categories");
  // ... rest of function with await
}
```

### Fix 4: Add cache invalidation to actions

**File:** `features/categories-sidebar/actions.ts`

Add `updateTag("menu-categories")` to each action after the mutation:

- `createMenuCategoryAction`
- `updateMenuCategoryAction`
- `deleteMenuCategoryAction`
- `reorderMenuCategoriesAction`

Example:

```tsx
await createMenuCategory({ ...data, order: maxOrder + 1 });
updateTag(`menu-type-id-${typeId}`);
updateTag("menu-categories");  // ADD THIS LINE
refresh();
```

---

## Verification

Run `pnpm run build` - should complete without errors.
