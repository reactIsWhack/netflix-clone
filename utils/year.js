export function getYear(content) {
  const releaseDate = content.release_date;
  const releaseDateArray = releaseDate.split('-');
  const releaseYear = releaseDateArray[0];
  return releaseYear;
}