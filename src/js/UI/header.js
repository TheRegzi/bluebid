/**
 * Toggles the visibility of the mobile menu when the hamburger menu button is clicked.
 * Adds or removes the `hidden` class on the mobile menu to show or hide it.
 */

export function toggleHamburgerMenu() {
  const menuButton = document.getElementById('menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  menuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

const logInLinks = document.querySelectorAll('.logIn');
const registerLinks = document.querySelectorAll('.register');
const createAuctionLinks = document.querySelectorAll('.createAuction');
const myProfileLinks = document.querySelectorAll('.myProfile');
const logOutButtons = document.querySelectorAll('.logOut');

/**
 * Updates the navigation bar links based on the user's authentication status.
 * If a `userToken` exists in localStorage, it displays authenticated user links
 * (e.g., "Create Auction", "My Profile") and hides unauthenticated links (e.g., "Login", "Register").
 * If no `userToken` exists, it shows the unauthenticated links and hides the authenticated ones.
 */

export function updateUIBasedOnAuth() {
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
