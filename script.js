const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// NASA DEMO API
const count = 10;
const apiKey = 'lop1MScSpaqBSN6wdNXBqSLq277sXIlJ9od0peAn';
const apiURL = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function showContent(page) {
  window.scrollTo({ top: 0, behavior: 'instant' });
  loader.classList.add('hidden');
  if (page === 'results') {
    resultsNav.classList.remove('hidden');
    favoritesNav.classList.add('hidden');
  } else {
    resultsNav.classList.add('hidden');
    favoritesNav.classList.remove('hidden');
  }
}

function createDOMNodes(page) {
  const currentArray = page === 'results' ? resultsArray : Object.values(favorites);

  currentArray.forEach(result => {
    //card container
    const card = document.createElement('div');
    card.classList.add('card');
    //Link
    const link = document.createElement('a');
    link.href = result.hdurl;
    link.title = 'View Full Image';
    link.target = '_blank';
    // img
    const image = document.createElement('img');
    image.src = result.url;
    image.alt = 'NASA Picture of the Day';
    image.loading = 'lazy';
    image.classList.add('card-img-top');
    //card-body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    // card title of image
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = result.title;
    // p for add to favorites
    const saveText = document.createElement('p');
    saveText.classList.add('clickable');
    if (page === 'results') {
      saveText.textContent = 'Add to Favorites';
      saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);
    } else {
      saveText.textContent = 'Remove Favorites';
      saveText.setAttribute('onclick', `removeFavorite('${result.url}')`);
    }
    // card-text
    const cardText = document.createElement('p');
    cardText.textContent = result.explanation;
    //footer container
    const footer = document.createElement('small');
    footer.classList.add('text-muted');
    //strong for date
    const date = document.createElement('strong');
    date.textContent = result.date;
    //span for copyright
    const copyrightResult = result.copyright === undefined ? '' : result.copyright;
    const copyright = document.createElement('span');
    copyright.textContent = ` ${copyrightResult}`;

    // append all toghether in right order
    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.appendChild(image);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);
  });
}

function updateDOM(page) {
  // get favorites from localstorage
  if (localStorage.getItem('nasaFavorites')) {
    favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
  }
  imagesContainer.textContent = '';
  createDOMNodes(page);
  showContent(page);
}

// get 10 images from NASA API
async function getNasaPictures() {
  // show loader
  loader.classList.remove('hidden');
  try {
    const response = await fetch(apiURL);
    resultsArray = await response.json();
    updateDOM('results');
  } catch (error) {
    console.log('error', error);
    //catch error here
  }
}

//add result to favorites
function saveFavorite(itemURL) {
  resultsArray.forEach(item => {
    if (item.url.includes(itemURL) && !favorites[itemURL]) {
      favorites[itemURL] = item;
      //show save confirmation for 2 seconds
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);

      // set favorites in localstorage
      localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    }
  });
}

//remove items from Favorites
function removeFavorite(itemURL) {
  if (favorites[itemURL]) {
    delete favorites[itemURL];

    // set favorites in localstorage
    localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    updateDOM('favorites');
  }
}

getNasaPictures();
