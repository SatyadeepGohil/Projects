const button = document.getElementById('searchbtn');

button.addEventListener('click', () => {
  fetch('http://localhost:3000/data').then(response => response.json()).
  then(data => {
    const container = document.getElementById('container');
    const  search = document.getElementById('search').value.toLowerCase();
    const foodsdata = JSON.stringify(data);
    container.innerHTML = '';

    let resultsFound = false;

    data.restaurants.forEach(restaurant => {
      restaurant.menu.forEach(category => {
        category.items.forEach(item => {
          if (item.name.toLowerCase().includes(search)) {
            resultsFound = true;

            container.innerHTML += `
                <div class="card">
                  <img src="${item.image}" alt="${item.name}" class="card-img">
                  <h3>${item.name}</h3>
                  <span>
                    <img src="../images/small-location-icon.png" alt="">
                    <p>${restaurant.name}</p>
                  </span>
                  <p class="food-price">$${item.price.toFixed(2)}</p>
                  <button>Order Now</button>
                </div>`;

          }
        })
      })
    });

    if (!resultsFound) {
      container.innerHTML = `<p>No items found matching your search.</p>`;
    }
  })
})
