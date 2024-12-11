import { displayLoggedInUserProfile, addUsersAuctionListings } from '../../api/profile/userProfile';
import { authGuard } from '../../UI/authGuard';

displayLoggedInUserProfile();
addUsersAuctionListings();
authGuard();
