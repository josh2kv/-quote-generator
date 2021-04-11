/** @format */
const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

let apiQuotes = [];

//  Loading Spinner 보이기
function showLoadingSpinner() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}

//  Loading Spinner 숨기기
function removeLoadingSpinner() {
  if (!loader.hidden) {
    loader.hidden = true;
    quoteContainer.hidden = false;
  }
}

// localhost로 freeAPI를 호출시 blocked되는 문제 해결빙법(CORS Policy로 인해) -> proxyAPI를 먼저 호출 후 freeAPI 호출
// https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
async function getQuote() {
  showLoadingSpinner();
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const apiUrl =
    'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
  try {
    const response = await fetch(proxyUrl + apiUrl);
    const data = await response.json();
    console.log('data', data);
    // author가 없으면, Unknown으로 출력
    if (data.quoteAuthor === '') {
      authorText.innerText = 'Unknown';
    } else {
      authorText.innerText = data.quoteAuthor;
    }
    // quoteText가 길면, 폰트사이즈 줄임
    if (data.quoteText.length > 50) {
      quoteText.classList.add('long-quote');
    } else {
      quoteText.classList.remove('long-quote');
    }
    quoteText.innerText = data.quoteText;
    removeLoadingSpinner();
  } catch (error) {
    getQuote(); // 일부 Quote에 포함된 특수문자때문에 종종 에러가 발생함 그래서 한번 더 함수 호출하도록 함(SyntaxError: Unexpected token ' in JSON at position 18)
    console.log('error', error);
  }
}

function tweetQuote() {
  const quote = quoteText.innerText;
  const author = authorText.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
  window.open(twitterUrl, '_blank');
}

// Event Listeners
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);

// 처음 로드시 Quote 출력
getQuote();
