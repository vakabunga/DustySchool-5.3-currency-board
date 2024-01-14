// create constants
const page = document.querySelector('.page'); // page container
let currenciesRatesBase; // will set after API response
const currenciesArray = ['USD', 'AED', 'CNY', 'RUB']; // can be asked from user
const currencies = currenciesArray.toString();
const currenciesNumber = currenciesArray.length;
const baseCurrency = 'EUR'; // can be asked from user (required API paid plan); variable is not used in this app
const API_KEY = localStorage.getItem('apiKey');

// create application container
const appContainer = document.createElement('div');
appContainer.classList.add('app-container');
const appHeader = document.createElement('h5');
appHeader.classList.add('app-header');
page.appendChild(appContainer);
appContainer.appendChild(appHeader);

// create row
function createRow(rowNumber) {
    const tableRow = document.createElement('div');
    tableRow.classList.add('table-row');
    const currencyCell = document.createElement('div');
    const currencyExchangeRateCell = document.createElement('div');
    currencyCell.dataset.cell = rowNumber + '.1';
    currencyExchangeRateCell.dataset.cell = rowNumber + '.2';
    tableRow.appendChild(currencyCell);
    tableRow.appendChild(currencyExchangeRateCell);

    if (currencyCell.dataset.cell === '-1.1') {
        currencyCell.classList.add('currency-name-header');
        currencyCell.textContent = 'Currency';
    } else {
        currencyCell.classList.add('currency-name-cell', 'table-row-next', 'table-cell');
        currencyCell.textContent = 'loading..';
    }

    if (currencyExchangeRateCell.dataset.cell === '-1.2') {
        currencyExchangeRateCell.classList.add('currency-exchange-rate-header');
        currencyExchangeRateCell.textContent = 'Exchange Rate';
    } else {
        currencyExchangeRateCell.classList.add('currency-exchange-rate-cell', 'table-row-next', 'table-cell');
        currencyExchangeRateCell.textContent = 'loading..';
    }

    return tableRow;
}

// create currencies exchange rate table
function createTable(tableRows) {
    for (let i = -1; i < tableRows; i++) {
        const tableRow = createRow(i);
        appContainer.appendChild(tableRow);
    }
}

// get data from API
function getCurrencyExchangeRates() {
    fetch(`http://api.exchangeratesapi.io/v1/latest?access_key=${API_KEY}&symbols=${currencies}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                throw new Error(data.error.message);
            }

            for (i = 0; i < currenciesNumber; i++) {
                const currencyCellData = document.querySelector(`[data-cell='${i}.1']`);
                const currencyRateData = document.querySelector(`[data-cell='${i}.2']`);
                currencyCellData.textContent = currenciesArray[i];
                currencyRateData.textContent = data.rates[currenciesArray[i]].toFixed(4);
            }
            appHeader.textContent = `Currencies Exchange Rate for ${data.base}`;
        })
        .catch((error) => {
            appHeader.textContent = error;
        })
        .finally(() => {
            setTimeout(getCurrencyExchangeRates, 60000);
        })
}

createTable(currenciesNumber);
getCurrencyExchangeRates();
