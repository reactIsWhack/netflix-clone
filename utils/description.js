export function checkDescription(movie) {
  if (movie.overview.length > 180) {
    movie.overview = movie.overview.substring(0, 180) + '...'
  } 
}