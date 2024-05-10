/**
 * Validates an HTML element by its ID.
 * @param {string} [id] The element ID.
 */
export function validateHtmlElementId(id) {
    if (typeof id === 'string') {
        return document.getElementById(id) || null;
    }

    return null;
}