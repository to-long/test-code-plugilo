import r2wc from '@r2wc/react-to-web-component';
import App from './App';

console.log('run here 111');
const WishlistDock = r2wc(App);

customElements.define('wishlist-dock', WishlistDock);

console.log('WishlistDock', WishlistDock);
