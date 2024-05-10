export default class Card {
    /**
     * Gets or sets the URL of this card's image.
     * @type {string}
     */
    url;

    /**
     * Gets or sets if this card is matched, and therefore, not clickable.
     * @type {boolean}
     */
    matched = false;

    /**
     * Gets or sets the DOM element associated with this card.
     * @type {HTMLElement}
     */
    cardElem;

    /**
     * @param {HTMLElement} elem The associated DOM element.
     * @param {string} url The URL of the card's image.
     */
    constructor(elem, url) {
        this.cardElem = elem;

        if (!this.cardElem) {
            throw new Error('Cannot find DOM element associated with card');
        }

        const imgElem = document.createElement('div');
        imgElem.style.backgroundImage = `url(${url})`;
        this.cardElem.appendChild(imgElem);

        this.url = url;
    }

    /**
     * Toggles the associated GUI element to reflect the object's state.
     */
    flip() {
        this.cardElem.classList.toggle('face-down');
    }
}