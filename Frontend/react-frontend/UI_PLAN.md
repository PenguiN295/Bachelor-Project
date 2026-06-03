# UI Redesign Implementation Plan & Constraints

## 1. Stack & Tooling
*   **CSS Framework:** Tailwind CSS
*   **Component Library:** shadcn/ui (radix-ui primitives)
*   **Icons:** Lucide React (replacing Bootstrap Icons)
*   **Routing:** React Router v6
*   **State/Data:** TanStack Query

## 2. Design System: "Modern Horizon"

### Color Palette
We will configure Tailwind to use these as our primary theme colors.
*   **Backgrounds:** 
    *   App Background: `bg-slate-50`
    *   Surface/Card: `bg-white`
*   **Primary (Brand):** Indigo
    *   Base: `indigo-600` (Buttons, active states)
    *   Hover: `indigo-700`
    *   Subtle: `indigo-50` (Active nav states, subtle backgrounds)
*   **Secondary/Accent:** Rose or Teal (Used sparingly for contrast, e.g., important alerts or secondary call-to-actions).
*   **Text/Typography:**
    *   Headings: `text-slate-900`
    *   Body: `text-slate-700`
    *   Muted/Icons: `text-slate-500`
*   **Destructive:** `red-600` (Deletes, errors)
*   **Success:** `emerald-600`

### Typography & Spacing
*   **Font Family:** Inter (Sans-serif)
*   **Spacing Constraints:** Stick strictly to the Tailwind spacing scale (e.g., `p-4`, `p-6`, `gap-4`). Avoid arbitrary values.
*   **Border Radius:** 
    *   Cards/Images: `rounded-xl`
    *   Buttons/Inputs: `rounded-lg` or `rounded-md`
*   **Shadows:** 
    *   Cards: `shadow-sm` (resting), `shadow-md` (hover)
    *   Dropdowns/Modals: `shadow-lg`

## 3. Strict Development Constraints
1.  **Component Consistency:** Never build a raw HTML `<button>` or `<input>`. ALWAYS use the shadcn/ui primitives.
2.  **No Bootstrap:** Ensure absolutely no Bootstrap classes (e.g., `d-flex`, `mt-4`, `btn-primary`) remain in modified files.
3.  **Responsiveness:** Mobile-first approach. Use Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`). Default layouts should stack vertically on mobile.
4.  **Grid over Flex:** Prefer CSS Grid (`grid grid-cols-1 md:grid-cols-2`) for lists of cards instead of flexbox wraps, to ensure perfect alignment.
5.  **Aspect Ratios:** Ensure user-uploaded images (events, profiles) use `object-cover` and a fixed aspect ratio (e.g., `aspect-video` for event headers) to prevent layout shifts.

---

## 4. Implementation Phases

### Phase 1: Foundation & Setup (Infrastructure)
*   Uninstall Bootstrap (`bootstrap`, `bootstrap-icons`).
*   Install Tailwind CSS, PostCSS, Autoprefixer.
*   Configure `tailwind.config.js` and `index.css`.
*   Initialize `shadcn/ui` and configure global CSS variables.
*   Install base `shadcn/ui` components: `Button`, `Input`, `Card`, `DropdownMenu`, `Avatar`.
*   Install `lucide-react`.

### Phase 2: Navigation & Layout Overhaul
*   Rewrite `Layout.tsx` for a central app wrapper.
*   Rewrite `Mainbar.tsx` (Top navigation).
*   Rewrite `UserMenu.tsx` and `UserDropDown.tsx` using shadcn `DropdownMenu` and Lucide.

### Phase 3: Shared UI Components
*   Redesign `EventCard.tsx` (Card component, badge overlay, aspect ratio).
*   Redesign `CommunityListItem.tsx`.
*   Restyle `LoadingState.tsx` (Tailwind spinner/skeleton).
*   Ensure `sonner` toasts use the new theme.

### Phase 4: Core Entity Pages
*   Redesign main feeds (`Dashboard.tsx`, `CommunitiesPage.tsx`) using responsive grids.
*   Overhaul `EventPage.tsx` (Hero image, clean typography, Map integration).
*   Overhaul `CommunityPage.tsx` (Banner header, member list, embedded events grid).

### Phase 5: Forms & Inputs
*   Redesign `LoginPage.tsx` and `RegisterPage.tsx` (Centered card, clear inputs).
*   Redesign `CreateEventPage.tsx` and `CreateCommunityPage.tsx` (Use shadcn `Input`, `Textarea`, `Label`).

### Phase 6: Admin & Profile Polish
*   Rewrite `UserPage.tsx` and `ViewUserPage.tsx` (Profile header, tabs/grids for events).
*   Restyle `UsersPage.tsx` (Admin table or styled list group).
