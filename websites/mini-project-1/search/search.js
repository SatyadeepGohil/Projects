const xhr = new XMLHttpRequest();
let searchInput = document.getElementById('search');
const searchBtn = document.getElementById('searchbtn');
const container = document.getElementById('container');
let searchResults = document.getElementById('search-results');
let data;

  xhr.open('GET', '/search/restaurant.json', true);
xhr.onload = function() {
  if (xhr.status >= 200 && xhr.status < 300) {
    data = JSON.parse(xhr.responseText);
    console.log(data);
  } else {
    console.error('Error fetching data:', xhr.statusText);
  }
};
xhr.onerror = function() {
  console.error('Request failed');
};
xhr.send();


function autocompleteMatch (val) {
  if (val === '') return [];
  let reg = new RegExp(val, 'i');
  let  matches = [];


  data.restaurants.forEach(restaurant => {
    restaurant.menu.forEach(category => {
      category.items.forEach(item => {
        if (item.name.match(reg)) {
        matches.push(item.name);
        }
      })
    })
  })

  return matches;
}

function showresults (val) {
  searchResults.innerHTML = '';

  if (!val) return;
  let list = '';
  let terms = autocompleteMatch(val);
  for (let i = 0; i < terms.length; i++) {
    list += `<li>${terms[i]}</li>`;
  }
  searchResults.innerHTML = `<ul> ${list} </ul>`;

  const listItems = searchResults.querySelectorAll('li');
  listItems.forEach(item => {
    item.addEventListener('click', () => {
      searchInput.value = item.textContent;
      searchResults.innerHTML = '';
      performSearch();
    })
  })
}

searchBtn.addEventListener('click', performSearch);

searchInput.addEventListener('input', (event) => {
  showresults(event.target.value);
})

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    searchResults.innerHTML = '';
    performSearch();
  }
})


function performSearch() {
   const search = searchInput.value.toLowerCase();
  if (!data) return;
  container.innerHTML = "";
  searchResults.innerHTML = '';

  if (!search) {
    container.innerHTML = '<p>Please enter a search term.</p>';
    return;
  }

  const resultsHTML = data.restaurants.flatMap(restaurant => 
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
              <p class="food-price">$${item.price.toFixed(2)}</p>
              <button>Order Now</button>
            </div>
          `)
      )
    ).join('');


  container.innerHTML = resultsHTML || '<p>No Items Found</p>';
}
