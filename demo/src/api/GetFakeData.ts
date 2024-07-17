import { faker } from "@faker-js/faker";
import { Product } from "../dataModels/Product";
import { ListingProduct } from "../dataModels/ListingProduct";

const newProduct = (): Product => {
  return {
    name: faker.commerce.productName(),
    category: faker.commerce.department(),
    price: faker.number.int(1000),
    seller: faker.person.fullName(),
    description: faker.commerce.productDescription(),
  };
};

const newListingProduct = (): ListingProduct => {
  return {
    name: faker.commerce.productName(),
    category: faker.commerce.department(),
    price: faker.number.int(1000),
    quantity: faker.number.int(100),
    description: faker.commerce.productDescription(),
  };
};

function getItems<T>(length: number, factory: () => T): T[] {
  const arr: T[] = [];
  for (let i = 0; i < length; i++) {
    arr.push(factory());
  }
  return arr;
}

// Usage
export function getProducts(length: number): Product[] {
  return getItems(length, newProduct);
}

export function getListingProducts(length: number): ListingProduct[] {
  return getItems(length, newListingProduct);
}
