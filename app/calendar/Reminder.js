/**
 * @typedef {Object} ReminderArgs Reminder constructor arguments
 * @property {string} title The short title of the reminder
 * @property {string} [text]
 * @property {number} timestamp
 * @property {number} id 
 */

export default class Reminder {
    /**
     * Gets or sets the short title of the reminder
     * @type {string}
     */
    title;

    /**
     * Gets or sets the full text of the reminder
     * @type {string}
     */
    text;

    /**
     * Gets or sets the Unix timestamp of the reminder
     * @type {number}
     */
    timestamp;

    /**
     * Gets or sets the ID of the reminder
     * @type {number}
     */
    id;

    /**
     * @type {HTMLElement}
     */
    dom;

    /**
     * @param {ReminderArgs} options 
     */
    constructor(options) {
        this.id = options.id;
        this.text = options.text;
        this.timestamp = options.timestamp;
        this.title = options.title;

        const remElem = document.createElement('div');
        remElem.textContent = options.title;
        this.dom = remElem;
    }
}