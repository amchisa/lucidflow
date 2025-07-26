/**
 * Represents the internal application model for a Post.
 * This is the hydrated version of PostResponse, with string dates converted to Date objects.
 */
export interface Post {
  id: number;
  title: string;
  body: string;
  images: Image[];
  timeCreated: Date;
  timeModified: Date;
}

/**
 * Represents the internal application model for an Image.
 */
export interface Image {
  id: number;
  url: string;
  displayIndex: number;
}
