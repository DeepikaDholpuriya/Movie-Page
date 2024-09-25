const apiKey = '5079ee10'; 
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const latestMovies = document.getElementById('latest-movies');
const movieDetails = document.getElementById('movie-details');
const detailsContent = document.getElementById('details-content');
const watchlistBtn = document.getElementById('watchlist-btn');
const watchlistDiv = document.getElementById('watchlist');
const watchlistContent = document.getElementById('watchlist-movies'); // Updated
const backToMainWatchlistBtn = document.getElementById('back-to-main-watchlist');
const subscriptionBtn = document.getElementById('subscription-btn');

let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

// Load Latest Movies
document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch(`https://www.omdbapi.com/?s=latest&apikey=${apiKey}`);
  const data = await response.json();
  if (data.Response === 'True') {
    displayMovies(data.Search);
  } else {
    latestMovies.innerHTML = '<p>No latest movies found.</p>';
  }
});

// Search Movies
searchBtn.addEventListener('click', async () => {
  const query = searchInput.value;
  if (!query) return;

  const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
  const data = await response.json();

  if (data.Response === 'true') {
    displayMovies(data.Search);
  } else {
    latestMovies.innerHTML = '<p>No movies found.</p>';
  }
});

// Display Movies in Grid
function displayMovies(movies) {
  latestMovies.innerHTML = movies
    .map(
      (movie) => 
    `<div class="movie-card" onclick="showMovieDetails('${movie.imdbID}')">
      <img src="${movie.Poster}" alt="${movie.Title}" />
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
    </div>`
    )
    .join('');
}

async function showMovieDetails(id) {
  const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`);
  const movie = await response.json();

  detailsContent.innerHTML = 
    `<div class="movie-image">
      <img src="${movie.Poster}" alt="${movie.Title}" />
    </div>
    <div class="details-info">
      <h2>${movie.Title} (${movie.Year})</h2>
      <p><strong>Director:</strong> ${movie.Director}</p>
      <p><strong>Cast:</strong> ${movie.Actors}</p>
      <p><strong>Plot:</strong> ${movie.Plot}</p>
      <p><strong>Trailer:</strong> <a href="https://www.youtube.com/results?search_query=${movie.Title} trailer" target="_blank">Watch on YouTube</a></p>
      <div class="buttons">
        <button onclick="addToWatchlist('${movie.imdbID}')">Add to Watchlist</button>
        <button onclick="closeDetails()">Back</button>
      </div>
    </div>`;

  // Force image animation to reset every time modal is opened
  const img = document.querySelector('.movie-image img');
  img.style.animation = 'none';  // Reset animation
  setTimeout(() => {
    img.style.animation = '';  // Reapply animation after a short delay
  }, 10);

  movieDetails.classList.remove('hidden');
}

// Close Movie Details Modal
function closeDetails() {
  movieDetails.classList.add('hidden');
}

// Add to Watchlist
function addToWatchlist(id) {
  if (!watchlist.includes(id)) {
    watchlist.push(id);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    alert('Movie added to watchlist!');
  } else {
    alert('Movie is already in your watchlist.');
  }
}

// Show Watchlist
watchlistBtn.addEventListener('click', () => {
  watchlistDiv.classList.remove('hidden');
  loadWatchlist();
});

// Load Watchlist Movies
async function loadWatchlist() {
  watchlistContent.innerHTML = '';
  for (let id of watchlist) {
    const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`);
    const movie = await response.json();
    watchlistContent.innerHTML += 
      `<div class="movie-card">
        <img src="${movie.Poster}" alt="${movie.Title}" />
        <h3>${movie.Title}</h3>
        <p>${movie.Year}</p>
        <button onclick="removeFromWatchlist('${id}')">Remove</button>
      </div>`;
  }
}

// Remove from Watchlist
function removeFromWatchlist(id) {
  watchlist = watchlist.filter(movieId => movieId !== id);
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
  loadWatchlist(); // Refresh the watchlist view
}

// Close Watchlist Modal
backToMainWatchlistBtn.addEventListener('click', () => {
  watchlistDiv.classList.add('hidden');
});

// Add Subscription Feature (can be expanded)
subscriptionBtn.addEventListener('click', () => {
  alert('Subscription feature coming soon!');
});
