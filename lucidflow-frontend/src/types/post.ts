export interface PostResponse {
  id: number;
  title: string;
  body: string;
  timeCreated: string;
  timeModified: string;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  timeCreated: Date;
  timeModified: Date;
}
