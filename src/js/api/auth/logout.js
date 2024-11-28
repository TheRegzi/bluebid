export function logOutUser() {
  const logOutButtons = document.querySelectorAll('.logOut');

  if (logOutButtons.length > 0) {
    logOutButtons.forEach((button) => {
      button.addEventListener('click', () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('name');
        window.location.href = '/auth/login/index.html';
      });
    });
  }
}
