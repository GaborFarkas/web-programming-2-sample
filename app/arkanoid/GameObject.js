export default class GameObject {
    /**
     * X coordinate of this game object. Backing field.
     * @type {number}
     */
    #x = 0;

    /**
     * X coordinate of this game object.
     * @type {number}
     */
    get x() {
        return this.#x;
    }

    /**
     * Y coordinate of this game object. Backing field.
     * @type {number}
     */
    #y = 0;

    /**
     * Y coordinate of this game object.
     * @type {number}
     */
    get y() {
        return this.#y;
    }

    /**
     * Moves the object to coordinate <X, Y>
     * @param {number} x The X ordinate.
     * @param {number} y The Y ordinate.
     */
    move(x, y) {
        this.#x = x;
        this.#y = y;
    }
}