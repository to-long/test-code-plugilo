const manifestUrl = './manifest.json';

function waitFor(checkFn, { interval = 50, timeout = 10000 } = {}) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    function poll() {
      try {
        if (checkFn()) {
          resolve();
        } else if (Date.now() - start >= timeout) {
          reject(new Error('waitFor: timed out'));
        } else {
          setTimeout(poll, interval);
        }
      } catch (e) {
        reject(e);
      }
    }
    poll();
  });
}

function buildAssetPath(assetUrls) {
  // assetUrls: array of asset path strings (may or may not be absolute)
  // if manifestUrl contains a domain, prepend protocol + hostname to non-absolute assetUrls
  if (!Array.isArray(assetUrls)) return [];

  try {
    // Find current script's domain
    let scriptDomain = null;
    // biome-ignore lint/complexity/useOptionalChain: vanilajs
    if (document.currentScript && document.currentScript.src) {
      try {
        const scriptUrl = new URL(document.currentScript.src, window.location.href);
        scriptDomain = `${scriptUrl.protocol}//${scriptUrl.host}`;
      } catch {}
    }
    // If document.currentScript fallback (IE/edge/old), try last script
    if (!scriptDomain) {
      const scripts = document.getElementsByTagName('script');
      if (scripts.length > 0) {
        try {
          const scriptUrl = new URL(scripts[scripts.length - 1].src, window.location.href);
          scriptDomain = `${scriptUrl.protocol}//${scriptUrl.host}`;
        } catch {}
      }
    }

    // Current window's domain
    const windowDomain = `${window.location.protocol}//${window.location.host}`;

    // If the script is from a different domain than the window, map all assets to the script's domain
    if (scriptDomain && scriptDomain !== windowDomain) {
      return assetUrls.map((file) => {
        // If already absolute, return as-is
        if (/^https?:\/\//.test(file)) return file;
        // if file starts with '/', attach scriptDomain
        if (file.startsWith('/')) return `${scriptDomain}${file}`;
        // otherwise, treat as root relative
        return `${scriptDomain}/${file.replace(/^\/+/, '')}`;
      });
    }

    // Otherwise, return as-is
    return assetUrls;
  } catch (e) {
    // fallback: just return as is
    return assetUrls;
  }
}

function injectWebComponent(manifestUrl) {
  fetch(manifestUrl)
    .then((response) => response.json())
    .then((manifest) => {
      // manifest.entries.index.initial.js (array)
      // manifest.entries.index.initial.css (array)
      const initial = manifest?.entries?.index?.initial;
      if (initial) {
        // Add JS files as <script>
        if (Array.isArray(initial.js)) {
          const jsLinkArray = buildAssetPath(initial.js, manifestUrl);
          console.log('injecting js links', jsLinkArray);
          for (const jsFile of jsLinkArray) {
            const script = document.createElement('script');
            script.src = jsFile;
            script.defer = true;
            document.body.appendChild(script);
          }
        }
        waitFor(() => window.registerWishlistDock).then(() => {
          // inject css files into web component
          const cssLinkArray = buildAssetPath(initial.css, manifestUrl);
          console.log('injecting css links ', cssLinkArray);
          window.registerWishlistDock(cssLinkArray);
        });
      }
    });
}

injectWebComponent(manifestUrl);
