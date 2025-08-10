/**
 * Converts HTML text to plain text by stripping tags and clearing whitespaces.
 * @param htmlText The text filled with html tags and &nbsp; to convert.
 * @returns The plain text.
 */
export function htmlToPlainText(htmlText: string) {
  // Create a temporary div to use its textContent property for formatting
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlText;

  return tempDiv.textContent!.trim(); // Trim leading/trailing whitespace
}
