import '../src/css/style.css';
import router from './js/router';
import { logOutUser } from './js/api/auth/logout';
import { toggleHamburgerMenu, updateUIBasedOnAuth } from './js/UI/header';

await router(window.location.pathname);

logOutUser();

toggleHamburgerMenu();

updateUIBasedOnAuth();
