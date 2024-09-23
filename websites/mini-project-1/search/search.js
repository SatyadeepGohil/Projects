const xhr = new XMLHttpRequest();
let searchInput = document.getElementById('search');
const searchBtn = document.getElementById('searchbtn');
const foodContainer = document.getElementById('food-container');
const categoryContainer = document.getElementById('category-container');
const restaurantContainer = document.getElementById('restaurant-container');
const cartButton = document.getElementById('cart');
const closedButton = document.getElementById('cross');
let searchResults = document.getElementById('search-results');
const orderContainer = document.getElementById('order-container');
const orderItems = document.getElementById('order-items');
let orderMessage = document.getElementById('order-message');
let orderPara = document.getElementById('order-para');
let orders = [];
let data;


const address = localStorage.getItem('address');
let searchAddress = document.getElementById('top-address');
if (address) {searchAddress.innerText = address}

xhr.open('GET', 'restaurant.json', true);
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

  setupCategorySlider()

  const categoryItems = categoryContainer.querySelectorAll('.category-item');
  categoryItems.forEach(item => {
    item.addEventListener('click', () => {
      const categoryName = item.getAttribute('data-category');
      displayCategoryItems(categoryName);
    })
  })
}



function setupCategorySlider() {
  let categoryNext = document.getElementById('next');
  let categoryPrevious = document.getElementById('previous');
  let categoryDiv = document.getElementsByClassName('category-item');
  console.log(categoryDiv.length)

  let categoryDivWidth = categoryDiv[0].offsetWidth;
  console.log(categoryDivWidth)
  let categoryMarginRight = parseInt(getComputedStyle(categoryDiv[0]).marginRight);
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
      console.log(categoryCurrentIndex)
    }
  });

  categoryPrevious.addEventListener('click', () => {
    if (categoryCurrentIndex > 0) {
      categoryCurrentIndex--;
      slideCategories();
    }
  });
}

function renderCard(item, restaurant) {
  return `
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
      <button class="order" data-name="${item.name}" data-image="${item.image}" data-restaurant="${restaurant.name}" data-price="${item.price}">Order Now</button>
    </div>
  `;
}


function displayCategoryItems(categoryName) {
  if (!data) return;
  restaurantContainer.innerHTML = '';
  foodContainer.innerHTML = '';

  const foodHTML = data.restaurants.flatMap(restaurant => 
    restaurant.menu
      .filter(category => category.name === categoryName)
      .flatMap(category => 
        category.items.map(item => renderCard(item, restaurant))
      )
  ).join('');

  foodContainer.innerHTML = foodHTML || `<p>No items found in the ${categoryName} category</p>`;

  document.querySelectorAll('.order').forEach(button => {
    button.addEventListener('click', GetOrderDetails);
  })
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

function performSearch() {
  const search = searchInput.value.toLowerCase();
  if (!data) return;
  restaurantContainer.innerHTML = '';
  foodContainer.innerHTML = '';
  searchResults.innerHTML = '';

  if (!search) {
    foodContainer.innerHTML = '<p>Please enter a search term.</p>';
    return;
  }

  let restaurantHTML = '';
  let foodHTML = '';

  const matchedRestaurants = data.restaurants.filter(restaurant => restaurant.name.toLowerCase().includes(search));

  if (matchedRestaurants.length > 0) {

    restaurantHTML = matchedRestaurants.flatMap(restaurant => `
      <div id="restaurant-card">
            <h1>Restaurant Details</h1>
            <p>Name: ${restaurant.name}</p>
            <p>Location: ${restaurant.location}</p>
            <p>Contact: ${restaurant.contact.phone} | ${restaurant.contact.email}</p>
            <h3>Opening Hours</h3>
            <ul>
              <li>Monday: ${restaurant.openingHours.monday}</li>
              <li>Tuesday: ${restaurant.openingHours.tuesday}</li>
              <li>Wednesday: ${restaurant.openingHours.wednesday}</li>
              <li>Thursday: ${restaurant.openingHours.thursday}</li>
              <li>Friday: ${restaurant.openingHours.friday}</li>
              <li>Saturday: ${restaurant.openingHours.saturday}</li>
              <li>Sunday: ${restaurant.openingHours.sunday}</li>
            </ul>
    </div>`);


    foodHTML = matchedRestaurants.flatMap(restaurant => 
    restaurant.menu.flatMap(category => 
      category.items.map(item => renderCard(item, restaurant))
    )
  ).join('');

  } else {

    foodHTML = data.restaurants.flatMap(restaurant => 
    restaurant.menu.flatMap(category => 
      category.items
        .filter(item => item.name.toLowerCase().includes(search))
        .map(item => renderCard(item, restaurant))
    )
  ).join('');
  }
  restaurantContainer.innerHTML = restaurantHTML;
  foodContainer.innerHTML = foodHTML || '<p>No Food Items Found</p>';
  document.querySelectorAll('.order').forEach(button => {
    button.addEventListener('click', GetOrderDetails);
  })
}

function GetOrderDetails (event) {
  const button = event.target;
  const itemDetails = {
    name: button.getAttribute('data-name'),
    image: button.getAttribute('data-image'),
    price: button.getAttribute('data-price'),
    restaurant: button.getAttribute('data-restaurant'),
    quantity: 1
  }
  addToOrders(itemDetails);
}

function addToOrders(itemDetails) {
  const existingOrderIndex = orders.findIndex(order => order.name === itemDetails.name && order.restaurant === itemDetails.restaurant);

  if (existingOrderIndex !== -1) {
    orders[existingOrderIndex].quantity += 1;
    orderPara.innerText = `Your order for ${itemDetails.name} is placed`;
    orderMessage.style.height = '50px';
    setTimeout(() => {
      orderMessage.style.height = '0';
    },1500);
  }
  else {
    orders.push(itemDetails);
    orderPara.innerText = `Your order for ${itemDetails.name} is placed`;
    orderMessage.style.height = '50px';
    setTimeout(() => {
      orderMessage.style.height = '0';
    },1500);
  }
  displayOrderDetails();
}

function displayOrderDetails() {
  let orderHTML = '';
  let totalPrice = 0;


  orders.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;

    orderHTML += `
    <li>
      <p>${item.name}</p>
      <span>
          <p>$${item.price} x ${item.quantity}</p>
          <p>$${itemTotal.toFixed(2)}</p>
      <span/>
      <button onclick="removeOrder(${index})">&#10006;</button>
    </li>`;
  })

  orderItems.innerHTML = orderHTML;
  const totalElement = document.createElement('p');
  const hr = document.createElement('hr');
  totalElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
  totalElement.style.textAlign = 'right';
  totalElement.style.marginRight = '40px';
  orderItems.appendChild(hr);
  orderItems.appendChild(totalElement);

  if (orders.length > 0) {
    document.getElementById('no-food').textContent = '';
  }

  if (orders.length === 0) {
    totalElement.textContent = '';
    document.getElementById('no-food').textContent = 'No Food ordered yet';
  }
}

cartButton.addEventListener('click', () => {
   if (orderContainer.style.display === 'block') {
    orderContainer.style.display = 'none';
   }
   else {
    orderContainer.style.display = 'block';
    displayOrderDetails();
   }
})

closedButton.addEventListener('click', () => {
  orderContainer.style.display = 'none';
})

function removeOrder(index) {
  orders.splice(index, 1);
  displayOrderDetails();
}


function clearCart() {
  orders = [];
  document.getElementById('no-food').textContent = 'No Food ordered yet';
  displayCategoryItems();
}