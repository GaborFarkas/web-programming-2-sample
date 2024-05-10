onmessage = function (evt) {
    console.log('Worker: Message received from main script');
    const numPrimes = evt.data;

    if (typeof numPrimes !== 'number') {
        postMessage('Required parameter numPrimes must be a number');
    } else {
        calcPrimes(numPrimes);
    }
}

function calcPrimes(numPrimes) {
    const foundPrimes = [];
    const now = Date.now();
    console.log(`Calculating the first ${numPrimes} prime numbers`);

    let cursor = 1;
    while (foundPrimes.length < numPrimes) {
        if (isPrime(cursor)) {
            foundPrimes.push(cursor);
            postMessage(cursor);
        }
        cursor += cursor > 2 ? 2 : 1;
    }

    console.log(`Prime calculation took ${(Date.now() - now) / 1000} secs`);

    return foundPrimes;
}

function isPrime(number) {
    for (let i = 2; i < number;  ++i) {
        if (number % i === 0) return false;
    }

    return true;
}