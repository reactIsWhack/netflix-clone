import { posterIds } from "./movies.js";
import { checkTitleLength } from "./utils/title.js";
import { getYear } from "./utils/year.js";
import { checkCommas } from "./utils/commas.js";
import { checkDescription } from "./utils/description.js";
import { key } from "./config.js";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZDQ3M2I4YThiMTgxODVlNDQ1NGRkNmVlZWIwYzkwYiIsInN1YiI6IjY0Yzk1ODZlMGNiMzM1MDBjNTY4NmFlNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8LoFYRsiiqu9Wjdn8FFe_YCoQdx_P5iX7A692BPxNns",
  },
};
let html = "";
let pageCount = 1;
let updatedHTML = "";
let movies = JSON.parse(localStorage.getItem("movies")) || [];
let actorsArray = [];
let actorsStr = "";
let lessActorsStr = "";
let homeHTML = `
  <div class="home-preview">
    <div class="movie-info">
      <div class="title"></div>
      <div class="movie-stats">
        <div class="release-year"></div>
        <div class="rating"></div>
      </div>
      <div class="genres"></div>
      <div class="description"></div>
      <div class="js-watch-button watch-container">
      </div>
      <div class="movies-scrollbar"></div>
    </div>
  </div>
  <div class="home-container">
    <div class="section">Weekly Trending Movies</div>
    <div class="weekly-trending-movies"></div>
  </div>
  <div class="home-container">
    <div class="section">Top Rated Movies</div>
    <div class="top-rated-movies"></div>
  </div>
  <div class="home-container">
    <div class="section">Upcoming Movies</div>
    <div class="upcoming-movies"></div>
  </div>
`;

export async function getData(id) {
  document.querySelector(".main").classList.add("js-movies-grid");
  document.querySelector(".main").classList.remove("is-home");
  const response =
    await fetch(`https://api.themoviedb.org/3/discover/movie/?api_key=${key}&language=en-US&page=1&with_genres=${id}
  `);
  const data = await response.json();
  data.results = data.results.filter(function (result) {
    return result.poster_path !== null;
  });
  const resultsProperty = data.results;

  resultsProperty.forEach((result) => {
    checkTitleLength(result);
    const poster = "https://image.tmdb.org/t/p/w185/" + result.poster_path;
    html += `
    <div class="movie-preview">
      <div class="poster js-poster" data-movie-id="${result.id}">
        <img src="${poster}">
      </div>
      <div class="movie-title">${result.title}</div> 
      <div class="stats">
        <div class="rating"><img src="images/icons/star.svg" class="star"/> ${
          result.vote_average
        }</div>
        <div class="release">${getYear(result)}</div>
      </div>
    </div>`;
  });
  updatedHTML = html;
  let genreTitle = "";
  for (let genre in posterIds) {
    if (id === posterIds[genre]) {
      genreTitle = genre;
    }
  }
  genreTitle = genreTitle[0].toLocaleUpperCase() + genreTitle.slice(1);
  document.querySelector(
    ".js-genre-title"
  ).innerHTML = `All ${genreTitle} Movies`;

  document.querySelector(".js-movies-grid").innerHTML = updatedHTML;
  const btnContainer = document.createElement("div");
  const btn = document.createElement("button");
  btn.innerHTML = "Load More";
  btnContainer.classList.add("load-button");
  btn.classList.add("js-load-button");
  btnContainer.append(btn);
  document.querySelector(".js-movies-grid").append(btnContainer);

  async function loadMoreMovies() {
    pageCount++;
    const loadResponse = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${key}&language=en-US&&page=${pageCount}&with_genres=${id}`
    );
    const newMovieData = await loadResponse.json();
    const imgBase = "https://image.tmdb.org/t/p/w185/";
    newMovieData.results.forEach((newMovie) => {
      updatedHTML += ` 
      <div class="movie-preview">

      <div class="poster js-poster" data-movie-id=${newMovie.id}>
        <img class="js-movie-poster" src="${
          imgBase + newMovie.poster_path
        }" data-movie-id="${newMovie.id}">
      </div>
      <div class="movie-title">${newMovie.title}</div> 
      <div class="stats">
        <div class="rating"><img src="images/icons/star.svg" class="star"/> ${
          newMovie.vote_average
        }</div>
        <div class="release">${getYear(newMovie)}</div>
      </div>
      </div>`;
    });

    document.querySelector(".js-movies-grid").innerHTML = updatedHTML;
    document.querySelector(".js-movies-grid").append(btnContainer);

    document.querySelectorAll(".js-movie-poster").forEach((poster) => {
      poster.addEventListener("click", () => {
        getFullMoviePrevData(newMovieData, poster);
      });
    });
  }
  document.querySelector(".js-load-button").addEventListener("click", () => {
    loadMoreMovies();
  });

  document.querySelectorAll(".js-poster").forEach((poster) => {
    poster.addEventListener("click", () => {
      getFullMoviePrevData(data, poster);
    });
  });
  html = "";
  pageCount = 1;
}

async function getTrendsData() {
  const response = await fetch(
    `https://api.themoviedb.org/3/trending/movie/day?language=en-US`,
    options
  );
  const trendsData = await response.json();
  return trendsData;
}

