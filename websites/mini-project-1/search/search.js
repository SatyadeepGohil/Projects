const button = document.getElementById('searchbtn');

button.addEventListener('click', () => {
  fetch('http://localhost:3000/data').then(response => response.json()).
  then(data => {
    const container = document.getElementById('container');
    const  search = document.getElementById('search').value.toLowerCase();
    const foodsdata = JSON.stringify(data);
    container.innerHTML = '';

    data.restaurants.forEach(restaurant => {
      if (restaurant.name.toLowerCase().includes(search)) {
    let cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    let para = document.createElement('p');
    para.textContent = `Name: ${restaurant.name}`;
    
    cardDiv.appendChild(para);
    container.appendChild(cardDiv);
      }
    });
  })
})
