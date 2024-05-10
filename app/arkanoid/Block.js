import GameObject from "./GameObject.js";

export default class Block extends GameObject {
    /**
     * The width of the block in pixels.
     * @type {number}
     */
    width = 100;

    /**
     * The height of the block in pixels.
     * @type {number}
     */
    height = 50;

    /**
     * Gets or sets if the block has been hit by a ball.
     * @type {boolean}
     */
    hit = false;

    /**
     * @param {number} x The X ordinate.
     * @param {number} y The Y ordinate.
     */
    constructor(x, y) {
        super();
        super.move(x, y);
    }
}