let next = document.getElementById('right');
let previous = document.getElementById('left')
let cards = document.getElementsByClassName('card');

let cardWidth = cards[0].offsetWidth;
let cardMarginRight = parseInt(getComputedStyle(cards[0]).marginRight);
let move = cardWidth + cardMarginRight;
let currentIndex = 0;

function slidecards() {
    for (let i = 0; i < cards.length; i++) {
        cards[i].style.transform = `translateX(${move * (currentIndex * -1)}px)`
    }
}

next.addEventListener('click', () => {
    if (currentIndex < cards.length - 1) {
        currentIndex++;
        slidecards()
    }
})


previous.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        slidecards();
    }
})


let foodNext = document.getElementById('food-category-next');
let foodPrevious = document.getElementById('food-category-previous');
let foodCards = document.getElementsByClassName('food-category-cards');

let foodCardsWidth = foodCards[0].offsetWidth;
let foodCardsMarginRight = 20/*  parseInt(getComputedStyle(foodCards[0]).marginRight); */;
let foodCardsMove = foodCardsWidth + foodCardsMarginRight;
let foodCurrentIndex = 0;

function slideFoodCards() {
    for (let i = 0; i < foodCards.length; i ++) {
        foodCards[i].style.transform = `translateX(${foodCardsMove * (foodCurrentIndex * -1)}px)`
    }
}

foodNext.addEventListener('click', () => {
    if (foodCurrentIndex < foodCards.length -1) {
        foodCurrentIndex++;
        slideFoodCards();
    }
})

foodPrevious.addEventListener('click', () => {
    if (foodCurrentIndex > 0) {
        foodCurrentIndex--;
        slideFoodCards();
    }
})

let address = document.getElementById('top-address');
let addressInput = document.getElementById('address-input');

window.addEventListener('load', () => {
  navigator.geolocation.getCurrentPosition(position => {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
  console.log(lat, long);
  fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`)
  .then(response => response.json())
  .then(data => {
    const street = data.address.road || data.address.neighbourhood || data.address.suburb || 'Street not found';
    const city = data.address.city || data.address.town || data.address.village || data.address.county || data.address.locality || 'City not found';

    address.innerText = `${street}, ${city}`;
    addressInput.value = address.innerText;
    console.log(data.display_name);

    localStorage.setItem('address', address.innerText);
  })
}, function(error) {
  if(error.PERMISSION_DENIED) {
    console.log('permission was denied');
    addressInput.value = address.innerText;
    localStorage.setItem('address', address.innerText);
  }
})
})