<div align="center">

# 🎟️ Spott - AI-Powered Event Discovery & Management Platform

**Describe your event in one line. Get a publish-ready listing in seconds.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Convex](https://img.shields.io/badge/Convex-Realtime_Backend-EE342F?logo=convex&logoColor=white)](https://www.convex.dev/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth_%26_Billing-6C47FF?logo=clerk&logoColor=white)](https://clerk.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-8E75B2?logo=googlegemini&logoColor=white)](https://ai.google.dev/)

</div>

---

## 📖 Overview

**Spott** is an AI-powered event discovery and management platform designed to help organizers publish events in seconds and help attendees find what's happening around them, register instantly, and check in with a single scan.

The application combines:

- AI-driven event listing generation
- Real-time, reactive event discovery and search
- QR-code based registration and check-in
- Organizer analytics dashboard
- Secure authentication
- Tier-based usage controls
- A fully serverless, reactive backend architecture

### 🎯 Problem Statement

| Problem                                                                                           | Spott's Solution                                                                                |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Writing event copy (title, description, category) is slow, and most organizers aren't copywriters | **AI Event Creator** drafts a complete, editable listing from a single sentence                 |
| Attendee lists live in spreadsheets, disconnected from the real guest count at the door           | A single `registrations` table drives the listing, the dashboard, and check-in — always in sync |
| Manual check-in (calling out names) is slow and error-prone                                       | Camera-based **QR scanning** + manual fallback check attendees in in under a second             |
| Discovery feeds aren't localized to where the user actually is                                    | Onboarding-driven location personalization surfaces a "Near You" feed from day one              |
| Monetizing premium features usually means building custom billing infrastructure                  | **Clerk Billing** provides a subscription paywall with zero custom payment code                 |

---

## ✨ Key Features

### For Attendees

| Feature                        | Description                                                                                                                 |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| 🔎 **Smart Event Discovery**   | Browse a featured carousel, a "Near You" feed, category browsing with live counts, and a nationwide "Popular" feed          |
| 🔍 **Real-Time Search**        | Debounced, full-text search across event titles with live results streaming in as you type                                  |
| 🎯 **Personalized Onboarding** | A 2-step wizard captures your interests and location to personalize the discovery feed from your very first session         |
| 🎫 **One-Click Registration**  | Register for any event in seconds and get a unique QR ticket instantly, with capacity and duplicate-registration protection |
| 📱 **My Tickets**              | View your upcoming and past registrations, display your QR ticket on demand, or cancel anytime                              |
| 🔄 **Live Capacity & Status**  | Real-time "X / Y registered" counts and instant "Event Full" / "Event Ended" states — no stale data, no manual refresh      |
| 📤 **Share Events**            | Native share-sheet integration (with clipboard fallback) to share any event link with one tap                               |

### For Organizers

| Feature                         | Description                                                                                                                                       |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🤖 **AI Event Creator**         | Describe your event in one sentence — Google Gemini drafts the title, description, category, capacity, and ticket type for you to review and edit |
| 📊 **Live Analytics Dashboard** | Real-time registrations vs. capacity, check-in rate, revenue (paid events), and a live countdown to the event                                     |
| ✅ **QR Check-In**              | Camera-based QR scanning or manual search-and-tap check-in from the attendee roster, with duplicate check-in protection                           |
| 📋 **Attendee Management**      | Searchable, tabbed roster (All / Checked-in / Pending) with one-click CSV export for offline records                                              |
| 🖼️ **Cover Image Picker**       | Search and attach Unsplash stock photography directly from the event-creation form                                                                |
| 🎨 **Custom Branding**          | Pro-tier organizers can set a custom theme color that dynamically recolors the entire event page and dashboard                                    |
| 💳 **Freemium Monetization**    | Free tier capped at 1 created event; Clerk Billing unlocks unlimited events and custom branding via a Pro subscription                            |

---

## 🌍 Real-World Use Cases

- **Community meetup organizers** (tech, music, fitness) who need a fast way to publish an event and track RSVPs without spinning up a spreadsheet.
- **Conference / workshop hosts** who need door-side check-in with live attendance analytics during the event itself.
- **Local event discovery** for attendees who want to find what's happening nearby, filtered by interest and city.
- **Indie SaaS founders** evaluating a freemium model — a working reference implementation of subscription gating using Clerk Billing instead of a custom payment integration.

---

## 🏗️ Tech Stack

### Frontend

| Technology                     | Purpose                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------ |
| ⚡ **Next.js 16 (App Router)** | Route groups, file-based routing, Route Handlers, Turbopack bundling           |
| ⚛️ **React 19**                | Component model, hooks, client/server component split                          |
| 🎨 **Tailwind CSS v4**         | Utility-first styling with CSS-variable-driven design tokens                   |
| 🧩 **shadcn/ui + Radix UI**    | Accessible, composable primitives (Dialog, Select, Tabs, Popover, Calendar...) |
| 🎯 **lucide-react**            | Consistent SVG icon set                                                        |
| 📝 **react-hook-form + Zod**   | Schema-driven form state and validation for the event-creation flow            |
| 📅 **date-fns**                | Date formatting and arithmetic                                                 |
| 🌍 **country-state-city**      | Cascading India state/city datasets for location selection                     |
| 🎞️ **embla-carousel-react**    | Featured-events hero carousel with autoplay                                    |
| 🎫 **react-qr-code**           | Client-side ticket QR rendering                                                |
| 📷 **html5-qrcode**            | Camera-based attendee check-in, dynamically imported                           |
| 🔔 **sonner**                  | Toast notifications for async action feedback                                  |
| 🌗 **next-themes**             | Light/dark theme provider                                                      |
| ⏳ **react-spinners**          | Async loading indicators (auth bootstrap bar)                                  |

### Backend

| Technology                        | Purpose                                                                                    |
| --------------------------------- | ------------------------------------------------------------------------------------------ |
| ⚡ **Convex**                     | Reactive document database — live query subscriptions, serverless mutation/query functions |
| 🧾 **convex/values validators**   | Schema-level type validation, composite indexes, and a full-text search index              |
| 🔐 **Convex ↔ Clerk Auth Bridge** | JWT verification against Clerk's issuer domain (`auth.config.js`)                          |

### External Data & AI Services

| Service                                     | Role                                                                                                                     |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Google Gemini** (`gemini-2.5-flash-lite`) | Generates structured event metadata (title, description, category, capacity, ticket type) from a natural-language prompt |
| **Unsplash API**                            | Searchable stock cover images for event listings                                                                         |
| **Clerk Billing**                           | Subscription checkout and plan entitlement checks (`auth().has({ plan })`) gating the Pro tier                           |

---

## 📁 Folder Structure

```text
spott-ai-events-organizer/
├── app/
│   ├── (auth)/                   # Sign-in / sign-up pages (Clerk)
│   ├── (protected)/               # Create event, my events, my tickets (auth-gated)
│   ├── (public)/                  # Explore hub & public event detail pages
│   ├── api/generate-event/        # Gemini AI event-generation Route Handler
│   ├── ConvexClientProvider.js     # Clerk ↔ Convex auth bridge
│   ├── layout.js                   # Root layout & global providers
│   └── page.js                     # Landing page
├── components/
│   ├── ui/                        # shadcn/ui primitives (Button, Dialog, Tabs...)
│   ├── EventCard.js                 # Polymorphic event card (grid/list variants)
│   ├── Header.js / Footer.js
│   ├── OnboardingModal.js            # Interests + location onboarding wizard
│   ├── SearchLocationBar.js           # Debounced search + location selector
│   ├── UnsplashImagePicker.js          # Cover image search
│   └── UpgradeModal.js                  # Clerk Billing paywall
├── convex/
│   ├── schema.js                   # Table & index definitions
│   ├── users.js / events.js / registrations.js
│   ├── dashboard.js / explore.js / search.js
│   ├── seed.js                      # Demo data seeding
│   └── auth.config.js                # Clerk JWT verification config
├── hooks/
│   ├── useConvexQuery.js / useConvexMutation.js  # Data-fetching abstraction
│   ├── useStoreUser.js                # JIT user provisioning on sign-in
│   └── useOnboarding.js                # Onboarding gating logic
├── lib/
│   ├── data.js                      # Static category catalogue
│   ├── helper.js                     # Slug, date, QR, color utilities
│   └── utils.js                       # Tailwind class merger (`cn()`)
├── proxy.js                          # Route protection (Next.js 16 middleware)
└── package.json
```

---

## 🗄️ Database Schema

This project uses **Convex** as its data layer — a document-oriented, serverless database where every table is defined declaratively through explicit schema validators (`convex/schema.js`, using `convex/values`) rather than a loosely-typed NoSQL store. Every document automatically receives a system-generated `_id` (primary key), and indexes — including the full-text search index below — are declared directly in the schema rather than added ad hoc at query time.

### Users

Stores application user profiles, bridging Clerk-issued identities with onboarding state and billing-relevant counters (`users` table).

| Field                         | Type                           | Description                                                          |
| ----------------------------- | ------------------------------ | -------------------------------------------------------------------- |
| **`_id`**                     | Id (system)                    | Convex document ID, primary key                                      |
| **`name`**                    | string                         | Display name, synced from the Clerk identity                         |
| **`tokenIdentifier`**         | string                         | Clerk JWT subject — **indexed** (`by_token`) for auth lookups        |
| **`email`**                   | string                         | User's email address                                                 |
| **`imageUrl`**                | string (optional)              | Profile image URL synced from Clerk                                  |
| **`hasCompletedOnboarding`**  | boolean                        | Whether the 2-step onboarding wizard has been completed              |
| **`interests`**               | array&lt;string&gt; (optional) | Selected event categories from onboarding                            |
| **`location`**                | object (optional)              | `{ city, state, country }` — personalizes the "Events Near You" feed |
| **`freeEventsCreated`**       | number                         | Counter driving the free-tier event-creation limit                   |
| **`createdAt` / `updatedAt`** | number                         | Epoch-millisecond timestamps                                         |

### Events

Stores event listings, including scheduling, location, ticketing, and branding data (`events` table).

| Field                            | Type                        | Description                                                                                        |
| -------------------------------- | --------------------------- | -------------------------------------------------------------------------------------------------- |
| **`_id`**                        | Id (system)                 | Convex document ID, primary key                                                                    |
| **`title` / `description`**      | string                      | Event title and description                                                                        |
| **`slug`**                       | string                      | URL slug (title + timestamp suffix) — **indexed** (`by_slug`), **search-indexed** (`search_title`) |
| **`organizerId`**                | Id&lt;"users"&gt;           | **Foreign key** → Users; **indexed** (`by_organizer`)                                              |
| **`organizerName`**              | string                      | Denormalized organizer display name                                                                |
| **`category`**                   | string                      | One of 12 predefined categories — **indexed** (`by_category`)                                      |
| **`tags`**                       | array&lt;string&gt;         | Searchable tags (currently mirrors `category`)                                                     |
| **`startDate` / `endDate`**      | number                      | Epoch-millisecond timestamps — **indexed** (`by_start_date`)                                       |
| **`timezone`**                   | string                      | IANA timezone string, captured from the organizer's browser                                        |
| **`locationType`**               | enum (`physical`, `online`) | Determines whether venue/address fields are shown                                                  |
| **`venue` / `address`**          | string (optional)           | Venue link (e.g. Google Maps URL) and free-text address                                            |
| **`city` / `state` / `country`** | string                      | Location fields, `state` optional                                                                  |
| **`capacity`**                   | number                      | Maximum attendee capacity                                                                          |
| **`ticketType`**                 | enum (`free`, `paid`)       | Determines whether `ticketPrice` is rendered/required                                              |
| **`ticketPrice`**                | number (optional)           | Price for paid events (pay-at-venue)                                                               |
| **`registrationCount`**          | number                      | Denormalized counter, updated transactionally on register/cancel                                   |
| **`coverImage`**                 | string (optional)           | Cover image URL (Unsplash-sourced)                                                                 |
| **`themeColor`**                 | string (optional)           | Hex color driving the event's dynamic per-page branding                                            |
| **`createdAt` / `updatedAt`**    | number                      | Epoch-millisecond timestamps                                                                       |

### Registrations

Links attendees to events, carrying the QR ticket code and check-in state (`registrations` table).

| Field                                | Type                            | Description                                                                        |
| ------------------------------------ | ------------------------------- | ---------------------------------------------------------------------------------- |
| **`_id`**                            | Id (system)                     | Convex document ID, primary key                                                    |
| **`eventId`**                        | Id&lt;"events"&gt;              | **Foreign key** → Events; **indexed** (`by_event`)                                 |
| **`userId`**                         | Id&lt;"users"&gt;               | **Foreign key** → Users; **indexed** (`by_user`)                                   |
| **`(eventId, userId)`**              | composite                       | **Indexed** (`by_event_user`) — enforces one registration per user per event       |
| **`attendeeName` / `attendeeEmail`** | string                          | Captured at registration time (may differ from the account profile)                |
| **`qrCode`**                         | string                          | Unique generated ticket code — **indexed** (`by_qr_code`) for O(1) check-in lookup |
| **`checkedIn`**                      | boolean                         | Whether the attendee has been checked in                                           |
| **`checkedInAt`**                    | number (optional)               | Epoch-millisecond check-in timestamp                                               |
| **`status`**                         | enum (`confirmed`, `cancelled`) | Registration lifecycle state                                                       |
| **`registeredAt`**                   | number                          | Epoch-millisecond registration timestamp                                           |

#### Indexes & Search Overview

- **Users → `by_token`** — resolves the authenticated Convex user from the incoming Clerk JWT on every request.
- **Events → `by_organizer`** powers "My Events"; **`by_category`** powers category browsing; **`by_start_date`** powers the Explore feed and chronological filtering; **`by_slug`** resolves the public event-detail page; **`search_title`** is the full-text search index behind the live search bar.
- **Registrations → `by_event`** powers the organizer's attendee roster; **`by_user`** powers "My Tickets"; **`by_event_user`** (composite) is the uniqueness guard preventing duplicate registrations; **`by_qr_code`** gives O(1) lookup during check-in.

---

## 🔐 Authentication & Security

| Layer                            | Implementation                                                                                                                                                                                 |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Identity**                     | Clerk handles sign-up, sign-in, session tokens, and modal-based auth UI, themed via `@clerk/ui`'s dark theme.                                                                                  |
| **Auth Bridge to Data Layer**    | `ConvexProviderWithClerk` forwards the active Clerk session as a JWT into Convex, which independently verifies it against `CLERK_JWT_ISSUER_DOMAIN` (`convex/auth.config.js`).                 |
| **Route Protection**             | `clerkMiddleware` + `createRouteMatcher` in `proxy.js` redirects unauthenticated users away from `/create-event`, `/my-events`, and `/my-tickets` before any page code executes.               |
| **Function-Level Authorization** | Every sensitive Convex mutation/query (`deleteEvent`, `getEventDashboard`, `getEventRegistrations`, `checkInAttendee`) independently re-verifies `event.organizerId === user._id` server-side. |
| **Secret Isolation**             | `GEMINI_API_KEY` is read only inside the server-side Route Handler (`app/api/generate-event/route.js`), never exposed via `NEXT_PUBLIC_*`.                                                     |
| **Plan Entitlements**            | `has({ plan: "pro_user" })` (Clerk Billing) is the single source of truth for tier status, checked directly inside both UI gating logic and form-submission handlers.                          |

---

## 🔌 API & Integration Layer

Spott doesn't expose a hand-rolled REST/GraphQL API for its primary data — **Convex functions are the API**, called directly from React via generated, typed `api.*` references. This collapses the usual "API route → fetch → serializer" indirection into a single function call. The one exception is a traditional Route Handler whose sole purpose is keeping the Gemini API key off the client.

| Module                            | Responsibilities                                                                                                                                             |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `convex/users.js`                 | `store` (JIT user provisioning), `getCurrentUser`, `completeOnboarding`                                                                                      |
| `convex/events.js`                | `createEvent`, `deleteEvent` (cascading registration cleanup), `getEventBySlug`, `getMyEvents`                                                               |
| `convex/registrations.js`         | `registerForEvent` (capacity + duplicate guard), `checkRegistration`, `getMyRegistrations`, `cancelRegistration`, `getEventRegistrations`, `checkInAttendee` |
| `convex/explore.js`               | `getFeaturedEvents`, `getPopularEvents`, `getEventsByLocation`, `getEventsByCategory`, `getCategoryCounts`                                                   |
| `convex/search.js`                | `searchEvents` — full-text search index lookup, gated behind a 2-character minimum query                                                                     |
| `convex/dashboard.js`             | `getEventDashboard` — aggregates registration, check-in, and revenue stats for the organizer view                                                            |
| `app/api/generate-event/route.js` | The one traditional Route Handler — proxies prompts to Gemini, keeping the API key server-side                                                               |

**Convex RPC conventions used throughout:** `.withIndex(...)` for indexed lookups, `.withSearchIndex(...)` for full-text search, `internal.users.getCurrentUser` for cross-function identity resolution, and `convex/values` validators (`v.string()`, `v.id()`, `v.union(v.literal(...))`) enforced on every function's arguments before the handler ever runs.

---

## ⚙️ State Management

Spott intentionally **avoids a global client-state library** (no Redux/Zustand) — a deliberate choice justified by the data flow:

- **Server state** (events, registrations, user profile) lives in Convex and is subscribed to live via `useQuery` — there is no separate client-side cache to manually keep in sync, since Convex pushes updates to every subscribed component the instant the underlying data changes.
- **`useConvexQuery` / `useConvexMutation`** (custom hooks) standardize loading/error/success states and automatic toast-based error reporting across the entire app, giving the ergonomics of a library like TanStack Query while sitting directly on top of Convex's native reactive hooks.
- **Local UI state** (modal open/close, onboarding wizard step, search input, active tab) is managed with plain `useState`, scoped to the component that owns it. Complex form state (the event-creation form) is owned by `react-hook-form` with Zod-driven validation instead.

This approach trades the manual cache-invalidation logic a global store would otherwise require for Convex's own push-based subscription model — an appropriate trade-off given that the database itself already behaves like a live store.

---

## 🧠 Business Logic Highlights

| Logic                                  | Implementation Detail                                                                                                                                                                           |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Free-tier enforcement**              | `freeEventsCreated` is incremented on `createEvent` and decremented on `deleteEvent`, checked against `hasPro` client-side before submission and re-validated implicitly by the counter itself. |
| **Collision-resistant slugs**          | Event slugs are derived from the title and suffixed with `Date.now()`, guaranteeing uniqueness without a database round-trip to check for collisions before insert.                             |
| **Denormalized registration counters** | `registrationCount` is incremented/decremented transactionally inside the same mutation that creates or cancels a registration, avoiding an aggregation query on every page load.               |
| **Duplicate-registration guard**       | The composite `by_event_user` index is used both to _query_ "is this user registered?" and to _enforce_ "a user can only register once" — encoding the rule at the data layer.                  |
| **Cascading event deletion**           | `deleteEvent` walks the `by_event` index and deletes every associated registration before removing the event document itself.                                                                   |
| **Defensive AI output parsing**        | `/api/generate-event` strips Markdown code fences and wraps `JSON.parse` in a `try/catch`, returning a typed error response instead of crashing on malformed model output.                      |
| **Dual-purpose slug routing**          | A single `[slug]` route inspects the segment against a static category list first, then falls back to a custom location-slug parser cross-validated against real state/city data.               |

---

## 🚀 Deployment Strategy

| Service                   | Recommended Target | Why                                                                                                                                  |
| ------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Next.js app               | **Vercel**         | First-class Next.js 16 App Router support, automatic edge deployment of `proxy.js`, built-in image optimization CDN                  |
| Convex functions & schema | **Convex Cloud**   | Functions, indexes, and the schema deploy independently via the Convex CLI, decoupling backend release cadence from frontend deploys |

---

## 🔧 Environment Setup

### `.env.local`

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url

# Clerk — Authentication & Billing
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_JWT_ISSUER_DOMAIN=your_clerk_jwt_issuer_domain

# Google Gemini (AI event generation)
GEMINI_API_KEY=your_gemini_api_key

# Unsplash (event cover image search)
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

---

## 💻 Getting Started

### Prerequisites

- Node.js `>=18.18`
- npm `>=6.x`
- A free [Convex](https://www.convex.dev/) account
- A free [Clerk](https://clerk.com/) account (with Billing enabled for the Pro tier)
- A [Google AI Studio](https://ai.google.dev/) API key for Gemini
- An [Unsplash Developer](https://unsplash.com/developers) access key

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/jyothikaogeti/spott-ai-events-organizer.git
cd spott-ai-events-organizer

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local   # then fill in the values described above

# 4. Start the Convex backend (provisions your dev deployment & schema)
npx convex dev

# 5. In a new terminal, start the Next.js dev server
npm run dev                  # App available at http://localhost:3000
```

### First-Run Setup (Clerk + Convex)

1. In the Clerk dashboard, create a **JWT Template** named `convex` and copy its issuer domain into `CLERK_JWT_ISSUER_DOMAIN`.
2. Under Clerk **Billing**, create a plan with the key `pro_user` — this exact key is referenced in code (`has({ plan: "pro_user" })`) to gate unlimited event creation and custom theme colors.
3. _(Optional)_ Seed demo events by invoking the `seed` internal mutation from the Convex dashboard's Functions tab.

---

## 📜 Available Scripts

### App (Next.js)

| Command         | Description                                      |
| --------------- | ------------------------------------------------ |
| `npm run dev`   | Start the Next.js development server (Turbopack) |
| `npm run build` | Create an optimized production build             |
| `npm run start` | Run the production build                         |
| `npm run lint`  | Run ESLint across the codebase                   |

### Backend (Convex)

| Command             | Description                                                   |
| ------------------- | ------------------------------------------------------------- |
| `npx convex dev`    | Start the local Convex dev deployment with live schema sync   |
| `npx convex deploy` | Deploy functions & schema to the production Convex deployment |

---

## 📚 Learning Outcomes

Building Spott involved hands-on, production-style experience with:

- Designing a **reactive, index-driven database schema** in Convex from real query patterns, rather than retrofitting indexes after the fact.
- Integrating a **generative AI feature** into a real product flow — including defensive parsing, quota handling, and UX for AI failure states, not just the happy path.
- Bridging two independent identity systems (**Clerk JWTs ↔ Convex auth**) and reasoning about where authorization checks must live — the route layer _and_ the data layer.
- Implementing **subscription-gated features** using a billing-as-a-service product, treating plan checks as a first-class authorization primitive rather than a UI-only toggle.
- Architecting **route protection and component composition** around access level (public/protected/auth) for long-term maintainability as the app grows.

---

<div align="center">Made with 💜 by Jyothika</div>
