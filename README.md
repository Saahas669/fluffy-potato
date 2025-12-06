# 🎬 Movie Recommender

A web application that recommends high-rated movies (8.0+) you haven't watched yet, displays detailed information, and tracks your watched movies using browser storage.

## Elevator Pitch

**Movie Recommender** solves the "what should I watch?" problem. With 200+ carefully curated movies rated 8.0+ on IMDb, the app intelligently recommends films you haven't seen yet with a single click. Click any movie to explore its plot, genres, runtime, and rating—then mark it as watched to keep track of what you've seen. Your watch history is saved in your browser, so your progress persists even after you close the app. No account needed, no ads, just great movie recommendations at your fingertips.

## Features

✨ **Smart Recommendations**: Get random suggestions from 200+ movies rated 8.0+ on IMDb
📋 **Watch Tracker**: Keep track of movies you've watched with ratings stored in browser localStorage
🎭 **Movie Details**: Click any movie to view full details including plot, genres, runtime, and year
🎨 **Beautiful UI**: Modern, responsive design that works on desktop and mobile
🖼️ **Movie Posters**: Displays poster images from TMDb API (or placeholder fallback)

## Project Structure

```
fluffy-potato/
├── app.py                 # Flask backend server
├── requirements.txt       # Python dependencies
├── data/
│   └── movies.json       # 200+ movies dataset with ratings
├── templates/
│   └── index.html        # HTML frontend
└── static/
    ├── style.css         # CSS styling
    └── main.js           # JavaScript logic
```

## Setup Instructions

### 1. Create Virtual Environment (Python 3.12)

```bash
# Navigate to project directory
cd fluffy-potato

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Get TMDb API Key (Optional)

To display real movie posters:
1. Go to [TMDb](https://www.themoviedb.org/settings/api)
2. Sign up and generate an API key
3. Open `static/main.js` and replace `YOUR_TMDB_API_KEY_HERE` with your actual key

Without an API key, the app will display placeholder icons instead of posters.

### 4. Run the Application

```bash
python app.py
```

The app will start on `http://localhost:5000`

## How to Use

1. **Get a Recommendation**: Click "Get Recommendation" to see a random unwatched movie (8.0+ rated)
2. **View Details**: Click on the movie card to open a modal with full information
3. **Mark as Watched**: Click "Mark as Watched" to add it to your watched list
4. **View Watched Movies**: Check the sidebar on the right to see all watched movies
5. **Remove from Watched**: Click the ✕ button on any watched movie to remove it
6. **Clear History**: Click "Clear History" to reset your entire watched list

## Features in Detail

### Movie Dataset
- 200 high-quality movies
- All rated 8.0 or higher on IMDb
- Includes details: title, rating, year, runtime, genres, and plot

### Data Persistence
- Watched movies are saved in browser's **localStorage**
- Data persists even after closing the browser
- Clear history anytime with one click

### Responsive Design
- Works perfectly on desktop, tablet, and mobile
- Adaptive layout that adjusts to screen size
- Smooth animations and transitions

## Technologies Used

- **Backend**: Flask (Python web framework)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Data Storage**: Browser localStorage, JSON dataset
- **API**: TMDb API for movie posters (optional)
- **Python Version**: 3.12+

## File Descriptions

| File | Purpose |
|------|---------|
| `app.py` | Flask server that serves the web application |
| `data/movies.json` | Database of 200+ movies with ratings and info |
| `templates/index.html` | Main HTML page structure |
| `static/style.css` | All styling and animations |
| `static/main.js` | Client-side logic (recommendations, tracking, UI) |
| `requirements.txt` | Python package dependencies |

## Code Explanation: main.js

The `main.js` file contains all the frontend logic for the movie recommender. Here's how it works:

### State Management
```javascript
let allMovies = [];           // All 200 movies from JSON
let watchedMovies = [];       // Movies you've marked as watched
let currentMovie = null;      // Currently displayed movie
```

### Core Functions

**1. Initialization**
- `init()` - Starts the app by loading movies, retrieving watched history, and displaying the first recommendation

**2. Data Loading**
- `loadMovies()` - Fetches all 200 movies from `/data/movies.json` via Flask
- `loadWatchedMovies()` - Retrieves your watched movies from browser localStorage
- `saveWatchedMovies()` - Persists watched movies to localStorage

**3. Movie Selection Logic**
- `getAvailableMovies()` - Filters movies that are:
  - Rated 8.0 or higher
  - NOT already in your watched list
- `getRandomMovie()` - Randomly selects one movie from available options

**4. UI Display Functions**
- `displayRecommendation()` - Shows the selected movie with:
  - Movie title, rating, year, and runtime
  - Poster image (from TMDb API if key provided, else placeholder)
  - "Mark as Watched" and "Get Another" buttons
  
- `showMovieDetails()` - Opens a modal popup displaying:
  - Full movie poster
  - Complete plot summary
  - All genres, runtime, and year
  - Rating

**5. User Interaction**
- `markAsWatched()` - Adds current movie to watched list and loads next recommendation
- `removeFromWatched(index)` - Removes a movie from your watched history
- `clearHistory()` - Wipes all watched movies with confirmation
- `updateWatchedUI()` - Updates the sidebar to show all watched movies and count

**6. Poster Fetching**
- `getPosterImage(imdbId)` - Attempts to fetch real poster from TMDb API
  - Falls back to placeholder (🎬) if API key missing or request fails
  - Uses IMDb ID stored in movie data to query TMDb

**7. Event Listeners**
- Connected to buttons for recommendations, marking watched, and clearing history
- Modal can be closed by clicking X, pressing Escape, or clicking background
- Movie card is clickable to open full details

### Data Flow
1. App loads all movies from JSON file
2. App loads your watched movies from localStorage
3. Available movies are filtered (8.0+ rating, not watched)
4. Random movie is selected and displayed
5. When you click "Mark as Watched":
   - Movie is added to watched array
   - Watched array is saved to localStorage
   - New recommendation is displayed
6. Your watched list persists even after closing the browser!

## Key JavaScript Functions

- `displayRecommendation()`: Shows a random unwatched 8.0+ movie
- `markAsWatched()`: Adds current movie to watched list
- `getAvailableMovies()`: Filters unwatched 8.0+ movies
- `updateWatchedUI()`: Refreshes the watched movies display
- `showMovieDetails()`: Opens modal with full movie information
- `getPosterImage()`: Fetches posters from TMDb API

## Notes

- All movie data is stored locally in `data/movies.json`
- Watched movies are stored in browser localStorage (not synced across devices)
- TMDb API is optional - the app works without it but won't show real posters
- No backend database required - everything runs client-side!

## Future Enhancements

- Add user accounts to sync watched movies across devices
- Implement genre filtering
- Add search functionality
- Include IMDb top 250 movies
- Add rating/reviewing functionality

## License

Feel free to use and modify this project as you wish!

