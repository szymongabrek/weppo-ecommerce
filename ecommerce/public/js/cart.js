document.addEventListener('DOMContentLoaded', () => {
  const maxLength = 210;

  const descriptions = document.querySelectorAll('.aa-product-descrip');
  for (const description of descriptions) {
    description.innerHTML = description.innerHTML.substring(0, maxLength);
    if (description.innerHTML.length == maxLength) {
      description.innerHTML += '...';
    }
  }
});