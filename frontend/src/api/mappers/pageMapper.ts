import type { Page } from "../../types/models";
import type { PageResponse } from "../../types/responses";

/**
 * Type mapper for conversion between page data types.
 */
export const pageMapper = {
  /**
   * Converts a PageResponse to a Page.
   * @param pageResponse The PageResponse to be converted.
   * @returns The converted Page object.
   */
  responseToModel: <T>(pageResponse: PageResponse<T>): Page<T> => {
    const { page, ...otherProperties } = pageResponse;

    return {
      ...otherProperties,
      ...page, // Flatten page property to remove nesting
    };
  },
};
