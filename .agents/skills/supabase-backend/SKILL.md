---
name: supabase-backend
description: >-
  Elite backend developer skill for Supabase, PostgreSQL, database migrations,
  Row Level Security (RLS), real-time synchronisation, Edge Functions, RPC procedures,
  and resilient full-stack API architecture. Use for architecting, debugging, optimizing,
  and integrating Supabase database systems.
---

# Supabase Backend Developer & Database Engineering Skill

A production-grade backend methodology for architecting scalable, secure, and resilient Supabase and PostgreSQL database layers in web applications.

---

## 1. Database Architecture & Schema Design

### 1.1 Table Structure & Constraints
* **Primary Keys**: Always use UUID (`gen_random_uuid()`) or structured deterministic slugs (`TEXT PRIMARY KEY`).
* **Foreign Keys**: Enforce referential integrity with explicit `ON DELETE CASCADE` or `ON DELETE SET NULL`.
* **Auditing Timestamps**: Every table must include `created_at TIMESTAMPTZ DEFAULT now()` and `updated_at TIMESTAMPTZ DEFAULT now()`.
* **Automated Triggers**: Attach an update trigger to keep `updated_at` synchronized:
  ```sql
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
  $$ language 'plpgsql';

  CREATE TRIGGER update_table_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
  ```

### 1.2 Common Schemas for Portfolio & CMS
* **`site_config`**: Single-row authoritative JSON state (`id = 'default'`).
* **`engineer_profile`**: Normalized personal, contact, bio, and key statistics.
* **`projects`**: Engineered projects with title, client, capacity, category, specs, deliverables, and display order.
* **`articles` / `posts`**: Rich Markdown/HTML technical publications with slugs, read times, and tags.
* **`contact_messages`**: Inbound client consultations with read status, timestamps, and replies.
* **`wedding_rsvps`**: Guest list management with attendance counts, dietary preferences, and event tracking.

---

## 2. Row Level Security (RLS) & Authorization

### 2.1 Principle of Least Privilege
* Enable RLS on every table without exception:
  ```sql
  ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
  ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
  ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
  ```

### 2.2 Standard Security Policies
1. **Public Read, Admin Write (Content Tables)**:
   ```sql
   -- Anyone can read public projects
   CREATE POLICY "Allow public read access" ON projects
     FOR SELECT USING (true);

   -- Only authenticated admin can insert/update/delete
   CREATE POLICY "Allow admin write access" ON projects
     FOR ALL TO authenticated
     USING (true)
     WITH CHECK (true);
   ```

2. **Public Insert, Admin Read/Write (Inquiry & Contact Forms)**:
   ```sql
   -- Public visitors can submit contact inquiries
   CREATE POLICY "Allow public insert" ON contact_messages
     FOR INSERT WITH CHECK (true);

   -- Only authenticated admin can view and manage inquiries
   CREATE POLICY "Allow admin view and manage" ON contact_messages
     FOR ALL TO authenticated
     USING (true)
     WITH CHECK (true);
   ```

---

## 3. Client Integration & Offline-First Resilience

### 3.1 Idempotent Upserts
Always structure updates using `upsert` with explicit conflict resolution:
```typescript
const { data, error } = await supabase
  .from('projects')
  .upsert(
    {
      id: project.id,
      title: project.title,
      capacity: project.capacity,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  )
```

### 3.2 Dual-Layer Persistence (LocalStorage + Supabase)
1. **Instant Hydration**: Load from `localStorage` cache immediately on app mount to eliminate blank states.
2. **Network Sync**: Fetch fresh data from Supabase in the background; merge cleanly and refresh cache.
3. **Optimistic Updates**: Mutate local state immediately so UI interactions feel instant (<16ms), then persist to database with rollback or toast on failure.

### 3.3 Robust Error Handling & Retries
```typescript
export async function resilientSupabaseQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  retries = 3,
  delayMs = 1000
): Promise<T | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const { data, error } = await queryFn()
      if (!error && data) return data
      if (attempt === retries) throw error
    } catch (err) {
      if (attempt === retries) {
        console.error('Supabase query failed after max retries:', err)
        return null
      }
      await new Promise(r => setTimeout(r, delayMs * attempt))
    }
  }
  return null
}
```

---

## 4. Real-time Subscriptions & Change Data Capture (CDC)

Listen to live database changes without polling:
```typescript
const channel = supabase
  .channel('inbox_changes')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'contact_messages' },
    (payload) => {
      // Prepend incoming inquiry to state and trigger audio/toast alert
      setRecentMessages(prev => [payload.new, ...prev])
      setUnreadCount(c => c + 1)
    }
  )
  .subscribe()

// Clean up subscription on unmount
return () => {
  supabase.removeChannel(channel)
}
```

---

## 5. Storage Buckets & Media Management

* Create dedicated public buckets for images (`portfolio-images`) and documents (`cv-documents`).
* Always compress large images (>1MB) client-side to WebP or high-efficiency JPEG prior to upload.
* Generate deterministic file paths: `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`.
