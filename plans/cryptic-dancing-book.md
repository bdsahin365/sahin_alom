# Plan: Complete Portfolio Website with Supabase Backend

## Context
The site currently stores all content in `localStorage` (`msa_site_v5`), which means edits only persist on one device. The user wants cloud-backed persistence so the site can be managed from anywhere, a proper authenticated admin dashboard, and the contact form wired to actually capture messages.

---

## Scope

1. **Supabase integration** — cloud database replaces localStorage
2. **Authentication** — secure `/admin` login so only Sahin can edit
3. **Contact form** → saves messages to Supabase
4. **Dashboard** — add Messages inbox panel, logout button
5. **SiteContext** — async Supabase reads/writes, localStorage as offline cache
6. **Route guard** — `/admin` redirects to login when unauthenticated

---

## 1. Install & Client Setup

```
pnpm add @supabase/supabase-js
```

Create **`src/lib/supabase.ts`**:
```ts
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)
```

Environment variables (added via Figma Make secrets UI):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 2. Supabase Database Schema

### Table: `site_config`
Stores the entire `SiteData` JSON in a single JSONB row — matches the existing SiteContext shape exactly, zero schema migration needed when new fields are added.

```sql
create table site_config (
  id    integer primary key default 1,
  data  jsonb   not null,
  updated_at timestamptz default now()
);
-- Only one row ever exists (id=1)
-- Row Level Security: public read, authenticated write
alter table site_config enable row level security;
create policy "Public read" on site_config for select using (true);
create policy "Auth write" on site_config for all using (auth.role() = 'authenticated');
```

### Table: `contact_messages`
```sql
create table contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text,
  email      text,
  subject    text,
  message    text,
  created_at timestamptz default now(),
  read       boolean default false
);
-- RLS: public insert, authenticated select/update
alter table contact_messages enable row level security;
create policy "Public insert" on contact_messages for insert with check (true);
create policy "Auth read"   on contact_messages for select using (auth.role() = 'authenticated');
create policy "Auth update" on contact_messages for update using (auth.role() = 'authenticated');
```

---

## 3. SiteContext Migration

**File: `src/context/SiteContext.tsx`**

Replace the sync `load()`/`save()` pattern with async Supabase calls.

- On mount: fetch `site_config` row (id=1) from Supabase → deep merge with DEFAULT → set state. Fall back to localStorage if offline.
- On `persist()`: upsert to Supabase first, then update localStorage as cache.
- Add `loading: boolean` to context so pages can show a skeleton while data loads.
- Keep `resetToDefaults()` — deletes Supabase row + clears localStorage.

```ts
// load: async
const { data: row } = await supabase.from('site_config').select('data').eq('id', 1).single()
// save: async upsert
await supabase.from('site_config').upsert({ id: 1, data: next, updated_at: new Date() })
```

---

## 4. Authentication

### Supabase Auth setup
- Enable Email provider in Supabase Auth dashboard
- Create one user (Sahin's email) via Supabase dashboard — no public signup needed

### New file: **`src/pages/AdminLogin.tsx`**
- Clean, minimal login form: email + password fields + "Sign in" button
- Calls `supabase.auth.signInWithPassword({ email, password })`
- On success → `navigate('/admin')`
- On error → inline error message
- Design: centred card, amber accent, same type system as rest of site

### Auth guard: **`src/components/AuthGuard.tsx`**
```tsx
// Wraps a route — checks supabase.auth.getSession()
// If no session → <Navigate to="/admin/login" />
// If session → <Outlet />
```

### Route changes in **`src/routes.tsx`**:
```ts
{ path: 'admin', children: [
  { path: 'login', Component: AdminLogin },
  { element: <AuthGuard />, children: [
    { index: true, Component: Dashboard },
  ]},
]},
```

> Nav buttons in `EngineerNav` and `SiteView` update from `/admin` → `/admin` (still valid, AuthGuard handles the redirect).

### Dashboard logout button
Add to Dashboard header: `supabase.auth.signOut()` → `navigate('/admin/login')`

---

## 5. Contact Form → Supabase

**File: `src/pages/EngineerPortfolio.tsx`** (Contact section)

The existing contact form currently likely has no submit handler. Wire it up:
- On submit: `supabase.from('contact_messages').insert({ name, email, subject, message })`
- Show success state ("Message sent ✓") and error state
- Clear form on success

---

## 6. Dashboard: Messages Panel

Add a new `messages` section to **`src/pages/Dashboard.tsx`**:
- Nav item: "Messages" with an inbox icon + unread count badge
- Fetches `contact_messages` ordered by `created_at desc`
- Shows each message as an expandable card: sender name, email, date, subject, body
- Mark as read button (updates `read = true`)
- Unread messages highlighted with amber left border

---

## 7. Loading State

Wrap the portfolio and dashboard with a minimal loading skeleton while `SiteContext` fetches from Supabase on first load. A simple full-page fade (200ms) is sufficient — avoid heavy skeleton screens.

---

## Critical Files Modified

| File | Change |
|---|---|
| `src/lib/supabase.ts` | **New** — Supabase client |
| `src/pages/AdminLogin.tsx` | **New** — login form |
| `src/components/AuthGuard.tsx` | **New** — route protection |
| `src/context/SiteContext.tsx` | localStorage → Supabase async |
| `src/routes.tsx` | Add `/admin/login`, nest admin under AuthGuard |
| `src/pages/Dashboard.tsx` | Logout button + Messages panel |
| `src/pages/EngineerPortfolio.tsx` | Wire contact form to Supabase |
| `src/pages/SiteView.tsx` | No change needed |

---

## Verification

1. Set `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` secrets in Figma Make
2. Run SQL schema in Supabase SQL editor
3. Create one auth user in Supabase dashboard (Sahin's email)
4. Visit `/admin` → redirects to `/admin/login`
5. Log in → reaches dashboard → edit a field → verify row appears in Supabase `site_config`
6. Open site in a second browser → changes are visible (proves cloud sync)
7. Submit contact form → row appears in `contact_messages`
8. Dashboard Messages panel shows the new message
9. Sign out → `/admin` redirects to login again
