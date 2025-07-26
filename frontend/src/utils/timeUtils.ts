/**
 * Delays execution for a specified number of milliseconds.
 * Useful for ensuring a minimum loading state duration to prevent flickering UI.
 * @param ms The number of milliseconds to delay.
 * @returns A Promise that resolves after the specified delay.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
