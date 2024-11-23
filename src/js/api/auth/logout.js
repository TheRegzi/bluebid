export function logOutUser() {
  const logOutButton = document.getElementById('logOut');

  if (logOutButton) {
    logOutButton.addEventListener('click', () => {
      localStorage.removeItem('userToken');
      localStorage.removeItem('name');
      window.location.href = '/auth/login/index.html';
    });
  } else {
    console.error('Log out button not found');
  }
}
