import { Food } from "./foods.models";

export interface Restaurant {
  id: string;
  name: string;
  imageUrl: string;
  foods: Food[];
}
