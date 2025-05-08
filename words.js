const url = 'https://random-word-api.herokuapp.com/word';

fetch(url)
  .then(response => response.json())
  .then(data => {
    console.log('Random word:', data[0]); // API returns an array like ["apple"]
})
.catch(error => {
    console.error('Error fetching the word:', error);
});
