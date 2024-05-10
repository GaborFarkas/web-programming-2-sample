import Application from './Application.js';

export default class ProgressBar extends Application {
    /**
     * @param {import('./Application').ApplicationOptions} options Options.
     */
    constructor(options = {}) {
        super(options);
    }

    /**
     * @type {number[]}
     */
    foundPrimes = [];

    /**
     * The number of primes need to be found
     * @type {number}
     */
    numPrimes = 0;

    initialize() {
        super.initialize();

        this.target.querySelector('button').addEventListener('click', async function () {
            this.numPrimes = parseInt(this.target.querySelector('input').value);
            //this.calcPrimes();
            /*console.log('Before calling async');
            const result = this.calcPrimesAsync();
            console.log(result);
            console.log(this.foundPrimes);*/

            this.calcPrimesThreaded();
        }.bind(this));
    }

    calcPrimes() {
        const now = Date.now();
        console.log(`Calculating the first ${this.numPrimes} prime numbers`);
    
        if (typeof this.numPrimes !== 'number') {
            this.numPrimes = 0;
            throw new Error('Required parameter numPrimes must be a number');
        }
    
        //TODO: check if positive integer
    
        this.foundPrimes = [];
        this.target.querySelector('.fill').style.width = '0';
        let cursor = 1;
        while (this.foundPrimes.length < this.numPrimes) {
            if (this.#isPrime(cursor)) {
                this.#addPrime(cursor);
            }
            cursor += cursor > 2 ? 2 : 1;
        }

        console.log(`Prime calculation took ${(Date.now() - now) / 1000} secs`);
    
        return this.foundPrimes;
    }

    async calcPrimesAsync() {
        const now = Date.now();
        console.log(`Calculating the first ${this.numPrimes} prime numbers`);
    
        if (typeof this.numPrimes !== 'number') {
            this.numPrimes = 0;
            throw new Error('Required parameter numPrimes must be a number');
        }
    
        //TODO: check if positive integer
    
        this.foundPrimes = [];
        this.target.querySelector('.fill').style.width = '0';
        let cursor = 1;
        while (this.foundPrimes.length < this.numPrimes) {
            if (await this.#isPrimeAsync(cursor)) {
                this.#addPrime(cursor);
            }
            cursor += cursor > 2 ? 2 : 1;
        }

        console.log(`Prime calculation took ${(Date.now() - now) / 1000} secs`);
    
        return this.foundPrimes;
    }

    #isPrimeAsync(number) {
        return new Promise(function(resolve, reject) {
            for (let i = 2; i < number;  ++i) {
                if (number % i === 0) {
                    resolve(false);
                    return;
                }
            }
        
            if (this.foundPrimes.length % 10 === 0) {
                setTimeout(function () {
                    resolve(true);
                }, 0);
            } else {
                resolve(true);
            }
        }.bind(this));
    }
    
    #isPrime(number) {
        for (let i = 2; i < number;  ++i) {
            if (number % i === 0) return false;
        }
    
        return true;
    }

    calcPrimesThreaded() {
        const worker = new Worker('app/workers/calcPrimes.js');
        this.foundPrimes = [];
        worker.postMessage(this.numPrimes);

        worker.onmessage = function (evt) {
            this.#addPrime(evt.data);
        }.bind(this);
    }

    #addPrime(num) {
        this.foundPrimes.push(num);
        this.target.querySelector('.fill').style.width =
            `${this.foundPrimes.length / this.numPrimes * 100}%`
    }
}