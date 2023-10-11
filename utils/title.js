export function checkTitleLength(content) {
  if (content.title.length > 18) {
    content.title = content.title.substring(0, 18) + '...'
  }
}



