const remoteUrl = '/manifest.json';

fetch(remoteUrl)
  .then((response) => response.json())
  .then((manifest) => {
    // manifest.entries.index.initial.js (array)
    // manifest.entries.index.initial.css (array)
    const initial = manifest?.entries?.index?.initial;
    if (initial) {
      // Add CSS files as <link>
      if (Array.isArray(initial.css)) {
        for (const cssFile of initial.css) {
          const cssPath = cssFile.startsWith('/') ? cssFile : `/${cssFile}`;
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = cssPath;
          document.head.appendChild(link);
        }
      }
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
    }
  });
