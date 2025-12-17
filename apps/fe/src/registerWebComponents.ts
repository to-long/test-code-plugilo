import App from '@/App';
import reactToWebComponent from '@r2wc/react-to-web-component';

const registerWishlistDock = (cssLinkArray: string[]) => {
  if (!customElements.get('wishlist-dock')) {
    console.log('registering wishlist-dock web component');

    class WishlistDock extends reactToWebComponent(App, {
      props: { theme: 'string' },
      shadow: 'open',
    }) {
      connectedCallback() {
        // @ts-ignore
        super.connectedCallback();
        const template = document.createElement('template');
        template.innerHTML = cssLinkArray
          .map((cssLink) => `<link rel="stylesheet" href="${cssLink}">`)
          .join('');
        this.shadowRoot?.appendChild(template.content.cloneNode(true));
      }
    }

    customElements.define('wishlist-dock', WishlistDock);
  }
};

window.registerWishlistDock = registerWishlistDock;