document.querySelector(".js-logo").addEventListener("click", () => {
  renderTrendingMovies();
  renderTopRatedMovies();
  renderUpcomingMovies();
  showMoviePreviews();
  document.querySelector(".main").innerHTML = homeHTML;
  document.querySelector(".js-genre-title").innerHTML = "";
  renderMoviePreview(movies[0]);
});

async function showMoviePreviews() {
  // movies scrollbar
  const response = await fetch(
    "https://api.themoviedb.org/3/discover/movie?language=en&page=1",
    options
  );
  const data = await response.json();
  let scrollbarHTML = "";
  data.results.forEach((moviePreview) => {
    movies.push(moviePreview);
    localStorage.setItem("movies", JSON.stringify(movies));
    const posters =
      "https://image.tmdb.org/t/p/w185/" + moviePreview.poster_path;

    scrollbarHTML += `
      <div class="poster-container">
        <img id="js-poster-home" src="${posters}" data-movie-id="${moviePreview.id}"/>
      </div>
    `;
    return;
  });
  document.querySelector(".movies-scrollbar").innerHTML = scrollbarHTML;
  function changeMoviePreviews(img) {
    const movieId = Number(img.dataset.movieId);
    const previewedMovie = movies.find((movie) => movie.id === movieId);
    renderMoviePreview(previewedMovie);
  }

  document.body.addEventListener("click", (e) => {
    if (e.target.id === "js-poster-home") {
      changeMoviePreviews(e.target);
    } else if (e.target.id === "js-watch") {
      getFullMoviePrevData(data, e.target);
    }
  });
}

function renderMoviePreview(moviePreview) {
  console.log(moviePreview[0]);
  console.log("ran");
  const backdrop =
    "https://image.tmdb.org/t/p/w1280/" + moviePreview.backdrop_path;
  document.querySelector(
    ".home-preview"
  ).style.background = `linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4 )), url(${backdrop})
`;
  document.querySelector(".title").innerText = moviePreview.title;
  document.querySelector(".release-year").innerText = getYear(moviePreview);
  document.querySelector(".rating").innerText = moviePreview.vote_average;
  const genreIdsList = moviePreview.genre_ids;
  let genres = "";

  genreIdsList.forEach((id) => {
    for (let genreId in posterIds) {
      if (id === posterIds[genreId]) {
        genres += genreId += ", ";
      }
    }
  });
  genres = checkCommas(genres);
  document.querySelector(".genres").innerText = genres;
  checkDescription(moviePreview);
  document.querySelector(".description").innerText = moviePreview.overview;
  document.querySelector(
    ".js-watch-button"
  ).innerHTML = `        <img class="play-icon" src=images/icons/play.svg>
  <button id="js-watch" data-movie-id="${moviePreview.id}">Watch Now</button>`;
}

