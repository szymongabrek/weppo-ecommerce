document.addEventListener('DOMContentLoaded', () => {
  const maxLength = 120;

  const descriptions = document.querySelectorAll('.description');
  for (const description of descriptions) {
    description.innerHTML = description.innerHTML.substring(0, maxLength);
    if (description.innerHTML.length == maxLength) {
      description.innerHTML += '...';
    }
  }
});