import Application from "./Application.js";

export default class Hangman extends Application {
    /**
     * @type {CanvasRenderingContext2D}
     */
    #ctx;

    /**
     * The word to guess
     * @type {string}
     */
    #word;

    /**
     * Hard-coded words to choose from
     */
    static #words = [
        'example',
        'testing',
        'cabbage',
        'concatenation',
        'easy'
    ];

    #hangmanGenerator;

    onKeyPress = /** @this {Hangman} */ function (evt) {
        /** @type {string} */
        const key = evt.key;
        const charCode = key.charCodeAt();

        if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123)) {
            const lowerKey = key.toLowerCase();
            if (this.#word.includes(lowerKey)) {
                //TODO: Switch prompts with letters
                console.log('Correct guess');
            } else {
                console.log(this.#hangmanGenerator.next());
            }
        }
    }.bind(this);

    initialize() {
        super.initialize();

        const canvasElem = document.createElement('canvas');
        this.target.appendChild(canvasElem);
        this.#ctx = canvasElem.getContext('2d');

        canvasElem.width = canvasElem.clientWidth;
        canvasElem.height = canvasElem.clientHeight;

        this.#word = Hangman.#words[Math.round(Math.random() * Hangman.#words.length)];
        this.#hangmanGenerator = this.#createHangmanGenerator();
    }

    run() {
        const width = this.target.querySelector('canvas').width;
        const height = this.target.querySelector('canvas').height;
        this.#ctx.lineWidth = 3;

        let cursor = width * 0.1;
        for (let char of this.#word) {
            this.#ctx.moveTo(cursor, height * 0.95);
            this.#ctx.lineTo(cursor + width * 0.05, height * 0.95);
            this.#ctx.stroke();
            cursor += width * 0.1;
        }

        window.addEventListener('keypress', this.onKeyPress);
    }

    destroy() {
        super.destroy();
        window.removeEventListener('keypress', this.onKeyPress);
    }

    *#createHangmanGenerator() {
        const width = this.target.querySelector('canvas').width;
        const height = this.target.querySelector('canvas').height;

        yield function () {
            this.#ctx.moveTo(width * 0.1, height * 0.85);
            this.#ctx.lineTo(width * 0.5, height * 0.85);
            this.#ctx.stroke();
        }.bind(this)();

        yield function () { 
            this.#ctx.moveTo(width * 0.3, height * 0.85);
            this.#ctx.lineTo(width * 0.3, height * 0.15);
            this.#ctx.stroke();
        }.bind(this)();

        yield function () { 
            this.#ctx.lineTo(width * 0.8, height * 0.15);
            this.#ctx.stroke();
        }.bind(this)();

        /*if (this.#mistakes === 1) {
            this.#ctx.moveTo(width * 0.1, height * 0.85);
            this.#ctx.lineTo(width * 0.5, height * 0.85);
            this.#ctx.stroke();
        } else if (this.#mistakes === 2) {
            this.#ctx.moveTo(width * 0.3, height * 0.85);
            this.#ctx.lineTo(width * 0.3, height * 0.15);
            this.#ctx.stroke();
        }
        

        

        this.#ctx.lineTo(width * 0.8, height * 0.15);
        this.#ctx.stroke();

        this.#ctx.moveTo(width * 0.4, height * 0.15);
        this.#ctx.lineTo(width * 0.3, height * 0.25);
        this.#ctx.stroke();

        this.#ctx.moveTo(width * 0.8, height * 0.15);
        this.#ctx.lineTo(width * 0.8, height * 0.25);
        this.#ctx.stroke();

        this.#ctx.beginPath();
        this.#ctx.arc(width * 0.8, height * 0.25 + width * 0.05, width * 0.05, 0, Math.PI * 2);
        this.#ctx.stroke();

        this.#ctx.moveTo(width * 0.8, height * 0.25 + width * 0.1);
        this.#ctx.lineTo(width * 0.8, height * 0.55);
        this.#ctx.stroke();

        this.#ctx.moveTo(width * 0.8, height * 0.55);
        this.#ctx.lineTo(width * 0.75, height * 0.65);
        this.#ctx.stroke();

        this.#ctx.moveTo(width * 0.8, height * 0.55);
        this.#ctx.lineTo(width * 0.85, height * 0.65);
        this.#ctx.stroke();

        this.#ctx.moveTo(width * 0.8, height * 0.4);
        this.#ctx.lineTo(width * 0.75, height * 0.5);
        this.#ctx.stroke();

        this.#ctx.moveTo(width * 0.8, height * 0.4);
        this.#ctx.lineTo(width * 0.85, height * 0.5);
        this.#ctx.stroke();*/
    }
}