async function getFullMoviePrevData(info, movie) {
  const id = Number(movie.dataset.movieId);
  const fullPreviewedMovie = info.results.find((result) => result.id === id);
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${fullPreviewedMovie.id}?api_key=${key}`
  );
  const detailsData = await response.json();
  const ratingResponse = await fetch(
    `https://api.themoviedb.org/3/movie/${fullPreviewedMovie.id}?api_key=${key}&language=en-US&append_to_response=release_dates  `
  );
  const ratingData = await ratingResponse.json();
  const actorsResponse =
    await fetch(`https://api.themoviedb.org/3/movie/${fullPreviewedMovie.id}/credits?language=en-US&api_key=${key}
  `);

  const rolesData = await actorsResponse.json();
  const trailersResponse = await fetch(
    `https://api.themoviedb.org/3/movie/${fullPreviewedMovie.id}/videos?language=en-US&api_key=${key}`
  );
  const trailersData = await trailersResponse.json();
  pageCount = 1;
  let links = [];
  trailersData.results.forEach((trailer) => {
    const link = `https://www.${trailer.site}.com/embed/${trailer.key}`;
    links.push(link);
  });
  const directorsArray = rolesData.crew.filter(({ job }) => job === "Director");
  let directors = "";
  directorsArray.forEach((director) => {
    directors += director.name += ", ";
  });
  directors = checkCommas(directors);

  let rating;
  ratingData.release_dates.results.forEach((result) => {
    if (result.iso_3166_1 === "US") {
      const usRating = result;
      rating = usRating.release_dates[0].certification;
    }
  });

  let genres = "";
  detailsData.genres.forEach((genre) => {
    genres += genre.name += ", ";
  });
  genres = checkCommas(genres);

  let actors = "";
  rolesData.cast.forEach((actor) => {
    actorsArray.push(actor.name);
    actors += actor.name += ", ";
  });
  actors = checkCommas(actors);
  actorsStr = actors;

  let newAcotrsStr = "";

  if (actorsArray.length > 18) {
    const newActors = actorsArray.slice(0, 14);
    newActors.forEach((newActor) => {
      newAcotrsStr += newActor += ", ";
    });
    newAcotrsStr = checkCommas(newAcotrsStr);
    lessActorsStr = newAcotrsStr;
    renderFullMoviePrev(
      fullPreviewedMovie,
      detailsData,
      newAcotrsStr,
      directors,
      rating,
      genres,
      links
    );
  } else {
    renderFullMoviePrev(
      fullPreviewedMovie,
      detailsData,
      actors,
      directors,
      rating,
      genres,
      links
    );
  }
}

window.addEventListener("load", () => {
  renderTrendingMovies();
  renderTopRatedMovies();
  renderUpcomingMovies();
  showMoviePreviews();
  document.querySelector(".main").innerHTML = homeHTML;
  renderMoviePreview(movies[0]);
});

