import './index.css';
import {read as readFile} from 'xlsx';


const fileInputElement = document.getElementById('input_dom_element');
const searchInputElement = document.getElementById('search-input');
const resultElement = document.getElementById('result');
let dataArray = [];

const setResultMessage = (message = '') => {
  resultElement.textContent = message.toString();
};

const enToRu = {
  'A': 'А',
  'B': 'В',
  'E': 'Е',
  'K': 'К',
  'M': 'М',
  'H': 'Н',
  'O': 'О',
  'P': 'Р',
  'C': 'С',
  'T': 'Т',
  'Y': 'У',
  'X': 'Х',
  ' ': ''
};

function replaceAll(str, mapObj) {
  const regExp = new RegExp(Object.keys(mapObj).join("|"), "gi");

  return str.replace(regExp, function (matched) {
    return mapObj[matched.toUpperCase()];
  });
}

async function handleFileAsync(e) {
  const file = e.target.files[0];
  if (!file) {
    searchInputElement.disabled = true;
  } else {
    const fileData = await file.arrayBuffer();
    const workbook = readFile(fileData);
    dataArray = workbook?.Strings?.map(s => {
        return s.t
      })
      .filter(s => {
        return s !== '' && s.length > 4
      })
      .map(s => replaceAll(s, enToRu));
    searchInputElement.disabled = false;
  }
}

function handleSearch(inputValue) {
  const found = dataArray.some(i => {
    return i.includes(inputValue);
  });
  if (found) {
    const foundArray = dataArray.filter(s => {return s.includes(inputValue)});
    const numberOfFound = foundArray.length;
    const foundString = foundArray.join(', ')
    setResultMessage(`Номер найден ${numberOfFound} раз: ${foundString}.`);
  } else {
    setResultMessage('Номер не найден');
  }
}

function handleInput(e) {
  e.preventDefault();
  const i = e.target.value.trim().toString().toUpperCase();
  const input = replaceAll(i, enToRu);
  e.target.value = input;
  if (input.length >= 3) {
    handleSearch(input);
  } else {
    setResultMessage();
  }
}

fileInputElement.addEventListener("change", handleFileAsync, false);
searchInputElement.addEventListener("input", handleInput);
