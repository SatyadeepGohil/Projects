const xhr = new XMLHttpRequest();
let searchInput = document.getElementById('search');
const searchBtn = document.getElementById('searchbtn');
const foodContainer = document.getElementById('food-container');
const categoryContainer = document.getElementById('category-container');
let searchResults = document.getElementById('search-results');
let data;

xhr.open('GET', '/search/restaurant.json', true);
xhr.onload = function() {
  if (xhr.status >= 200 && xhr.status < 300) {
    data = JSON.parse(xhr.responseText);
    categoryRender();
  } else {
    console.error('Error fetching data:', xhr.statusText);
  }
};
xhr.onerror = function() {
  console.error('Request failed');
};
xhr.send();

function categoryRender() {
  if (!data || !data.restaurants || data.restaurants.length === 0) return;

  let categoryHTML = '';
  let uniqueCategories = new Set();

  data.restaurants.forEach(restaurant => {
    restaurant.menu.forEach(category => {
      if (!uniqueCategories.has(category.name)) {
        uniqueCategories.add(category.name);
         categoryHTML += `
        <div class="category-item" data-category="${category.name}">
          <img src="${category.image}" alt="${category.name}" class="category-img">
          <p>${category.name}</p>
        </div>
      `;
      }
    });
  });

  categoryContainer.innerHTML = categoryHTML || '<p>No categories found</p>';

  const categoryItems = categoryContainer.querySelectorAll('.category-item');
  categoryItems.forEach(item => {
    item.addEventListener('click', () => {
      const categoryName = item.getAttribute('data-category');
      displayCategoryItems(categoryName);
    })
  })
}

document.addEventListener('DOMContentLoaded', () => {
  let categoryNext = document.getElementById('next');
  let categoryPrevious = document.getElementById('previous');
  let categoryDiv = document.getElementsByClassName('category-item');

  let categoryDivWidth = 100;
  console.log(categoryDivWidth)
  let categoryMarginRight = 20;
  let move = categoryDivWidth + categoryMarginRight;

  let categoryCurrentIndex = 0;

  function slideCategories() {
    for (let i = 0; i < categoryDiv.length; i++) {
      categoryDiv[i].style.transform = `translateX(${move * (categoryCurrentIndex * -1)}px)`;
    }
  }

  categoryNext.addEventListener('click', () => {
    if (categoryCurrentIndex < categoryDiv.length - 1) {
      categoryCurrentIndex++;
      slideCategories();
    }
  });

  categoryPrevious.addEventListener('click', () => {
    if (categoryCurrentIndex > 0) {
      categoryCurrentIndex--;
      slideCategories();
    }
  });
})




function displayCategoryItems(categoryName) {
  if (!data) return;
  foodContainer.innerHTML = '';

  const foodHTML = data.restaurants.flatMap(restaurant => 
    restaurant.menu
      .filter(category => category.name === categoryName)
      .flatMap(category => 
        category.items.map(item => `
          <div class="card">
            <img src="${item.image}" alt="${item.name}" class="card-img">
            <h3>${item.name}</h3>
            <span>
              <img src="../images/small-location-icon.png" alt="">
              <p>${restaurant.name}</p>
            </span>
            <p class="food-description">${item.description}</p>
            <p class="food-price">$${item.price.toFixed(2)}</p>
            <p class="food-availability">${item.available ? 'Available' : 'Not Available'}</p>
            <button>Order Now</button>
          </div>
        `)
      )
  ).join('');

  foodContainer.innerHTML = foodHTML || `<p>No items found in the ${categoryName} category</p>`;
}

function autocompleteMatch(val) {
  if (val === '') return [];
  let reg = new RegExp(val, 'i');
  let matches = [];

  data.restaurants.forEach(restaurant => {
    if (restaurant.name.match(reg)) {matches.push(restaurant.name)};
    restaurant.menu.forEach(category => {
      category.items.forEach(item => {
        if (item.name.match(reg)) {
          matches.push(item.name);
        }
      });
    });
  });

  return matches;
}

function showResults(val) {
  searchResults.innerHTML = '';

  if (!val) return;
  let list = '';
  let terms = autocompleteMatch(val);
  for (let i = 0; i < terms.length; i++) {
    list += `<li>${terms[i]}</li>`;
  }
  searchResults.innerHTML = `<ul>${list}</ul>`;

  const listItems = searchResults.querySelectorAll('li');
  listItems.forEach(item => {
    item.addEventListener('click', () => {
      searchInput.value = item.textContent;
      searchResults.innerHTML = '';
      performSearch();
    });
  });
}

searchBtn.addEventListener('click', performSearch);

searchInput.addEventListener('input', (event) => {
  showResults(event.target.value);
});

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    searchResults.innerHTML = '';
    performSearch();
  }
});

function performSearch() {
  const search = searchInput.value.toLowerCase();
  if (!data) return;
  foodContainer.innerHTML = '';
  searchResults.innerHTML = '';

  if (!search) {
    foodContainer.innerHTML = '<p>Please enter a search term.</p>';
    return;
  }

  let foodHTML = '';

  const matchedRestaurants = data.restaurants.filter(restaurant => restaurant.name.toLowerCase().includes(search));

  if (matchedRestaurants.length > 0) {

    foodHTML = matchedRestaurants.flatMap(restaurant => 
    restaurant.menu.flatMap(category => 
      category.items.map(item => `
          <div class="card">
            <img src="${item.image}" alt="${item.name}" class="card-img">
            <h3>${item.name}</h3>
            <span>
              <img src="../images/small-location-icon.png" alt="">
              <p>${restaurant.name}</p>
            </span>
            <p class="food-description">${item.description}</p>
            <p class="food-price">$${item.price.toFixed(2)}</p>
            <p class="food-availability">${item.available ? 'Available' : 'Not Available'}</p>
            <button>Order Now</button>
          </div>
        `)
    )
  ).join('');
  } else {

    foodHTML = data.restaurants.flatMap(restaurant => 
    restaurant.menu.flatMap(category => 
      category.items
        .filter(item => item.name.toLowerCase().includes(search))
        .map(item => `
          <div class="card">
            <img src="${item.image}" alt="${item.name}" class="card-img">
            <h3>${item.name}</h3>
            <span>
              <img src="../images/small-location-icon.png" alt="">
              <p>${restaurant.name}</p>
            </span>
            <p class="food-description">${item.description}</p>
            <p class="food-price">$${item.price.toFixed(2)}</p>
            <p class="food-availability">${item.available ? 'Available' : 'Not Available'}</p>
            <button>Order Now</button>
          </div>
        `)
    )
  ).join('');
  }

  foodContainer.innerHTML = foodHTML || '<p>No Food Items Found</p>';
}