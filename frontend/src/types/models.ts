/**
 * Generic interface for the internal application model for a page.
 * Fields are not nested for a flat data structure.
 * @template T represents the type of the items in the embedded content array.
 */
export interface Page<T> {
  content: T[];
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

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
