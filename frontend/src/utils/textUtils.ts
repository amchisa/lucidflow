/**
 * Normalizes HTML text by stripping tags and clearing whitespaces.
 * @param htmlText The text filled with html tags and &nbsp; to normalize.
 * @returns The normalized/plain text.
 */
export function normalizeHTMLText(htmlText: string) {
  // Create a temporary div to use its textContent property for formatting
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlText;

  return tempDiv.textContent.trim(); // Trim leading/trailing whitespace
}
