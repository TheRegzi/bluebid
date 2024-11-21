import { onLogin } from '../../api/auth/login';

const form = document.forms.login;

form.addEventListener('submit', onLogin);
