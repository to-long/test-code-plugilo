# 1. Dock Widget (Embeddable)
A floating button that expands into a panel showing the user's stacks.
## Must Have:
    - [✓] Minimize/expand states with smooth animations
    - [-] Can be embedded into third-party websites without conflicts -> still conflict in edge cases
    - [✓] Responsive (mobile + desktop)
## Nice To Have:
    - [-] Use Web Component (Shadow DOM for style isolation) -> not yet using shadow DOM, need more time to setup and test
    - [✓] Theme support (light/dark)
## Example Usage:
    - [✓] `<wishlist-dock data-theme="dark">!#wishlist-dock>`

# 2. Stack Management
Users can create and organize collections.
## Stack Fields:
    - [✓] Cover: Image/color (can be randomly generated - random color, gradient, or placeholder image)
    - [✓] Name: Stack title
## Must Have:
    - [✓] Create/delete stacks
    - [✓] View list of stacks with card counts
    - [✓] Click to view stack contents

# 3. Card Management
Display and manage items within stacks.
## Card Fields:
    - [✓] Cover: Image (required)
    - [✓] Name: Card title (required)
    - [✓] Description: Brief description (optional)
    - [✓] Selected Stack: Which stack this card belongs to (required)

## Must Have:
    - [✓] Add/remove cards
    - [✓] Display all card fields (cover, name, description)
    - [✓] Move cards between stacks (drag & drop or select different stack)
    - [✓] Swipe Mode: Cards displayed in swipeable stack (like Tinder/card deck)
        - [✓] Use a library to support swiping cards
        - [✓] Swipe left/right to navigate through cards
        - [✓] Opens when clicking on a stack
        - [✓] Show card counter

# 4. State & Data
## Must Have:
    - [✓] State management solution -> zustands 
    - [✓] Optimistic UI updates: Update UI immediately, sync with API later
    - [✓] API layer for CRUD operations (use fake/mock API service if needed)
## Nice To Have:
    - [✓] Data persistence (localStorage, IndexedDB, or similar)
    - [✓] Loading and error states
## Important - Optimistic UI:
    - [✓] When user adds/removes cards → Update UI instantly
    - [✓] When user creates/deletes stacks → Update UI instantly
    - [✓] Sync with backend in the background
    - [✓] Handle API failures gracefully (rollback with error message)
    - [-] Show sync indicators when needed

# 5.Technical Requirements
## Required:
    - [✓] React 18+
    - [✓] Embeddable component: Web Component
    - [✓] Modern CSS: Tailwinds, Liguid Glass UI
    - [✓] Clean, maintainable code structure
## You Decide:
    - [✓] State management approach: Zustands
    - [✓] Styling solution: Tailwinds
    - [✓] Libraries/tools to use: Rsbuild, pnpm, ...
    - [✓] How to split and organize features: feature slicing patterns
    - [x] Code splitting strategy: too small to use lazy load here

# 6.Optional Enhancements
Pick any that showcase your strengths:
    - [x] Unit/integration tests
    - [-] Code splitting & lazy loading
    - [✓] Advanced animations
    - [✓] Accessibility features
    - [x] Offline support
    - [✓] Search/filter functionality
    - [✓] Keyboard shortcuts

# Notes:
- [✓] : fully support
- [-] : partial support 
- [x] : not yet support