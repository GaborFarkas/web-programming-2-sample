import Application from "./Application.js";
import Card from "./memory-game/Card.js";

export default class MemoryGame extends Application {
    /**
     * Available picture URLs for the memory game's pairs.
     * @type {string[]}
     */
    #availablePictures = [
        'https://cdn3.iconfinder.com/data/icons/chess-game-outline/32/chess_game-03-512.png',
        'https://static.wikia.nocookie.net/chess/images/9/97/LightRook.png/revision/latest/scale-to-width/360?cb=20230320152615',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYtqWmHBhbo_rKLCdqS1CO_3s2dLzZ1pWc0Q&usqp=CAU',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaf5JSrMPfmT9arSSyQf4iE64ufUD2fbYdczQF741sA5xGeJHKA1TqGNOFrCTTPlC7aso&usqp=CAU',
        'https://static.wikia.nocookie.net/chess/images/4/42/LightQueen.png/revision/latest/scale-to-width/360?cb=20230320152643',
        'https://png.pngtree.com/png-vector/20220609/ourmid/pngtree-vector-image-of-chess-king-on-background-png-image_4847109.png',
        'https://www.megachess.com/cdn/shop/products/DSC_0215_65a2e6d4-9b68-484d-aeed-42c7e8b441c6.jpg?v=1535653614',
        'https://media.istockphoto.com/id/1408981961/vector/knight-chess-piece-in-the-sketch-style.jpg?s=612x612&w=0&k=20&c=eFVFe4ztckAOIua1maHlrdYZmDGF0jVrSG7sTVS1QHk='
    ];

    /**
     * Key of the setTimeout delegate.
     */
    #timeoutKey;

    /**
     * @param {import('./Application').ApplicationOptions} options Options.
     */
    constructor(options = {}) {
        super(options);
    }

    initialize() {
        super.initialize();

        const cards = this.target.querySelectorAll('.memory-game-card');

        /*
        const urls = [];

        for (let url of this.#availablePictures) {
            urls.push(url);
            urls.push(url);
        }*/

        const urls = [...this.#availablePictures, ...this.#availablePictures];

        for (let cardElem of cards) {
            const cardUrlIndex = Math.round(Math.random() * (urls.length - 1));
            const cardUrl = urls[cardUrlIndex];

            const card = new Card(cardElem, cardUrl);
            urls.splice(cardUrlIndex, 1);

            cardElem.addEventListener('click', /** @this {MemoryGame} */ function () {
                this.#flipCard(card);
            }.bind(this));
        }
    }

    run() {
        super.run();

        this.#timeoutKey = setTimeout(function () {
            alert('Game over');
        }.bind(this), 5000);
    }

    /**
     * Checks if a card can be flipped, and if so, flips it.
     * @param {Card} card The card to flip.
     */
    #flipCard(card) {
        if (!card.matched) {
            card.flip();
        }
    }

    destroy() {
        super.destroy();

        if (this.#timeoutKey) {
            clearTimeout(this.#timeoutKey);
            this.#timeoutKey = undefined;
        }
    }
}