import { validateHtmlElementId } from "./utils/validation.js";

/**
 * @typedef {Object} ApplicationOptions
 * @property {string} [target] The application's display target ID.
 * @property {string} [statusBar] The status bar's target element ID.
 * @property {string} [htmlTemplate] The application's HTML template file.
 */

export default class Application {
    /**
     * @type {HTMLElement|undefined}
     */
    target;

    /**
     * @type {HTMLElement|undefined}
     */
    statusBar;

    /**
     * @type {string|undefined}
     */
    htmlTemplateString;

    /**
     * @param {ApplicationOptions} options 
     */
    constructor(options = {}) {
        if (this.constructor === Application) {
            throw new Error('Cannot instantiate abstract class Application');
        }

        const start = Date.now();
        let curr = start;
        this.#validateAsync(options).then(function () {
            curr = Date.now();
            const validTime = curr - start;

            this.initialize();
            const initTime = Date.now() - curr;
            curr += initTime;

            this.run();
            const runTime = Date.now() - curr;

            this.statusBar.textContent =
                `${this.constructor.name} is running (in ${validTime + initTime + runTime} ms)`;
        }.bind(this));
    }

    /**
     * Validates the constructor arguments.
     * @param {ApplicationOptions} options 
     */
    async #validateAsync(options) {
        this.target = validateHtmlElementId(options.target);
        if (this.target === null) throw new Error('Parameter target must be a valid ID');

        this.statusBar = validateHtmlElementId(options.statusBar);
        if (this.statusBar === null) throw new Error('Parameter statusBar must be a valid ID');

        if (options.htmlTemplate) {
            const response = await fetch(options.htmlTemplate);

            if (response.status !== 200) {
                throw new Error('Could not load HTML template');
            }

            const data = await response.text();
            this.htmlTemplateString = data;
        }
    }

    /**
     * Initializes the application's (typically GUI) state.
     */
    initialize() {
        console.log('Initializing application');
        if (this.htmlTemplateString) {
            const domParser = new DOMParser();
            const parsedDoc = domParser.parseFromString(this.htmlTemplateString, 'text/html');
            for (let child of parsedDoc.body.children) {
                document.adoptNode(child);
                this.target.appendChild(child);
            }
        }
    }

    /**
     * Runs the application('s loop).
     */
    run() {
        console.log('Running application');
    }

    /**
     * Cleans up application resources.
     */
    destroy() {
        while (this.target.lastChild) {
            this.target.lastChild.remove();
        }
    }
}