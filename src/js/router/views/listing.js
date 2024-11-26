import { fetchListing } from '../../api/listings/singleListing';
import {
  initializeBidCreation,
  updateBidContainerBasedOnAuth,
} from '../../api/bids/bids';

fetchListing();
initializeBidCreation();
updateBidContainerBasedOnAuth();
