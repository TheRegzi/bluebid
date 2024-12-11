/**
 * Ensures that the user is logged in by checking for a 'userToken' in localStorage.
 * If the token is not found, the user is alerted and redirected to the login page.
 * 
 * @returns {void} This function does not return any value.
 */

export function authGuard() {
    if (!localStorage.userToken) {
      alert("You must be logged in to view this page");
      window.location.href = "/auth/login/";
    } 
  }
  