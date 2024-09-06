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
let foodCardsMarginRight = parseInt(getComputedStyle(foodCards[0]).marginRight);
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