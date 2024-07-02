import { Comment } from "./comments";

export interface Post {
  id: number;
  recipe_id: number;
  userAvatar: string;
  username: string;
  description: string;
  time: string;
  image: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
  caption: string;
  recipeName?: string;  
  recipeId?: number;   
  communityRecipeId: number; 
  newRecipeId: number;
}