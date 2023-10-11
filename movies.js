import { getData } from "./movie-data.js";

export const baseUrl = "https://api.themoviedb.org/3";

export const posterIds = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  sciencefiction: 878,
  thriller: 53,
  war: 10752,
  western: 37,
  tvMovie: 10770,
};

for (let poster in posterIds) {
  document.getElementById(poster).addEventListener("click", () => {
    getData(posterIds[poster]);
  });
}
