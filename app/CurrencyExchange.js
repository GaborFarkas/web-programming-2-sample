import Application from "./Application.js";

export default class CurrencyExchange extends Application {
    #dependencies = {
        css: [
            {
                url: 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.3/themes/base/jquery-ui.min.css',
                integrity: 'sha512-8PjjnSP8Bw/WNPxF6wkklW6qlQJdWJc/3w/ZQPvZ/1bjVDkrrSqLe9mfPYrMxtnzsXFPc434+u4FHLnLjXTSsg=='
            },
            {
                url: 'https://cdnjs.cloudflare.com/ajax/libs/datatables.net-dt/2.0.6/css/dataTables.dataTables.min.css',
                integrity: 'sha512-T8BgXd9MafK8shYZfxoTzfT/h8wdpftMbPL4QBcIrvK7jCrwOnajfT3Dn7AQPMNHkcVHwbJ9h/vSReJOX+4NrA=='
            }
        ],
        js: [
            {
                url: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js',
                integrity: 'sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g=='
            },
            {
                url: 'https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.3/jquery-ui.min.js',
                integrity: 'sha512-Ww1y9OuQ2kehgVWSD/3nhgfrb424O3802QYP/A5gPXoM4+rRjiKrjHdGxQKrMGQykmsJ/86oGdHszfcVgUr4hA=='
            },
            {
                url: 'https://cdnjs.cloudflare.com/ajax/libs/datatables.net/2.0.6/dataTables.min.js',
                integrity: 'sha512-jVQbhGU48Ggwr15HUeDSmfDGHTHJc+nFUGkQM2lIyhQDAqlolwiOQGAQH+0huO3LIQVBnBuiEZYkg4479cJq7A=='
            },
            {
                url: 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js',
                integrity: 'sha512-ZwR1/gSZM3ai6vCdI+LVF1zSq/5HznD3ZSTk7kajkaj4D292NLuduDCO1c/NT8Id+jE58KYLKT7hXnbtryGmMg=='
            }
        ]
    };

    #table;

    #chart;

    /**
     * @param {import('./Application').ApplicationOptions} options Options.
     */
    constructor(options = {}) {
        super(options);
    }

    async initialize() {
        super.initialize();

        const response = await fetch("https://open.er-api.com/v6/latest/EUR");
        if (response.ok) {
            const data = await response.json();
            this.#populateCurrencyLists(Object.keys(data.rates));

            const calcBtnElem = this.target.querySelector('button');
            calcBtnElem.addEventListener('click', /** @this {CurrencyExchange} */ async function () {
                const fromCurrency = this.target.querySelector('#fromCurrency').value;
                const toCurrency = this.target.querySelector('#toCurrency').value;
                const exchangeVal = parseFloat(this.target.querySelector('input').value);
                const converted = await this.#calculateCurrencyAsync(fromCurrency, toCurrency, exchangeVal);

                this.target.querySelector('#fromResult').textContent = `${exchangeVal} ${fromCurrency}`;
                this.target.querySelector('#toResult').textContent = `${converted} ${toCurrency}`;
            }.bind(this));

            await this.#loadDependenciesAsync();

            $('#tabs').tabs();

            const tblArr = [];
            for (let rate in data.rates) {
                tblArr.push([data.base_code, rate, data.rates[rate]]);
            }
            this.#table = new DataTable('#exchange-rates-tbl', {
                data: tblArr
            });

            this.#chart = new Chart(document.getElementById('exchange-rates-chart'), {
                type: 'bar',
                options: {
                    indexAxis: 'y',
                    maintainAspectRatio: false,
                    scales: {
                        xAxis: {
                            type: 'logarithmic'
                        }
                    }
                },
                data: {
                    labels: Object.keys(data.rates),
                    datasets: [{
                        label: 'Exchange rate',
                        data: Object.values(data.rates),
                        barThickness: 10
                    }]
                }
            });
        }
    }

    destroy() {
        super.destroy();

        window['$'] = undefined;
    }

    /**
     * Fills the currency dropdowns
     * @param {string[]} currencies 
     */
    #populateCurrencyLists(currencies) {
        const dropdowns = this.target.querySelectorAll('select');
        for (let dropdown of dropdowns) {
            for (let curr of currencies) {
                const option = document.createElement('option');
                option.value = curr;
                option.textContent = curr;
                dropdown.appendChild(option);
            }
        }
    }

    /**
     * Calculates currency value based on 2 currencies and an amount.
     * @param {string} fromCurrency 
     * @param {string} toCurrency 
     * @param {number} amount 
     */
    async #calculateCurrencyAsync(fromCurrency, toCurrency, amount) {
        const response = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
        if (response.ok) {
            const data = await response.json();
            if (data.rates[toCurrency]) {
                const multiplier = data.rates[toCurrency];
                return amount * multiplier;
            }
        }

        throw new Error(`Could not get exchange rates for ${fromCurrency} -> ${toCurrency}`);
    }

    async #loadDependenciesAsync() {
        return new Promise(async function (resolve, reject) {
            const loadMap = new Map();
            for (let dependency of [...this.#dependencies.css, ...this.#dependencies.js]) {
                loadMap.set(dependency, false);
            }

            for (let css of this.#dependencies.css) {
                const linkElem = document.createElement('link');
                linkElem.rel = 'stylesheet';
                linkElem.href = css.url;
                linkElem.integrity = css.integrity;
                linkElem.crossOrigin = 'anonymous';

                linkElem.addEventListener('load', function () {
                    loadMap.set(css, true);
                    if ([...loadMap.values()].every(loadVal => loadVal)) {
                        resolve();
                    }
                });
                linkElem.addEventListener('error', function () {
                    reject();
                });

                this.target.appendChild(linkElem);
            }

            for (let js of this.#dependencies.js) {
                await this.#loadScriptAsync(js);
                
                loadMap.set(js, true);
                if ([...loadMap.values()].every(loadVal => loadVal)) {
                    resolve();
                }
            }
        }.bind(this));
    }

    /**
     * Loads a single dependency in an asynchronous way.
     * @param {{url: string, integrity: string}} dependency 
     */
    async #loadScriptAsync(dependency) {
        return new Promise((resolve, reject) => {
            const scriptElem = document.createElement('script');
            scriptElem.src = dependency.url;
            scriptElem.integrity = dependency.integrity;
            scriptElem.crossOrigin = 'anonymous';

            scriptElem.addEventListener('load', function () {
                resolve();
            });
            scriptElem.addEventListener('error', function () {
                reject();
            });

            this.target.appendChild(scriptElem);
        });
    }
}