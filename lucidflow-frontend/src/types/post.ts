import { type Image } from "./image";

export interface PostResponse {
  id: number;
  title: string;
  body: string;
  images: Image[];
  timeCreated: string;
  timeModified: string;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  images: Image[];
  timeCreated: Date;
  timeModified: Date;
}
