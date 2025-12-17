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

function buildAssetPath(assetUrls, manifestUrl) {
  // assetUrls: array of asset path strings (may or may not be absolute)
  // if manifestUrl contains a domain, prepend protocol + hostname to non-absolute assetUrls
  if (!Array.isArray(assetUrls)) return [];
  try {
    const manifestHasDomain = /^https?:\/\//.test(manifestUrl);

    if (!manifestHasDomain) {
      // manifestUrl is relative, ignore, just return assetUrls as-is
      return assetUrls;
    }
    // manifestUrl has a domain, parse it to get protocol+host
    const urlObj = new URL(manifestUrl);
    const base = `${urlObj.protocol}//${urlObj.host}`;

    return assetUrls.map((file) => {
      // If file already absolute, return as is
      if (/^https?:\/\//.test(file)) return file;
      // if file starts with '/', attach host
      if (file.startsWith('/')) return `${base}${file}`;
      // otherwise, treat as root relative
      return `${base}/${file.replace(/^\/+/, '')}`;
    });
  } catch (e) {
    // fallback: just return as is
    return assetUrls;
  }
}

function injectWebComponent(manifestUrl = '/manifest.json') {
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
          console.log('injecting js files', jsLinkArray);
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
          window.registerWishlistDock(cssLinkArray);
        });
      }
    });
}

if (window.remoteManifestUrl) {
  injectWebComponent(window.remoteManifestUrl);
}
