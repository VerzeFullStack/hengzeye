import { faker } from "@faker-js/faker";
import { Product } from "../dataModels/Product";
import { ListingProduct } from "../dataModels/ListingProduct";

const newProduct = (): Product => {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    category: faker.commerce.department(),
  };
};

const newListingProduct = (): ListingProduct => {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    category: faker.commerce.department(),
    price: faker.number.int(1000),
    seller: faker.person.fullName(),
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

export async function getUserInventory(
  userId: string | undefined
): Promise<Array<Product>> {
  return new Promise<Product[]>((resolve) => {
    // Simulating an asynchronous operation
    // (e.g., fetching data)
    const arr: Product[] = [];
    for (let i = 0; i < 123; i++) {
      arr.push(newProduct());
    }

    setTimeout(() => {
      resolve(arr);
    }, 500);
  });
}

export async function addProductToUserInventory(
  productId: string | undefined
): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    // Simulating an asynchronous operation
    // (e.g., fetching data)
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
}
