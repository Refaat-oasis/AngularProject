export interface AdminCategory {
  id: number;
  name: string;
  imageUrl: string;
}

export interface CategoryProductPreview {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

export interface AdminCategoryWithProducts extends AdminCategory {
  products: CategoryProductPreview[];
}
