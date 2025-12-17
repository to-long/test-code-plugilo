import './index.css';
import r2wc from '@r2wc/react-to-web-component';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

const registerWishlistDock = () => {
  if (!customElements.get('wishlist-dock')) {
    console.log('registering wishlist-dock web component');
    const WishlistDock = r2wc(App, {
      props: { theme: 'string' },
    });
    customElements.define('wishlist-dock', WishlistDock);
  }
};

window.registerWishlistDock = registerWishlistDock;
