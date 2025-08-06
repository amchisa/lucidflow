import { useEffect } from "react";

interface UseInfiniteScrollParams {
  triggerRef: React.RefObject<HTMLElement>;
  onLoadMore: () => void;
  observerOptions?: IntersectionObserverInit;
}

/**
 * Custom hook for performing lazy loading in the form of an infinite scroll.
 * @param triggerRef The trigger element for initiating a load.
 * @param onLoadMore The method to invoke upon a load.
 * @param observerOptions Options regarding when a load is to be triggered.
 * @param dependencies The dependencies for the hook.
 */
export default function useInfiniteScroll(
  {
    triggerRef,
    onLoadMore: loadMore,
    observerOptions,
  }: UseInfiniteScrollParams,
  dependencies: React.DependencyList
) {
  useEffect(() => {
    const target = triggerRef.current;

    if (!target) {
      // Prevent errors due to null target value
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    }, observerOptions);

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [triggerRef, loadMore, observerOptions, dependencies]);
}
