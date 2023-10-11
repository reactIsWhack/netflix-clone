import { posterIds } from "./movies.js";


export function renderMoviePreview(moviePreview) {
  const backdrop = 'https://image.tmdb.org/t/p/w185/' + moviePreview.backdrop_path;
  document.querySelector('.home-preview').style.backgroundImage = `url(${backdrop})`;
  document.querySelector('.title').innerText = moviePreview.title;
  document.querySelector('.release-year').innerText = getYear(moviePreview);
  document.querySelector('.rating').innerText = moviePreview.vote_average;
  const genreIdsList = moviePreview.genre_ids;
  let genres = '';

  genreIdsList.forEach(id => {
    for (let genreId in posterIds) {
      if (id === posterIds[genreId]) {
        genres += genreId += ', ';
      }
    }
  })
  const lastCommaIndex = genres.lastIndexOf(', ');
  genres = genres.substring(0, lastCommaIndex) + '';
  document.querySelector('.genres').innerText = genres;
  document.querySelector('.description').innerText = moviePreview.overview;
}

export async function renderTrendingMovies() {
  const trendingMovies = await getTrendsData();
  let trendsHTML = '';
  trendingMovies.results.forEach(movie => {
    checkTitleLength(movie); 
    trendsHTML += 
    `

    <div class="movie-preview-home">
      <div class="poster js-poster">
        <img src="${'https://image.tmdb.org/t/p/w185/' + movie.poster_path}">
      </div>
      <div class="info">
      <div class="movie-title">${movie.title}</div> 
      <div class="stats">
        <div class="rating"><img src="images/icons/star.svg" class="star"/> ${movie.vote_average}</div>
        <div class="release">${getYear(movie)}</div>
      </div>
    </div>
  </div>`
     
  })
  document.querySelector('.weekly-trending-movies').innerHTML = trendsHTML;
  document.querySelector('.main').classList.remove('js-movies-grid');
  document.querySelector('.main').classList.add('is-home')
}

export async function renderTopRatedMovies() {
  const data = await getTopRatedData();
  let topRatedHTML = '';
  data.results.forEach(topMovie => {
    checkTitleLength(topMovie)
    topRatedHTML += `
      <div class="movie-preview-home">
      <div class="poster js-poster">
        <img src="${'https://image.tmdb.org/t/p/w185/' + topMovie.poster_path}">
      </div>
      <div class="info">
      <div class="movie-title">${topMovie.title}</div> 
      <div class="stats">
        <div class="rating"><img src="images/icons/star.svg" class="star"/> ${topMovie.vote_average}</div>
        <div class="release">${getYear(topMovie)}</div>
      </div>
      </div>
      
      </div>
    `
  })
  document.querySelector('.top-rated-movies').innerHTML = topRatedHTML;
}

export async function renderUpcomingMovies() {
  const upcomingMoviesData = await getUpcomingMovies();
  let upcomingMovieHTML = '';
  upcomingMoviesData.results.forEach(upcomingMovie => {
    checkTitleLength(upcomingMovie);
    upcomingMovieHTML += `
    <div class="movie-preview-home">
    <div class="poster js-poster">
      <img src="${'https://image.tmdb.org/t/p/w185/' + upcomingMovie.poster_path}">
    </div>
    <div class="info">
    <div class="movie-title">${upcomingMovie.title}</div> 
    <div class="stats">
      <div class="rating"><img src="images/icons/star.svg" class="star"/> ${upcomingMovie.vote_average}</div>
      <div class="release">${getYear(upcomingMovie)}</div>
    </div>
    </div>
    
    </div>
  `
  })
  document.querySelector('.upcoming-movies').innerHTML = upcomingMovieHTML;
}
