import { fetchUserProfile } from '../../api/profile/userProfile';

export async function populateForms() {
  const profileData = await fetchUserProfile();
  console.log(profileData);

  if (!profileData) {
    alert('Failed to fetch the listing. Cannot populate form.');
    return;
  }

  document.getElementById('update-bio').value = profileData.bio || '';
  document.getElementById('update-image').value = profileData.avatar.url || '';
  document.getElementById('update-banner').value = profileData.banner.url || '';
}
