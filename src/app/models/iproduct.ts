export interface IProduct {

   id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  categoryName?: string;
  image: string;
}
