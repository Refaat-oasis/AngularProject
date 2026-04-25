export interface AdminProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  image: string;
  imageUrl?: string;
  isDeleted?: boolean;
}

export interface ReactivateProductResponse {
  message?: string;
  product?: {
    id: number;
    isDeleted: boolean;
  };
}
