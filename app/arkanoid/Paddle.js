import GameObject from "./GameObject.js";

export default class Paddle extends GameObject {
    /**
     * The width of the paddle in pixels.
     * @type {number}
     */
    width = 200;

    /**
     * Moves the paddle to the given x position.
     * @param {number} x
     */
    move(x) {
        super.move(x, this.y);
    }

    /**
     * @param {number} x The X ordinate.
     * @param {number} y The Y ordinate.
     */
    constructor(x, y) {
        super();
        super.move(x, y);
    }
}