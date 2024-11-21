import { onRegister } from '../../api/auth/register';

const form = document.forms.register;

form.addEventListener('submit', onRegister);
