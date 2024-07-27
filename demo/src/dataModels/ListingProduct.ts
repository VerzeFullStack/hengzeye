import { Product } from "./Product";

export type ListingProduct = Product & {
  price: number;
  seller: string;
  description: string;
};
