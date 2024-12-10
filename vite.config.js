import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'esnext', 
    rollupOptions: {
        input: {
          main: '/index.html', 
          search: '/search/index.html', 
          profile: '/profile/index.html', 
          editProfile: '/profile/edit/index.html',
          listing: '/listing/index.html',
          editListing: '/listing/edit/index.html',
          createListing: '/listing/create/index.html',
          auth: '/auth/index.html',
          login: '/auth/login/index.html',
          register: '/auth/register/index.html'
        },
      },
    },
  });