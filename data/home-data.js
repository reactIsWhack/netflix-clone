let homeHTML = `
  <div class="home-container">
    <div class="section">Weekly Trending Movies</div>
    <div class="weekly-trending-movies"></div>
  </div>
  <div class="home-container">
    <div class="section">Top Rated Movies</div>
  </div>
`;

window.addEventListener('load', () => {
  renderTrendingMovies();
  
document.querySelector('.main').innerHTML = homeHTML;
})

async function getTrendsData() {
  const response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?language=en-US`, options);
  const trendsData = await response.json();
  return trendsData;
  
}

document.querySelector('.js-logo').addEventListener('click', () => {
  renderTrendingMovies();
  document.querySelector('.main').innerHTML = homeHTML;
})

export async function renderTrendingMovies() {
  const trendingMovies = await getTrendsData();
  let trendsHTML = '';
  trendingMovies.results.forEach(movie => {
    console.log(baseUrl + movie.poster_path)
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
        <div class="release"></div>
      </div>
      </div>
      
      </div>`
     
  })
  document.querySelector('.weekly-trending-movies').innerHTML = trendsHTML;
  document.querySelector('.main').classList.remove('js-movies-grid');
  console.log(document.querySelector('.main'))
}