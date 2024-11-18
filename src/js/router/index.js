export default async function router(pathname = window.location.pathname) {
  try {
    switch (pathname) {
      case '/index.html':
      case '/':
        await import('./views/home.js');
        console.log('Loaded home.js');
        break;
    }
  } catch (error) {
    console.error('Error in router:', error);
  }
}
