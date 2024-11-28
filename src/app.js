import '../src/css/style.css';
import router from './js/router';
import { logOutUser } from './js/api/auth/logout';

await router(window.location.pathname);
logOutUser();

function toggleHamburgerMenu() {
  const menuButton = document.getElementById('menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  menuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

toggleHamburgerMenu();

const logInLinks = document.querySelectorAll('.logIn');
const registerLinks = document.querySelectorAll('.register');
const createAuction = document.getElementById('createAuction');
const myProfile = document.getElementById('myProfile');
const logOutButton = document.getElementById('logOut');

function updateUIBasedOnAuth() {
  const token = localStorage.getItem('userToken');

  if (!token) {
    logInLinks.forEach((link) => link.classList.remove('hidden'));
    registerLinks.forEach((link) => link.classList.remove('hidden'));
    if (createAuction) createAuction.classList.add('hidden');
    if (myProfile) myProfile.classList.add('hidden');
    if (logOutButton) logOutButton.classList.add('hidden');
  } else {
    logInLinks.forEach((link) => link.classList.add('hidden'));
    registerLinks.forEach((link) => link.classList.add('hidden'));
    if (createAuction) createAuction.classList.remove('hidden');
    if (myProfile) myProfile.classList.remove('hidden');
    if (logOutButton) logOutButton.classList.remove('hidden');
  }
}

updateUIBasedOnAuth();
