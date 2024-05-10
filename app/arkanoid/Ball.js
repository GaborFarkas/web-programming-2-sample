import GameObject from "./GameObject.js";

export default class Ball extends GameObject {
    /**
     * Velocity of the ball in pixels/update.
     * @type {number}
     */
    velocity = 5;

    /**
     * Radius of the ball in pixels.
     * @type {number}
     */
    radius = 5;

    /**
     * The direction multipliers of the ball.
     * @type {[number, number]}
     */
    direction = [1, -1];

    /**
     * Moves the ball automatically to its next position.
     */
    move() {
        super.move(this.x + this.velocity * this.direction[0],
            this.y + this.velocity * this.direction[1]);
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