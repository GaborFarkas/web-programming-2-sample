import Application from './Application.js';

export default class PrimeCalculator extends Application {
    /**
     * @param {import('./Application').ApplicationOptions} options Options.
     */
    constructor(options = {}) {
        super(options);
    }

    initialize() {
        super.initialize();

        const divElem = document.createElement('div');
        this.target.appendChild(divElem);
    }

    run() {
        super.run();
        const results = PrimeCalculator.calcPrimes(2000);
        this.target.lastChild.textContent = results.join(', ');
    }

    static calcPrimes(numPrimes) {
        console.log(`Calculating the first ${numPrimes} prime numbers`);
    
        if (typeof numPrimes !== 'number') {
            throw new Error('Required parameter numPrimes must be a number');
        }
    
        //TODO: check if positive integer
    
        const foundPrimes = [];
        let cursor = 1;
        while (foundPrimes.length < numPrimes) {
            if (this.#isPrime(cursor)) {
                foundPrimes.push(cursor);
            }
            cursor += cursor > 2 ? 2 : 1;
        }
    
        return foundPrimes;
    }
    
    static #isPrime(number) {
        for (let i = 2; i < number;  ++i) {
            if (number % i === 0) return false;
        }
    
        return true;
    }
}