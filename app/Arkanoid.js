import Application from "./Application.js";
import Ball from "./arkanoid/Ball.js";
import Block from "./arkanoid/Block.js";
import Paddle from "./arkanoid/Paddle.js";

export default class Arkanoid extends Application {
    /**
     * @type {CanvasRenderingContext2D}
     */
    #ctx;

    /**
     * The available width (canvas coordinate system) in pixels.
     * @type {number}
     */
    #viewportWidth = 0;

    /**
     * The available height (canvas coordinate system) in pixels.
     * @type {number}
     */
    #viewportHeight = 0;

    /**
     * @type {Ball}
     */
    #ball;

    /**
     * @type {Paddle}
     */
    #paddle;

    /**
     * @type {Block[]}
     */
    #blocks = [];

    /**
     * @type {number|undefined}
     */
    #intervalKey;

    /**
     * @type {number|undefined}
     */
    #animationKey;

    /**
     * Gets or sets the game state. Backing field.
     * @type {number}
     */
    #state_ = GameState.RUNNING;

    /**
     * Unix timestamp of the restart timeout.
     * @type {number}
     */
    #timeoutStart = 0;

    /**
     * @type {string}
     */
    #prevKeys = '';

    /**
     * Gets or sets the game state.
     * @type {number}
     */
    get #state() {
        return this.#state_;
    }

    /**
     * Gets or sets the game state.
     * @type {number}
     */
    set #state(val) {
        if (val !== this.#state_) {
            if (typeof val !== 'number') {
                throw new Error('Value must be a number');
            }

            this.#state_ = val;
            if (val === GameState.LOST || val === GameState.WON) {
                this.#timeoutStart = Date.now();
                setTimeout(/** @this {Arkanoid} */ function () {
                    this.#blocks = [];
                    this.#buildWall();
                    this.#resetPlayer();
                    this.#state = GameState.RUNNING;
                }.bind(this), 5000);
            }
        }
    }

    onKeyPress = /** @this {Arkanoid} */ function (evt) {
        /** @type {string} */
        const key = evt.key;
        const charCode = key.charCodeAt();

        if (charCode === 97) {
            // A was pressed, move left
            if (this.#paddle.x - (this.#paddle.width / 2) >= 0) {
                this.#paddle.move(this.#paddle.x - 20);
            }
        } else if (charCode === 100) {
            // D was pressed, move right
            if (this.#paddle.x + (this.#paddle.width / 2) <= this.#viewportWidth) {
                this.#paddle.move(this.#paddle.x + 20);
            }
        }

        // Every good game has cheat codes
        this.#prevKeys += key.charAt().toUpperCase();
        if (!'IDDQD'.startsWith(this.#prevKeys)) {
            this.#prevKeys = '';
        } else if (this.#prevKeys === 'IDDQD') {
            this.#paddle.width = this.#viewportWidth;
            this.#prevKeys = '';
        }
    }.bind(this);

    initialize() {
        super.initialize();

        const canvasElem = document.createElement('canvas');
        this.target.appendChild(canvasElem);
        this.#ctx = canvasElem.getContext('2d');

        canvasElem.width = canvasElem.clientWidth;
        canvasElem.height = canvasElem.clientHeight;
        this.#viewportWidth = canvasElem.width;
        this.#viewportHeight = canvasElem.height;

        this.#buildWall();
        this.#resetPlayer();

        this.#intervalKey = setInterval(/** @this {Arkanoid} */ function () {
            this.updateModel();
        }.bind(this), 16);

        window.addEventListener('keypress', this.onKeyPress);
    }

    run() {
        super.run();

        this.#animationKey = requestAnimationFrame(this.render.bind(this));
    }

    updateModel() {
        if (this.#state === GameState.RUNNING) {
            // Game update logic
            this.#ball.move();

            // Hit-detection
            // Check if ball hits boundary walls (game area)
            if (this.#ball.x <= 0 || this.#ball.x >= this.#viewportWidth) {
                this.#ball.direction[0] *= -1;
            }
            if (this.#ball.y <= 0) {
                this.#ball.direction[1] *= -1;
            }

            // Check if the ball hit the paddle
            const paddleEdges = [this.#paddle.x - this.#paddle.width / 2,
            this.#paddle.x + this.#paddle.width / 2];

            if (this.#ball.y === this.#paddle.y &&
                this.#ball.x >= paddleEdges[0] && this.#ball.x <= paddleEdges[1]) {
                this.#ball.direction[1] *= -1;
            }

            // Check if the ball hit any blocks
            for (let block of this.#blocks) {
                if (!block.hit) {
                    const blockBbox = [block.x - block.width / 2, block.y - block.height / 2,
                    block.x + block.width / 2, block.y + block.height / 2];

                    if (this.#ball.x >= blockBbox[0] && this.#ball.y >= blockBbox[1] &&
                        this.#ball.x <= blockBbox[2] && this.#ball.y <= blockBbox[3]) {
                        block.hit = true;
                        // Block is hit, but where?
                        if (this.#ball.x === blockBbox[0] || this.#ball.x === blockBbox[2]) {
                            this.#ball.direction[0] *= -1;
                        }
                        if (this.#ball.y === blockBbox[1] || this.#ball.y === blockBbox[3]) {
                            this.#ball.direction[1] *= -1;
                        }

                        if (!this.#blocks.some(block => !block.hit)) {
                            this.#state = GameState.WON;
                        }

                        break;
                    }
                }
            }

            // Check if the ball is out of the game area
            if (this.#ball.y > this.#viewportHeight) {
                this.#state = GameState.LOST;
            }
        }
    }

    render() {
        // Clear the screen
        this.#ctx.clearRect(0, 0, this.#viewportWidth, this.#viewportHeight);

        // Resize, if needed
        const canvasElem = this.target.querySelector('canvas');
        if (this.#viewportHeight !== canvasElem.clientHeight || this.#viewportWidth !== canvasElem.clientWidth) {
            canvasElem.width = canvasElem.clientWidth;
            canvasElem.height = canvasElem.clientHeight;
            this.#viewportWidth = canvasElem.clientWidth;
            this.#viewportHeight = canvasElem.clientHeight;
        }

        if (this.#state === GameState.RUNNING) {
            // Draw ball
            this.#ctx.fillStyle = '#000000';
            this.#ctx.strokeStyle = '#000000';
            this.#ctx.beginPath();
            this.#ctx.arc(this.#ball.x, this.#ball.y, this.#ball.radius, 0, Math.PI * 2);
            this.#ctx.fill();

            // Draw paddle
            this.#ctx.fillRect(this.#paddle.x - this.#paddle.width / 2,
                this.#paddle.y - 10, this.#paddle.width, 10);

            // Draw blocks
            for (let block of this.#blocks) {
                if (!block.hit) {
                    this.#ctx.strokeRect(block.x - block.width / 2,
                        block.y - block.height / 2, block.width, block.height);
                }

            }
        } else {
            const msg = this.#state === GameState.WON ? 'Congratulations!' : 'Try again!';

            this.#ctx.font = '30px serif';
            this.#ctx.textAlign = 'center';
            this.#ctx.fillText(msg, this.#viewportWidth / 2, this.#viewportHeight / 2);

            const timeLeft = Math.ceil(5 - (Date.now() - this.#timeoutStart) / 1000);
            this.#ctx.font = '25px serif';
            this.#ctx.fillText(`Restarting in ${timeLeft} seconds`, this.#viewportWidth / 2, this.#viewportHeight / 2 + 40);
        }

        this.#animationKey = requestAnimationFrame(this.render.bind(this));
    }

    destroy() {
        super.destroy();

        if (this.#intervalKey) {
            clearInterval(this.#intervalKey);
        }
        if (this.#animationKey) {
            cancelAnimationFrame(this.#animationKey);
        }

        window.removeEventListener('keypress', this.onKeyPress);
    }

    /**
     * Builds the wall layout from blocks.
     */
    #buildWall() {
        //Row 1
        const block1 = new Block(this.#viewportWidth / 2, 100);
        this.#blocks.push(block1);

        // Row 2
        const row2Y = block1.y + block1.height;
        let row2X = block1.x - block1.width / 2;
        const block2 = new Block(row2X, row2Y);
        this.#blocks.push(block2);
        const block3 = new Block(row2X + block2.width, row2Y);
        this.#blocks.push(block3);

        // Row 3
        const row3Y = block2.y + block2.height;
        let row3X = block2.x - block2.width / 2;
        const block4 = new Block(row3X, row3Y);
        this.#blocks.push(block4);
        const block5 = new Block(row3X + block4.width, row3Y);
        this.#blocks.push(block5);
        const block6 = new Block(row3X + block4.width * 2, row3Y);
        this.#blocks.push(block6);
    }

    /**
     * Centers paddle and spawns a new ball.
     */
    #resetPlayer() {
        this.#paddle = new Paddle(this.#viewportWidth / 2, this.#viewportHeight - 10);
        this.#ball = new Ball(this.#viewportWidth / 2, this.#paddle.y - 20);
    }
}

/**
 * The current state of the game
 * @enum
 */
const GameState = {
    RUNNING: 0,
    WON: 1,
    LOST: 2
}
