import { initializeCreateListing } from '../../api/listings/createListing';
import { authGuard } from '../../UI/authGuard';

initializeCreateListing();
authGuard();