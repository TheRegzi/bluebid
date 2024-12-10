import {
  fetchListing,
  displaySingleAuction,
} from '../../api/listings/singleListing';
import {
  initializeBidCreation,
  updateBidContainerBasedOnAuthAndDeadline,
} from '../../api/bids/bids';

fetchListing();
displaySingleAuction();
initializeBidCreation();
updateBidContainerBasedOnAuthAndDeadline();
