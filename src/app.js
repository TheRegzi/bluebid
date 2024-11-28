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
const createAuctionLinks = document.querySelectorAll('.createAuction');
const myProfileLinks = document.querySelectorAll('.myProfile');
const logOutButtons = document.querySelectorAll('.logOut');

function updateUIBasedOnAuth() {
  const token = localStorage.getItem('userToken');

  if (!token) {
    logInLinks.forEach((link) => link.classList.remove('hidden'));
    registerLinks.forEach((link) => link.classList.remove('hidden'));
    createAuctionLinks.forEach((link) => link.classList.add('hidden'));
    myProfileLinks.forEach((link) => link.classList.add('hidden'));
    logOutButtons.forEach((button) => button.classList.add('hidden'));
  } else {
    logInLinks.forEach((link) => link.classList.add('hidden'));
    registerLinks.forEach((link) => link.classList.add('hidden'));
    createAuctionLinks.forEach((link) => link.classList.remove('hidden'));
    myProfileLinks.forEach((link) => link.classList.remove('hidden'));
    logOutButtons.forEach((button) => button.classList.remove('hidden'));
  }
}

updateUIBasedOnAuth();
