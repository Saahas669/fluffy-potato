// Your free TMDb API Key (you need to get one from https://www.themoviedb.org/settings/api)
const TMDB_API_KEY = 'YOUR_TMDB_API_KEY_HERE'; // Replace with your actual API key
const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

// DOM Elements
const movieCard = document.getElementById('movieCard');
const posterContainer = document.getElementById('posterContainer');
const movieTitle = document.getElementById('movieTitle');
const movieRating = document.getElementById('movieRating');
const yearRuntime = document.getElementById('yearRuntime');
const recommendBtn = document.getElementById('recommendBtn');
const markWatchedBtn = document.getElementById('markWatchedBtn');
const watchedList = document.getElementById('watchedList');
const watchedCount = document.getElementById('watchedCount');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const detailsModal = document.getElementById('detailsModal');
const closeModal = document.querySelector('.close');

// Modal Elements
const modalTitle = document.getElementById('modalTitle');
const modalRating = document.getElementById('modalRating');
const modalYear = document.getElementById('modalYear');
const modalRuntime = document.getElementById('modalRuntime');
const modalGenre = document.getElementById('modalGenre');
const modalPlot = document.getElementById('modalPlot');
const modalPoster = document.getElementById('modalPoster');

// State
let allMovies = [];
let watchedMovies = [];
let currentMovie = null;

// LocalStorage Keys
const WATCHED_KEY = 'watched_movies';

// Initialize app
async function init() {
    await loadMovies();
    loadWatchedMovies();
    if (allMovies.length > 0) {
        displayRecommendation();
    } else {
        posterContainer.innerHTML = '<p>Error: Could not load movies database</p>';
    }
    setupEventListeners();
}

// Load movies from JSON file
async function loadMovies() {
    try {
        const response = await fetch('/data/movies.json');
        allMovies = await response.json();
    } catch (error) {
        console.error('Error loading movies:', error);
        posterContainer.innerHTML = '<p>Error loading movies</p>';
    }
}

// Load watched movies from localStorage
function loadWatchedMovies() {
    const stored = localStorage.getItem(WATCHED_KEY);
    watchedMovies = stored ? JSON.parse(stored) : [];
    updateWatchedUI();
}

// Save watched movies to localStorage
function saveWatchedMovies() {
    localStorage.setItem(WATCHED_KEY, JSON.stringify(watchedMovies));
    updateWatchedUI();
}

// Get unwatched movies with 8.0+ rating
function getAvailableMovies() {
    return allMovies.filter(movie => 
        movie.rating >= 8.0 && !watchedMovies.some(w => w.id === movie.id)
    );
}

// Get random movie from available movies
function getRandomMovie() {
    const available = getAvailableMovies();
    if (available.length === 0) {
        return null;
    }
    return available[Math.floor(Math.random() * available.length)];
}

