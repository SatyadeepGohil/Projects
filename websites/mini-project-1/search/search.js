const xhr = new XMLHttpRequest();
const search = document.getElementById('search').value.toLowerCase();
const searchBtn = document.getElementById('searchbtn');
const container = document.getElementById('container');

xhr.open('GET', '/search/restaurant.json', true);
xhr.onload = function() {
  if (xhr.status >= 200 && xhr.status < 300) {
     const data = JSON.parse(xhr.responseText);
    // Process the JSON data
    console.log(data);
  } else {
    console.error('Error fetching data:', xhr.statusText);
  }
};
xhr.onerror = function() {
  console.error('Request failed');
};
xhr.send();

