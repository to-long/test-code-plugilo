# Frontend Guidelines for Card & Stack Interface

This document explains the UX interactions and UI behaviors shown in the provided wireframe. It serves as a reference for implementing the Card/Stack interface.

---

## 1. Card Interactions

### **1.1 Drag to Delete Card**
- When a user drags a card upward, a **delete icon** (trash bin) becomes visible.
- Dropping the card on this icon will delete the card.
- The delete target only appears during drag.

### **1.2 Drag to Move Card Between Stacks**
- Users can drag the currently active card downward.
- A row of stacks is shown at the bottom navigation.
- Dropping the card onto any stack will move the card into that stack.

### **1.3 Card Options**
- Each card shows an **options icon** (three dots or pencil) on its lower-right corner.
- Tapping the icon opens an **Options Menu**:
  - **Edit** – opens the Edit Card screen.
  - **Delete** – deletes the card.

---

## 2. Bottom Stack Navigation

### **2.1 Stack List**
- The bottom bar contains a horizontal list of stacks.
- The **active stack** is visually highlighted.
- Tapping a stack switches the view to that stack.

### **2.2 Additional Actions**
- **Plus Button (+)** opens the create modal with two options:
  - **Create Card**
  - **Create Stack**
- **Search Icon** opens search functionality.
- **Options Icon (⋯)** opens stack-level options.

---

## 3. Create & Edit Card

### **3.1 Card Form Fields**
- Cover image area (clickable to upload/change).
- Text fields:
  - **Name**
  - **Description**
- **Stack Selector** (dropdown) to choose which stack the card belongs to.
- Bottom Buttons:
  - **Save** – saves changes.
  - **Cancel** – closes modal without saving.

---

## 4. Create & Edit Stack

### **4.1 Stack Form Fields**
- Cover image area.
- **Name** input field.
- Bottom buttons:
  - **Save**
  - **Cancel**

---

## 5. User Flow Summary

1. **Browsing:** Users view cards inside the active stack.
2. **Modify Card:** Use the pencil/options icon to edit or delete.
3. **Move Card:** Drag the card downward to move it to another stack.
4. **Delete Card:** Drag upward to drop into the trash bin.
5. **Create:** Press the + button → choose Card or Stack → fill form → Save.

---

## 6. Implementation Notes

- Use smooth drag animations and clearly visible drop targets.
- Persist stack/card updates immediately for responsiveness.
- Use modal dialogs for Create/Edit flows.
- Ensure bottom navigation is always visible.


---

## 7. Additional Functional Requirements

### 7.1 Dock Widget (Embeddable)
A floating button that expands into a panel showing the user's stacks.

**Must Have:**
- Minimize/expand states with smooth animations.
- Can be embedded into third-party websites without conflicts.
- Responsive on both mobile and desktop.

**Nice To Have:**
- Implemented as a Web Component using Shadow DOM for style isolation.
- Theme support (light/dark modes).

**Example Usage:**
```html
<wishlist-dock data-theme="dark"></wishlist-dock>
```

---

### 7.2 Stack Management
Users can create and organize collections.

**Stack Fields:**
- **Cover:** Image/color (can be random color, gradient, or placeholder image).
- **Name:** Required title of the stack.

**Must Have:**
- Create/delete stacks.
- View list of stacks with card counts.
- Click a stack to view its contents.

---

### 7.3 Card Management
Display and manage items within stacks.

**Card Fields:**
- **Cover:** Image (required).
- **Name:** Card title (required).
- **Description:** Optional.
- **Selected Stack:** Required; determines where the card belongs.

**Must Have:**
- Add/remove cards.
- Display all card fields.
- Move cards between stacks (drag & drop or via stack selector).
- **Swipe Mode:** Cards displayed in a swipeable deck (like Tinder).
  - Use a library for swipe interactions.
  - Swipe left/right to navigate cards.

**Dock Behavior:**
- Clicking a stack opens card view.
- Show card counter.

---

### 7.4 State & Data

**Must Have:**
- Any state management solution.
- **Optimistic UI updates:**
  - UI updates immediately.
  - Backend/API sync happens in the background.
- API layer for CRUD operations (mock API acceptable).

**Nice To Have:**
- Data persistence (localStorage, IndexedDB, etc.).
- Loading and error states.

**Important – Optimistic UI Rules:**
- When adding/removing cards → update UI instantly.
- When creating/deleting stacks → update UI instantly.
- Sync with backend in background.
- If API fails → rollback state + show error message.
- Show sync indicators as needed.

