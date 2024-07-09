export interface Recipe {
    id:number;
    recipe_id: number;
    name: string;
    image: string;
    rating: number;
    description: string;
    picture: string;
    averageRating?: number;
    ratingCount?: number;
}