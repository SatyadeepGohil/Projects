let nextBtn = document.getElementById('right');
let previousBtn = document.getElementById('left')
let cards = document.getElementsByClassName('card');

let cardWidth = cards[0].offsetWidth;
let cardMarginRight = parseInt(getComputedStyle(cards[0]).marginRight);
let move = cardWidth + cardMarginRight;

let foodNext = document.getElementById('food-category-next');
let foodPrevious = document.getElementById('food-category-previous');
let foodCards = document.getElementsByClassName('food-category-cards');

let foodCardsWidth = foodCards[0].offsetWidth;
let foodCardsMarginRight = parseInt(getComputedStyle(foodCards[0]).marginRight);;
let foodCardsMove = foodCardsWidth + foodCardsMarginRight;

let address = document.getElementById('top-address');
let addressInput = document.getElementById('address-input');

let loginBtn = document.getElementById('user-btn');
let loginForm = document.getElementById('login-form');
let loginContainer = document.getElementById('login-container');
let logout = document.getElementById('logout-btn');
let loginInfo = document.getElementById('login-information');

document.addEventListener('DOMContentLoaded', () => {
    checkFirstVisit();
    checkLoginStatus();
    setupAutoLogout();
})

logout.addEventListener('click', isLoggedOut);

function checkFirstVisit() {
    if (localStorage.getItem('hasVisited') !== 'true') {
        localStorage.setItem('hasVisited', 'true');
        loginInfo.innerText = 'Welcome visitor';
    }
}


loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    localStorage.setItem('user', JSON.stringify({username, password}));
    localStorage.setItem('isLoggedIn', 'true');
    checkLoginStatus();
    loginContainer.style.display = 'none'
})

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const user = JSON.parse(localStorage.getItem('user'));

    if (localStorage.getItem('hasVisited') === 'true') {
        loginInfo.innerText = 'Welcome back';
    }

    if (isLoggedIn && user) {
        loginContainer.style.display = 'none'
        username.value = user.username;
        loginInfo.innerText = 'You are login successfully'
        console.log('login succes')
    }
    else {
        loginContainer.style.display = 'block';
        console.log('login failed')
    }
}

function isLoggedOut() {
    localStorage.removeItem('user');
    localStorage.setItem('isLoggedIn', 'false');
    loginInfo.innerText = 'You are logged out';
    username.value = '';
    password.value = '';
    checkLoginStatus();
}

function setupAutoLogout() {
    let isLeaving = false;

    window.addEventListener('beforeunload', () => {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            isLeaving = true;
        }
    })

    document.addEventListener('visibilitychange', () => {
    if (document.hidden && isLeaving) {
        isLoggedOut();
    }
})
}


loginBtn.addEventListener('click', () => {
    loginContainer.style.display = loginContainer.style.display === 'block' ? 'none' : 'block';
})

Array.from(cards).forEach(card => {
    card.addEventListener('click', () => {
        window.location.href = '/search/search.html';
    })
})


function initSlider(next, previous, cards, moveStep) {
    let currentIndex = 0;
    function slidecards() {
    for (let i = 0; i < cards.length; i++) {
        cards[i].style.transform = `translateX(${moveStep * (currentIndex * -1)}px)`
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
}

initSlider(nextBtn, previousBtn, cards, move);
initSlider(foodNext, foodPrevious, foodCards, foodCardsMove);

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

    /* if (street === 'Street not found' || city === 'City not found') {
        alert("Our services couldn't find your whole address. So please enter your street and town manually.");
    } */

    if (street !== 'Street not found' && city !== 'City not found') {
    address.innerText = `${street}, ${city}`;
    addressInput.value = address.innerText;
    localStorage.setItem('address', address.innerText);
    }
  })
}, function(error) {
  if(error.PERMISSION_DENIED) {
    alert('We cannot get your locatoin due to some error. So enter your address manually');
  }
})
})

document.getElementById('address-form').addEventListener('submit', (event) => {
    event.preventDefault();

    if ((addressInput.value).trim() !== '') {
        window.location.href = `/search/search.html`;
    }
    else {
        alert('Please enter street and town name');
    }
})

document.getElementById('find-food').addEventListener('click', () => {
    const manualAddres = addressInput.value;
    address.innerText = manualAddres;
    localStorage.setItem('address', manualAddres)
})


document.getElementById('pickup').addEventListener('click', () => {
    alert('we currently do not provide this service yet');
})