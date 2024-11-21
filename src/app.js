import '../src/css/style.css';
import router from './js/router';

await router(window.location.pathname);

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

const logIn = document.getElementById('logIn');
const register = document.getElementById('register');
const createAuction = document.getElementById('createAuction');
const myProfile = document.getElementById('myProfile');
const logOutButton = document.getElementById('logOut');

function updateUIBasedOnAuth() {
  const token = localStorage.getItem('userToken');

  if (!token) {
    createAuction.classList.add('hidden');
    myProfile.classList.add('hidden');
    logOutButton.classList.add('hidden');
  } else {
    createAuction.classList.remove('hidden');
    myProfile.classList.remove('hidden');
    logOutButton.classList.remove('hidden');
    logIn.classList.add('hidden');
    register.classList.add('hidden');
  }
}

updateUIBasedOnAuth();
