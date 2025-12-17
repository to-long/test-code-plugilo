# Frontend Application Documentation 

## Overview
This is a modern React 19 frontend application built with TypeScript, Tailwind CSS, and Rsbuild. It serves as a landing page for the Plugilo project.

## Setup instructions
Make sure [pnpm](https://pnpm.io/) is installed:
```bash
npm i -g pnpm
```

Then install and start:
```bash
pnpm install
pnpm dev
```

### Available Scripts
```bash
pnpm dev      # Start development server (port 3000)
pnpm build    # Build for production
pnpm preview  # Preview production build
```


## Tech Stack

### Core Dependencies
- **React**: v19.0.0 - UI library with latest features
- **React DOM**: v19.0.0 - DOM rendering for React
- **TypeScript**: v5.7.2 - Type-safe JavaScript

### Build Tools
- **Rsbuild**: v1.1.0 — Modern, fast bundler built on Rspack, used for development and production builds
- **@rsbuild/plugin-react**: v1.1.0 — Adds zero-config React (and JSX) support to Rsbuild
- **@rsbuild/plugin-svgr**: v1.1.0 — Enables importing SVGs as React components with SVGR

### Styling
- **Tailwind CSS**: v3.4.15 - Utility-first CSS framework
- **PostCSS**: v8.4.49 - CSS processing
- **Autoprefixer**: v10.4.20 - Automatic vendor prefixing

## Project Structure

```
apps/fe/
├── src/
│   ├── App.tsx                 # Main React application component
│   ├── index.tsx               # Entry point: renders <App />
│   ├── index.css               # Global styles (Tailwind + resets)
│   └── env.d.ts                # TypeScript env definitions
├── public/
│   ├── inject-web-component.js # Standalone loader for web component assets
│   └── test-web-component.html # Manual test page for <wishlist-dock>
├── dist/
│   ├── inject-web-component.js # Build output: loader script
│   └── test-web-component.html # Build output: test HTML
├── rsbuild.config.ts           # Rsbuild build/dev config
├── tailwind.config.js          # Tailwind setup/config
├── postcss.config.js           # PostCSS config
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies, scripts, metadata
```

## Styling Approach

This project uses Tailwind and a design system inspired by [`Apple’s “Liquid Glass”`](https://developer-apple-com.translate.goog/documentation/TechnologyOverviews/liquid-glass?_x_tr_sl=en&_x_tr_tl=vi&_x_tr_hl=vi&_x_tr_pto=tc&_x_tr_hist=true) UI—prioritizing translucent panels, blurred backgrounds, and layered, glassy interfaces for a modern, elegant appearance.

## Backend Integration

API types are automatically generated from the backend's OpenAPI (Swagger) schema. We use `jsdoc` and `openapi-typescript` to keep backend and frontend type definitions synchronized, ensuring type safety and reducing manual maintenance. This enables seamless and reliable data contracts between the frontend and backend.

## Web Component & How to embed the widget

A custom web component (`<wishlist-dock>`) is under development. **CSS is currently _not isolated_ or encapsulated** — this is an intentional trade-off to save development time, since implementing fully isolated styles (like Shadow DOM scoping or specialized bundling) would substantially increase build complexity and effort. As a result, styles from the component might affect, or be affected by, the host page (risk of CSS collisions).

### Testing the Web Component

Manual testing is available via the included HTML page:

- **Development/Test:**  
  Open [`test-web-component.html`](http://localhost:3000/test-web-component.html) in your browser.
- This page loads the web component and injects its necessary assets using [`inject-web-component.js`](./public/inject-web-component.js).
- _Note:_ Style encapsulation is **not** implemented in the test environment.

### Architecture decisions & Trade-offs you made

> **CSS for the web component is shared with the page and not encapsulated.**  
> This trade-off was made to keep the build process fast and simple. Isolated styling (e.g., via Shadow DOM or CSS scoping) may be explored in the future.

## Improve if have more time
- add more features: share on Social networks
- add more common components in style `liquid-glass` to standalize components 
- encapsulate css to isolate css 

## Optional Enhancements: 

- [ ] Unit/integration tests
- [x] Code splitting & lazy loading
- [x] Advanced animations
- [x] Accessibility features
- [ ] Offline support
- [x] Search/filter functionality
- [ ] Keyboard shortcuts
