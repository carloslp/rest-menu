import * as jspb from 'google-protobuf'



export class RestaurantInfo extends jspb.Message {
  getName(): string;
  setName(value: string): RestaurantInfo;

  getAddress(): string;
  setAddress(value: string): RestaurantInfo;

  getPhone(): string;
  setPhone(value: string): RestaurantInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RestaurantInfo.AsObject;
  static toObject(includeInstance: boolean, msg: RestaurantInfo): RestaurantInfo.AsObject;
  static serializeBinaryToWriter(message: RestaurantInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RestaurantInfo;
  static deserializeBinaryFromReader(message: RestaurantInfo, reader: jspb.BinaryReader): RestaurantInfo;
}

export namespace RestaurantInfo {
  export type AsObject = {
    name: string,
    address: string,
    phone: string,
  }
}

export class Category extends jspb.Message {
  getId(): number;
  setId(value: number): Category;

  getName(): string;
  setName(value: string): Category;

  getOrder(): number;
  setOrder(value: number): Category;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Category.AsObject;
  static toObject(includeInstance: boolean, msg: Category): Category.AsObject;
  static serializeBinaryToWriter(message: Category, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Category;
  static deserializeBinaryFromReader(message: Category, reader: jspb.BinaryReader): Category;
}

export namespace Category {
  export type AsObject = {
    id: number,
    name: string,
    order: number,
  }
}

export class Dish extends jspb.Message {
  getId(): number;
  setId(value: number): Dish;

  getName(): string;
  setName(value: string): Dish;

  getDescription(): string;
  setDescription(value: string): Dish;

  getPrice(): number;
  setPrice(value: number): Dish;

  getIsAvailable(): boolean;
  setIsAvailable(value: boolean): Dish;

  getCategoryId(): number;
  setCategoryId(value: number): Dish;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Dish.AsObject;
  static toObject(includeInstance: boolean, msg: Dish): Dish.AsObject;
  static serializeBinaryToWriter(message: Dish, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Dish;
  static deserializeBinaryFromReader(message: Dish, reader: jspb.BinaryReader): Dish;
}

export namespace Dish {
  export type AsObject = {
    id: number,
    name: string,
    description: string,
    price: number,
    isAvailable: boolean,
    categoryId: number,
  }
}

export class Empty extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Empty.AsObject;
  static toObject(includeInstance: boolean, msg: Empty): Empty.AsObject;
  static serializeBinaryToWriter(message: Empty, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Empty;
  static deserializeBinaryFromReader(message: Empty, reader: jspb.BinaryReader): Empty;
}

export namespace Empty {
  export type AsObject = {
  }
}

export class FullMenuResponse extends jspb.Message {
  getRestaurantInfo(): RestaurantInfo | undefined;
  setRestaurantInfo(value?: RestaurantInfo): FullMenuResponse;
  hasRestaurantInfo(): boolean;
  clearRestaurantInfo(): FullMenuResponse;

  getCategoriesList(): Array<CategoryWithDishes>;
  setCategoriesList(value: Array<CategoryWithDishes>): FullMenuResponse;
  clearCategoriesList(): FullMenuResponse;
  addCategories(value?: CategoryWithDishes, index?: number): CategoryWithDishes;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FullMenuResponse.AsObject;
  static toObject(includeInstance: boolean, msg: FullMenuResponse): FullMenuResponse.AsObject;
  static serializeBinaryToWriter(message: FullMenuResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FullMenuResponse;
  static deserializeBinaryFromReader(message: FullMenuResponse, reader: jspb.BinaryReader): FullMenuResponse;
}

export namespace FullMenuResponse {
  export type AsObject = {
    restaurantInfo?: RestaurantInfo.AsObject,
    categoriesList: Array<CategoryWithDishes.AsObject>,
  }
}

export class CategoryWithDishes extends jspb.Message {
  getCategoryInfo(): Category | undefined;
  setCategoryInfo(value?: Category): CategoryWithDishes;
  hasCategoryInfo(): boolean;
  clearCategoryInfo(): CategoryWithDishes;

  getDishesList(): Array<Dish>;
  setDishesList(value: Array<Dish>): CategoryWithDishes;
  clearDishesList(): CategoryWithDishes;
  addDishes(value?: Dish, index?: number): Dish;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CategoryWithDishes.AsObject;
  static toObject(includeInstance: boolean, msg: CategoryWithDishes): CategoryWithDishes.AsObject;
  static serializeBinaryToWriter(message: CategoryWithDishes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CategoryWithDishes;
  static deserializeBinaryFromReader(message: CategoryWithDishes, reader: jspb.BinaryReader): CategoryWithDishes;
}

export namespace CategoryWithDishes {
  export type AsObject = {
    categoryInfo?: Category.AsObject,
    dishesList: Array<Dish.AsObject>,
  }
}

export class ListCategoriesResponse extends jspb.Message {
  getCategoriesList(): Array<Category>;
  setCategoriesList(value: Array<Category>): ListCategoriesResponse;
  clearCategoriesList(): ListCategoriesResponse;
  addCategories(value?: Category, index?: number): Category;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListCategoriesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListCategoriesResponse): ListCategoriesResponse.AsObject;
  static serializeBinaryToWriter(message: ListCategoriesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListCategoriesResponse;
  static deserializeBinaryFromReader(message: ListCategoriesResponse, reader: jspb.BinaryReader): ListCategoriesResponse;
}

export namespace ListCategoriesResponse {
  export type AsObject = {
    categoriesList: Array<Category.AsObject>,
  }
}

export class ListDishesResponse extends jspb.Message {
  getDishesList(): Array<Dish>;
  setDishesList(value: Array<Dish>): ListDishesResponse;
  clearDishesList(): ListDishesResponse;
  addDishes(value?: Dish, index?: number): Dish;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListDishesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListDishesResponse): ListDishesResponse.AsObject;
  static serializeBinaryToWriter(message: ListDishesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListDishesResponse;
  static deserializeBinaryFromReader(message: ListDishesResponse, reader: jspb.BinaryReader): ListDishesResponse;
}

export namespace ListDishesResponse {
  export type AsObject = {
    dishesList: Array<Dish.AsObject>,
  }
}

export class CategoryID extends jspb.Message {
  getId(): number;
  setId(value: number): CategoryID;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CategoryID.AsObject;
  static toObject(includeInstance: boolean, msg: CategoryID): CategoryID.AsObject;
  static serializeBinaryToWriter(message: CategoryID, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CategoryID;
  static deserializeBinaryFromReader(message: CategoryID, reader: jspb.BinaryReader): CategoryID;
}

export namespace CategoryID {
  export type AsObject = {
    id: number,
  }
}

export class DishID extends jspb.Message {
  getId(): number;
  setId(value: number): DishID;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DishID.AsObject;
  static toObject(includeInstance: boolean, msg: DishID): DishID.AsObject;
  static serializeBinaryToWriter(message: DishID, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DishID;
  static deserializeBinaryFromReader(message: DishID, reader: jspb.BinaryReader): DishID;
}

export namespace DishID {
  export type AsObject = {
    id: number,
  }
}

