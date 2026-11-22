export interface Food {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

export interface Rating {
  id: string;
  foodId: string;
}

export interface Cart {
  id: string;
  restaurantId: string;
  userId: string;
  foodId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  category: string;
}

export interface NewCart {
  cart: Cart;
  id: string;
  quantity: number;
}
