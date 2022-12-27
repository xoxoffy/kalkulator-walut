const api_URL = 'https://api.nbp.pl/api/exchangerates/tables/a/?format=json';

const getDataButton = document.getElementById('getDataButton');
const calculatedDiv = document.getElementById('calculated');
const errorDiv = document.getElementById('error');
const loader = document.getElementById('loader');

const select = document.getElementById('currencies');
const input = document.getElementById('inputCurrency');

const calculatedExchangeSpan = document.createElement('span');

const errorText = document.createElement('b');
errorText.style.color = 'red';

let selectedCurrencyText;

const hideLoader = () => {
  loader.style.display = 'none';
};

const showLoader = () => {
  loader.style.display = '';
};

const showError = () => {
  errorDiv.style.display = '';
  calculatedDiv.style.display = 'none';
};

const hideError = () => {
  errorDiv.style.display = 'none';
  calculatedDiv.style.display = '';
};

const getData = () => {
  showLoader();
  axios
    .get(api_URL)
    .then((response) => {
      if (response) {
        hideLoader();
        const prices = response.data[0].rates;
        const usd = prices.filter((rate) => rate.code === 'USD')[0].mid;
        const eur = prices.filter((rate) => rate.code === 'EUR')[0].mid;
        const chf = prices.filter((rate) => rate.code === 'CHF')[0].mid;

        const selectValue = select.options[select.selectedIndex].value;
        const inputValue = input.value;

        if (!inputValue) {
          showError();
          errorDiv.appendChild(errorText);
          errorText.innerText = 'Pole z walutą jest puste!';
          return;
        } else if (inputValue <= 0) {
          showError();
          errorDiv.appendChild(errorText);
          errorText.innerText = 'Pole z walutą musi być większe od zera!';
          return;
        } else {
          hideError();
        }

        if (selectValue === 'USD') {
          calculateExchange(usd);
        } else if (selectValue === 'EUR') {
          calculateExchange(eur);
        } else if (selectValue === 'CHF') {
          calculateExchange(chf);
        }
      }
    })
    .catch((error) => {
      window.alert(error);
    });
};

const calculateExchange = (currencyRate) => {
  const selectValue = select.options[select.selectedIndex].value;
  const inputValue = input.value;
  const calculatedExchange = currencyRate * inputValue;

  textVariant(selectValue, inputValue);

  calculatedExchangeSpan.innerText =
    inputValue +
    selectedCurrencyText +
    ' to ' +
    calculatedExchange.toFixed(2) +
    ' złotych';
  calculatedDiv.appendChild(calculatedExchangeSpan);
};

const textVariant = (selectValue) => {
  if (selectValue === 'USD') {
    selectedCurrencyText = ' USD ';
  } else if (selectValue === 'EUR') {
    selectedCurrencyText = ' EUR ';
  } else if (selectValue === 'CHF') {
    selectedCurrencyText = ' CHF ';
  }
};

getDataButton.addEventListener('click', getData);
