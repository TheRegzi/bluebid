/**
 * Truncates a given text to a specified maximum length.
 * If the text exceeds the maximum length, it is shortened to the specified length
 * and an ellipsis (`...`) is appended to the end.
 * If the text is within the limit, it is returned unchanged.
 *
 * @param {string} text - The input text to be truncated.
 * @param {number} maxLength - The maximum length of the text including the ellipsis.
 * @returns {string} The truncated text if it exceeds the maximum length, otherwise the original text.
 */

export function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
}