async function renderFullMoviePrev(
  moviePrev,
  details,
  actorsList,
  directorsList,
  ratings,
  genresList,
  trailers
) {
  const poster = "https://image.tmdb.org/t/p/w185/" + moviePrev.poster_path;
  const backdrop =
    "https://image.tmdb.org/t/p/w1280/" + moviePrev.backdrop_path;
  const reccomendedMoviesHTML = await renderRecommendedMovies();
  const trailersContainer = document.createElement("div");
  let i = 0;
  if (trailers.length <= 20) {
    while (i < trailers.length) {
      const iframe = document.createElement("iframe");
      iframe.src = trailers[i];
      trailersContainer.append(iframe);
      i++;
    }
  } else {
    while (i <= 20) {
      const iframe = document.createElement("iframe");
      iframe.src = trailers[i];
      trailersContainer.append(iframe);
      i++;
    }
  }
  let fullMoviePreviewHTML = "";
  fullMoviePreviewHTML = `
    <div class="full-movie-preview">
      <a href="${
        details.homepage
      }" target="_blank"><div class="poster-container">
      <img class="js-poster" src="${poster}" onclick="if (${
    details.homepage === ""
  }) {
        alert('Sorry, movie site cannot be reached')
      }
        "/>
    </div></a>
      
      <div class="info-container" id="info">
        <div class="title">${details.title}</div>
        <div class="full-movie-stats">
          <div class="rating">
            <img src="images/icons/star.svg" class="star"/>
            ${moviePrev.vote_average}
          </div>
          <div class="dot">&#8226</div>
          <div class="runtime">${details.runtime}m</div>
          <div class="dot">&#8226</div>
          <div class="release">${getYear(moviePrev)}</div>
          <div class="mpaa">${ratings}</div>
        </div>
        <div class="genres-list">${genresList}</div>
        <div class="movie-overview">${details.overview}</div>
        <div class="actors">
          <div class="label">Starring</div>
          <div class="actors-list">${actorsList} <span id="js-more-link">more...</span></div>
        </div>
        <div class="directors">
          <div class="label">Directed By</div>
          <div class="directors-list">${directorsList}</div>
        </div>
        <div class="trailers-header">Trailers and Clips</div>
        <div class="js-trailers">${trailersContainer.innerHTML}</div>
      </div>
    </div>
  `;

  if (actorsArray.length < 14) {
    document.querySelector(".js-more-link").innerHTML = "";
    document.querySelector(".js-less-link").innerHTML = "";
  } else {
    document.body.addEventListener("click", (e) => {
      if (e.target.id === "js-more-link") {
        document.querySelector(
          ".actors-list"
        ).innerHTML = `${actorsStr} <span id="js-less-link">less...</span>`;
      } else if (e.target.id === "js-less-link") {
        document.querySelector(
          ".actors-list"
        ).innerHTML = `${lessActorsStr} <span id="js-more-link">more..</span>`;
      }
    });
  }
  const headerElement = document.createElement("div");
  headerElement.innerHTML = "You May Also Like";
  document.querySelector(
    ".full-movie-previews"
  ).innerHTML = `${fullMoviePreviewHTML}  
  `;
  const div = document.createElement("div");
  div.innerHTML = reccomendedMoviesHTML;
  div.classList.add("recommended-movies-container");
  document.querySelector(".full-movie-previews").append(headerElement);
  headerElement.classList.add("js-header");
  document.querySelector(".full-movie-previews").append(div);
  document.querySelector(".js-genre-title").innerHTML = "";
  document.querySelector(".main").classList.remove("js-movies-grid");
  document.querySelector(".main").classList.add("is-on-preview");
  document.querySelector(
    ".full-movie-preview"
  ).style.background = `linear-gradient( rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6 )), url(${backdrop})
  `;
  document.querySelector(".full-movie-preview").style.backgroundRepeat =
    "no-repeat";
  document.querySelector(".full-movie-preview").style.backgroundSize = "cover";
}

async function getRecommendedMovies() {
  const response = await fetch(
    `https://api.themoviedb.org/4/account/64c9586e0cb33500c5686ae5/movie/recommendations?page=1&language=en-US`,
    options
  );
  const data = await response.json();
  return data;
}

async function renderRecommendedMovies() {
  const reccomendedMovies = await getRecommendedMovies();
  let reccomendedMoviesHTML = "";
  reccomendedMovies.results.forEach((movie) => {
    checkTitleLength(movie);
    reccomendedMoviesHTML += `
    <div class="recommended-movies">
      <div class="poster js-poster">
        <img data-movie-id=${movie.id} id="js-poster" src="${
      "https://image.tmdb.org/t/p/w185/" + movie.poster_path
    }">
      </div>
        <div class="info">
          <div class="movie-title">${movie.title}</div> 
          <div class="stats">
            <div class="rating"><img src="images/icons/star.svg" class="star"/> ${
              movie.vote_average
            }</div>
            <div class="release">${getYear(movie)}</div>
        </div>
      </div>
    </div>
    `;
  });
  document.body.addEventListener("click", (e) => {
    if (e.target.id === "js-poster") {
      getFullMoviePrevData(reccomendedMovies, e.target);
    }
  });
  return reccomendedMoviesHTML;
}