// Get poster image from TMDb
async function getPosterImage(imdbId) {
    if (!TMDB_API_KEY || TMDB_API_KEY === 'YOUR_TMDB_API_KEY_HERE') {
        // If no API key, use placeholder
        return '/static/placeholder.png';
    }
    
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`
        );
        const data = await response.json();
        
        if (data.movie_results && data.movie_results.length > 0) {
            const posterPath = data.movie_results[0].poster_path;
            if (posterPath) {
                return TMDB_IMAGE_URL + posterPath;
            }
        }
    } catch (error) {
        console.error('Error fetching poster:', error);
    }
    
    return '/static/placeholder.png';
}

// Display movie recommendation
async function displayRecommendation() {
    currentMovie = getRandomMovie();
    
    if (!currentMovie) {
        posterContainer.innerHTML = '<p>No more movies to recommend! All 8.0+ rated movies have been watched. 🎉</p>';
        movieTitle.textContent = 'All Done!';
        movieRating.textContent = 'N/A';
        yearRuntime.textContent = '';
        recommendBtn.textContent = 'No More Movies';
        markWatchedBtn.style.display = 'none';
        return;
    }
    
    // Display basic info
    movieTitle.textContent = currentMovie.title;
    movieRating.textContent = currentMovie.rating;
    yearRuntime.textContent = `${currentMovie.year} • ${currentMovie.runtime} min`;
    
    // Load poster
    posterContainer.innerHTML = '<div class="loading">Loading poster...</div>';
    const posterUrl = await getPosterImage(currentMovie.poster);
    
    if (posterUrl) {
        const img = document.createElement('img');
        img.src = posterUrl;
        img.alt = currentMovie.title;
        img.onerror = () => {
            posterContainer.innerHTML = '<div style="font-size: 3rem;">🎬</div>';
        };
        posterContainer.innerHTML = '';
        posterContainer.appendChild(img);
    } else {
        posterContainer.innerHTML = '<div style="font-size: 3rem;">🎬</div>';
    }
    
    markWatchedBtn.style.display = 'block';
    recommendBtn.textContent = 'Get Another';
}

// Mark current movie as watched
function markAsWatched() {
    if (currentMovie && !watchedMovies.some(m => m.id === currentMovie.id)) {
        watchedMovies.push({
            id: currentMovie.id,
            title: currentMovie.title,
            rating: currentMovie.rating
        });
        saveWatchedMovies();
        displayRecommendation();
    }
}

// Update watched movies UI
function updateWatchedUI() {
    watchedCount.textContent = watchedMovies.length;
    
    if (watchedMovies.length === 0) {
        watchedList.innerHTML = '<p class="empty-state">No movies watched yet</p>';
        clearHistoryBtn.style.display = 'none';
    } else {
        watchedList.innerHTML = watchedMovies.map((movie, index) => `
            <div class="watched-item">
                <div>
                    <div class="watched-item-title">${movie.title}</div>
                    <div class="watched-item-rating">⭐ ${movie.rating}</div>
                </div>
                <button class="remove-btn" onclick="removeFromWatched(${index})">✕</button>
            </div>
        `).join('');
        clearHistoryBtn.style.display = 'block';
    }
}

// Remove movie from watched list
function removeFromWatched(index) {
    watchedMovies.splice(index, 1);
    saveWatchedMovies();
    displayRecommendation();
}

// Show movie details in modal
function showMovieDetails() {
    if (!currentMovie) return;
    
    modalTitle.textContent = currentMovie.title;
    modalRating.textContent = currentMovie.rating;
    modalYear.textContent = currentMovie.year;
    modalRuntime.textContent = currentMovie.runtime;
    modalGenre.textContent = currentMovie.genres.join(', ');
    modalPlot.textContent = currentMovie.plot;
    
    // Load poster in modal
    getPosterImage(currentMovie.poster).then(posterUrl => {
        if (posterUrl && posterUrl !== '/static/placeholder.png') {
            const img = document.createElement('img');
            img.src = posterUrl;
            img.alt = currentMovie.title;
            img.onerror = () => {
                modalPoster.innerHTML = '<div style="font-size: 3rem;">🎬</div>';
            };
            modalPoster.innerHTML = '';
            modalPoster.appendChild(img);
        } else {
            modalPoster.innerHTML = '<div style="font-size: 3rem;">🎬</div>';
        }
    });
    
    detailsModal.classList.remove('hidden');
}

// Close modal
function closeDetailsModal() {
    detailsModal.classList.add('hidden');
}

// Clear all watched movies
function clearHistory() {
    if (confirm('Are you sure you want to clear all watched movies?')) {
        watchedMovies = [];
        saveWatchedMovies();
        displayRecommendation();
    }
}

// Setup event listeners
function setupEventListeners() {
    recommendBtn.addEventListener('click', displayRecommendation);
    markWatchedBtn.addEventListener('click', markAsWatched);
    clearHistoryBtn.addEventListener('click', clearHistory);
    movieCard.addEventListener('click', showMovieDetails);
    closeModal.addEventListener('click', closeDetailsModal);
    
    // Close modal on background click
    detailsModal.addEventListener('click', (e) => {
        if (e.target === detailsModal) {
            closeDetailsModal();
        }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeDetailsModal();
        }
    });
}

// Start the app
init();
