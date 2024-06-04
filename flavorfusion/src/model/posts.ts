import { Comment } from "./comments";

export interface Post {
    userAvatar: string;
    username: string;
    description: string;
    time: string;
    image: string;
    likes: number;
    liked: boolean;
    comments: Comment[];
    caption: string;
  }
  