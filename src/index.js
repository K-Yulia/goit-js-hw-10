import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
function onInput(event) {
  event.preventDefault();
  const countryName = event.target.value.trim();
  clearMarkup();

  if (!countryName === '') {
    return;
  }
  fetchCountries(countryName)
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (data.length > 1) {
        createCauntryListMarkup(data);
      }
      if (data.length === 1) {
        countryList.innerHTML = '';
        createCauntryCardMarkup(data);
      }
    })
    .catch(err => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function createCauntryListMarkup(data) {
  const markup = data
    .map(
      ({ name: { official }, flags: { svg } }) =>
        `<li>
        <img src='${svg}' alt ='${official}' width=95 height = 45 >
        <h2>${official}</h2>
        </li>`
    )
    .join('');

  countryList.innerHTML = markup;
}

function createCauntryCardMarkup(data) {
  const markup = data
    .map(
      ({
        name: { official },
        flags: { svg },
        population,
        capital,
        languages,
      }) =>
        `<div><img src='${svg}' alt ='${official}' width=45 height = 45> <h2> ${official}</h2>
        <h3>Capital: ${capital}</h3>
        <h3>Population: ${population}</h3>
        <h3>Languages: ${Object.values(languages)}</h3>
          </div>`
    )
    .join('');

  countryInfo.innerHTML = markup;
}

function clearMarkup() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
