import { ProductData, TreeNodeData, TreeStructure } from "./types";

export function buildTreeStructure(
  filteredProducts: ProductData[],
  allProducts: ProductData[] | undefined,
  selectedProductIds: string[],
  hasSearch: boolean
): TreeStructure {
  const itemsMap: Record<string, TreeNodeData> = {};
  const categoryMap = new Map<string, Set<string>>();
  const subCategoryMap = new Map<string, Set<string>>();
  const itemGroupMap = new Map<string, Set<string>>();

  const addProductToTree = (product: ProductData) => {
    const category = product.product_category;
    const subCategory = product.product_sub_category;
    const itemGroup = product.product_item_group;

    if (!category || !subCategory || !itemGroup) return;

    const categoryId = `category-${category.id}`;
    const subCategoryId = `subcategory-${subCategory.id}`;
    const itemGroupId = `itemgroup-${itemGroup.id}`;
    const productId = `product-${product.id}`;

    // Add category
    if (!itemsMap[categoryId]) {
      itemsMap[categoryId] = {
        id: categoryId,
        name: category.name,
        code: categoryId.replace("category-", ""),
        type: "category",
        children: [],
      };
    }

    // Add subcategory
    if (!itemsMap[subCategoryId]) {
      itemsMap[subCategoryId] = {
        id: subCategoryId,
        name: subCategory.name,
        code: subCategoryId.replace("subcategory-", ""),
        type: "subcategory",
        children: [],
      };
    }

    // Add item group
    if (!itemsMap[itemGroupId]) {
      itemsMap[itemGroupId] = {
        id: itemGroupId,
        name: itemGroup.name,
        code: itemGroupId.replace("itemgroup-", ""),
        type: "itemgroup",
        children: [],
      };
    }

    // Add product
    itemsMap[productId] = {
      id: productId,
      name: product.name,
      code: product.code,
      description: product.description,
      local_name: product.local_name,
      type: "product",
      children: [],
      product_category: category,
      product_sub_category: subCategory,
      product_item_group: itemGroup,
      inventory_unit_id: product.inventory_unit_id,
      inventory_unit_name: product.inventory_unit_name,
    };

    // Build relationships
    if (!categoryMap.has(categoryId)) {
      categoryMap.set(categoryId, new Set());
    }
    categoryMap.get(categoryId)!.add(subCategoryId);

    if (!subCategoryMap.has(subCategoryId)) {
      subCategoryMap.set(subCategoryId, new Set());
    }
    subCategoryMap.get(subCategoryId)!.add(itemGroupId);

    if (!itemGroupMap.has(itemGroupId)) {
      itemGroupMap.set(itemGroupId, new Set());
    }
    itemGroupMap.get(itemGroupId)!.add(productId);
  };

  // Add filtered products to tree
  for (const product of filteredProducts) {
    addProductToTree(product);
  }

  // Add selected products that are not in filtered results (when searching)
  if (hasSearch && allProducts && selectedProductIds.length > 0) {
    for (const productId of selectedProductIds) {
      if (itemsMap[productId]) continue;
      const productIdNumber = productId.replace("product-", "");
      const product = allProducts.find((p: ProductData) => p.id === productIdNumber);

      if (product) {
        addProductToTree(product);
      }
    }
  }

  // Build parent-child relationships
  for (const [categoryId, subCategoryIds] of categoryMap) {
    itemsMap[categoryId].children = Array.from(subCategoryIds);
  }

  for (const [subCategoryId, itemGroupIds] of subCategoryMap) {
    itemsMap[subCategoryId].children = Array.from(itemGroupIds);
  }

  for (const [itemGroupId, productIds] of itemGroupMap) {
    itemsMap[itemGroupId].children = Array.from(productIds);
  }

  const roots = Array.from(categoryMap.keys());

  return { items: itemsMap, rootItems: roots };
}

export function getAllItemIds(
  itemId: string,
  items: Record<string, TreeNodeData>,
  selectedItemsCache: Record<string, TreeNodeData>
): string[] {
  const item = items[itemId] || selectedItemsCache[itemId];
  if (!item) return [];

  const ids = [itemId];
  if (item.children) {
    for (const childId of item.children) {
      ids.push(...getAllItemIds(childId, items, selectedItemsCache));
    }
  }
  return ids;
}

export function getAllProductIds(
  itemId: string,
  items: Record<string, TreeNodeData>,
  selectedItemsCache: Record<string, TreeNodeData>
): string[] {
  const item = items[itemId] || selectedItemsCache[itemId];
  if (!item) return [];

  if (item.type === "product") {
    return [itemId];
  }

  const productIds: string[] = [];
  for (const childId of item.children || []) {
    productIds.push(...getAllProductIds(childId, items, selectedItemsCache));
  }
  return productIds;
}
