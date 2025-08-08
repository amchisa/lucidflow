import { useEffect } from "react";

interface UseInfiniteScrollParams {
  triggerRef: React.RefObject<HTMLElement>;
  onLoadMore: () => void;
  hasMore: boolean;
  observerOptions?: IntersectionObserverInit;
}

/**
 * Custom hook for performing lazy loading in the form of an infinite scroll.
 * @param triggerRef The trigger element for initiating a load.
 * @param onLoadMore The method to invoke upon a load.
 * @param hasMore A boolean indicating whether or not more content can be loaded.
 * @param observerOptions Options regarding when a load is to be triggered.
 */
export default function useInfiniteScroll({
  triggerRef,
  onLoadMore,
  hasMore,
  observerOptions,
}: UseInfiniteScrollParams) {
  useEffect(() => {
    if (!hasMore) {
      // Do nothing if there are no more posts to load
      return;
    }

    const target = triggerRef.current;

    if (!target) {
      // Prevent errors due to null target value
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        onLoadMore();
      }
    }, observerOptions);

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [triggerRef, onLoadMore, hasMore, observerOptions]);
}