async function renderTrendingMovies() {
  const trendingMovies = await getTrendsData();
  let trendsHTML = "";
  trendingMovies.results.forEach((movie) => {
    checkTitleLength(movie);
    trendsHTML += `
 
      <div class="movie-preview-home">
      <div class="poster js-poster">
        <img data-movie-id=${movie.id} class="movie-poster" src="${
      "https://image.tmdb.org/t/p/w185/" + movie.poster_path
    }">
      </div>
      <div class="info">
        <div class="movie-title">${movie.title}</div> 
        <div class="stats">
        <div class="rating"><img src="images/icons/star.svg" class="star"/> ${
          movie.vote_average
        }</div>
        <div class="release">${getYear(movie)}</div>
      </div>
        </div>
      </div>
    `;
  });
  document.querySelector(".weekly-trending-movies").innerHTML = trendsHTML;
  document.querySelector(".main").classList.remove("js-movies-grid");
  document.querySelector(".main").classList.add("is-home");
  document.querySelectorAll(".movie-poster").forEach((poster) => {
    poster.addEventListener("click", () => {
      getFullMoviePrevData(trendingMovies, poster);
    });
  });
}

async function getTopRatedData() {
  const response = await fetch(
    "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
    options
  );
  const ratedData = await response.json();
  return ratedData;
}

async function renderTopRatedMovies() {
  const data = await getTopRatedData();
  let topRatedHTML = "";
  data.results.forEach((topMovie) => {
    checkTitleLength(topMovie);
    topRatedHTML += `
      <div class="movie-preview-home">
      <div class="poster js-poster">
        <img class="js-poster" data-movie-id=${topMovie.id} src="${
      "https://image.tmdb.org/t/p/w185/" + topMovie.poster_path
    }">
      </div>
      <div class="info">
      <div class="movie-title">${topMovie.title}</div> 
      <div class="stats">
        <div class="rating"><img src="images/icons/star.svg" class="star"/> ${
          topMovie.vote_average
        }</div>
        <div class="release">${getYear(topMovie)}</div>
      </div>
      </div>
      
      </div>
    `;
  });
  document.querySelector(".top-rated-movies").innerHTML = topRatedHTML;
  document.querySelectorAll(".js-poster").forEach((poster) => {
    poster.addEventListener("click", () => {
      getFullMoviePrevData(data, poster);
    });
  });
}

async function getUpcomingMovies() {
  const response = await fetch(
    "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1",
    options
  );
  const data = await response.json();
  return data;
}

async function renderUpcomingMovies() {
  const upcomingMoviesData = await getUpcomingMovies();
  let upcomingMovieHTML = "";
  upcomingMoviesData.results.forEach((upcomingMovie) => {
    checkTitleLength(upcomingMovie);
    upcomingMovieHTML += `
    <div class="movie-preview-home">
    <div class="poster js-poster">
      <img data-movie-id=${upcomingMovie.id} class="js-poster" src="${
      "https://image.tmdb.org/t/p/w185/" + upcomingMovie.poster_path
    }">
    </div>
    <div class="info">
    <div class="movie-title">${upcomingMovie.title}</div> 
    <div class="stats">
      <div class="rating"><img src="images/icons/star.svg" class="star"/> ${
        upcomingMovie.vote_average
      }</div>
      <div class="release">${getYear(upcomingMovie)}</div>
    </div>
    </div>
    
    </div>
  `;
  });
  document.querySelector(".upcoming-movies").innerHTML = upcomingMovieHTML;
  document.querySelectorAll(".js-poster").forEach((poster) => {
    poster.addEventListener("click", () => {
      getFullMoviePrevData(upcomingMoviesData, poster);
    });
  });
}
