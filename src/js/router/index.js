export default async function router(pathname = window.location.pathname) {
  try {
    switch (pathname) {
      case '/index.html':
      case '/':
        await import('./views/home.js');
        console.log('Loaded home.js');
        break;
      case '/listing/':
      case '/listing/index.html':
        await import('./views/listing.js');
        console.log('Loaded listing.js');
        break;
      case '/auth/login/':
      case '/auth/login/index.html':
        await import('./views/login.js');
        console.log('Loaded login.js');
        break;
      case '/auth/register/':
      case '/auth/register/index.html':
        await import('./views/register.js');
        console.log('Loaded register.js');
        break;
      case '/search/':
      case '/search/index.html':
        await import('./views/search.js');
        console.log('Loaded search.js');
        break;
      case '/listing/create/':
      case '/listing/create/index.html':
        await import('./views/createListing.js');
        console.log('Loaded createListing.js');
        break;
      case '/listing/edit/':
      case '/listing/edit/index.html':
        await import('./views/editListing.js');
        console.log('Loaded editListing.js');
        break;
      case '/profile/':
      case '/profile/index.html':
        await import('./views/userProfile.js');
        console.log('Loaded userProfile.js');
        break;
      case '/profile/edit/':
      case '/profile/edit/index.html':
        await import('./views/updateProfile.js');
        console.log('Loaded updateProfile.js');
        break;
    }
  } catch (error) {
    console.error('Error in router:', error);
  }
}
