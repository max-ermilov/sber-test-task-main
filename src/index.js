import './index.css';
import {read as readFile} from 'xlsx';


const fileInputElement = document.getElementById('input_dom_element');
const searchInputElement = document.getElementById('search-input');
const resultElement = document.getElementById('result');
let dataArray = [];

const setResultMessage = (message = '') => {
  resultElement.textContent = message.toString();
}

async function handleFileAsync(e) {
  const file = e.target.files[0];
  if (!file) {
    searchInputElement.disabled = true;
  } else {
    const fileData = await file.arrayBuffer();
    const workbook = readFile(fileData);

    dataArray = workbook?.Strings
      .map(s => {return s.t})
      .filter(s => {return s !== '' && s.length > 4});
    searchInputElement.disabled = false;
  }

}

function handleSearch(inputValue) {
const found = dataArray.some(i => {
  return i.includes(inputValue);
});
  if (found) {
    setResultMessage('Номер найден');
  } else {
    setResultMessage('Номер не найден');
  }
}

function handleInput(e) {
  e.preventDefault();
  const i = e.target.value.trim().toString().toUpperCase();
  e.target.value = i;
  if (i.length >= 3) {
    handleSearch(i);
  } else {
    setResultMessage();
  }
}

fileInputElement.addEventListener("change", handleFileAsync, false);
searchInputElement.addEventListener("input", handleInput);
