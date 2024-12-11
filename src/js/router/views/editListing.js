import { initializeSubmitButton } from '../../api/listings/editListing';
import { authGuard } from '../../UI/authGuard';

initializeSubmitButton();
authGuard();