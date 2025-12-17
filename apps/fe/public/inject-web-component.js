const remoteUrl = '/manifest.json';

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

fetch(remoteUrl)
  .then((response) => response.json())
  .then((manifest) => {
    // manifest.entries.index.initial.js (array)
    // manifest.entries.index.initial.css (array)
    const initial = manifest?.entries?.index?.initial;
    if (initial) {
      // Add JS files as <script>
      if (Array.isArray(initial.js)) {
        for (const jsFile of initial.js) {
          const jsPath = jsFile.startsWith('/') ? jsFile : `/${jsFile}`;
          const script = document.createElement('script');
          script.src = jsPath;
          script.defer = true;
          document.body.appendChild(script);
        }
      }
      waitFor(() => window.registerWishlistDock).then(() => {
        window.registerWishlistDock(initial.css);
      });
    }
  });
