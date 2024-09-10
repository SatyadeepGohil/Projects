const { response } = require("express");

fetch('http://localhost:3000/data')
  .then(response => response.json())
  .then(data => {
    console.log(data);  // Output the JSON data
  })
  .catch(error => {
    console.error('Error fetching the JSON data:', error);
  });
