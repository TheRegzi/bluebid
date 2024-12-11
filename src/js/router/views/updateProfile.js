import { populateForms, initializeSubmitButton } from '../../api/profile/updateProfile';
import { authGuard } from '../../UI/authGuard';

populateForms();
initializeSubmitButton();
authGuard();