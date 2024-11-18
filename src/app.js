import '../src/css/style.css';

const hamburgerButton = document.getElementById('hamburger-button');
const content = document.getElementById('hamburger-content');
if (hamburgerButton && content) {
  hamburgerButton.addEventListener('click', () => {
    if (content.classList.contains('hidden')) {
      content.classList.remove('hidden');
      content.classList.add('visible');
    } else {
      content.classList.remove('visible');
      content.classList.add('hidden');
    }
  });
} else {
  console.error('Hamburger button or content not found in the DOM.');
}
