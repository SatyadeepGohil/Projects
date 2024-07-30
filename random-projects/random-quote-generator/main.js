const category = ['love', 'happiness', 'art', 'beauty', 'death', 'dating', 'marriage', 'hope', 'courage', 'anger'];

function randomIndexOfArray() {
    const randomIndex = Math.floor(Math.random() * category.length);
    return category[randomIndex];
}

$(document).ready(function() {
  function createQuoteCard() {
    const cardId = 'quote-generator-' + $('.quote-generator').length;
    const quoteCard = `
    <div class="quote-generator" id="${cardId}">
      <p class="quote">Want some Inspiration</p>
      <p class="author">Author Name</p>
      <button class="btn-el">Generate</button>
    </div>`;
    $('#quote-container').append(quoteCard); // Append to correct container

    $('#' + cardId + ' .btn-el').click(function() {
      $.ajax({
        method: 'GET',
        url: 'https://api.api-ninjas.com/v1/quotes?category=' + randomIndexOfArray(),
        headers: { 'X-Api-key': 'hYvhlakb/sNP2K+Sj+hk6Q==S36RxeN1u39dgbm2'},
        contentType: 'application/json',
        success: function(result) {
          $('#' + cardId + ' .quote').text(result[0].quote);
          $('#' + cardId + ' .author').text('by ' + result[0].author);
        },
        error: function ajaxError(jqXHR) {
          console.error('Error: ', jqXHR.responseText);
        }
      });
    });
  }

  createQuoteCard(); // Create initial quote card
  $('#add-quote-btn').click(function() {
    createQuoteCard(); // Add more quote cards when the button is clicked
  });
});
