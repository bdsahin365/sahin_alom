-- ====================================================================
-- MASTER SUPABASE DATABASE SETUP & CLEANUP SCRIPT
-- Project: sahinalom.com (https://yrxyvivvbkmfmsmuwlaz.supabase.co)
--
-- How to run:
-- 1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/yrxyvivvbkmfmsmuwlaz/sql
-- 2. Paste this entire script and click "Run" (or press Ctrl+Enter).
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. Table: articles
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content JSONB,
  status TEXT DEFAULT 'draft',
  category TEXT DEFAULT 'General',
  tags TEXT[] DEFAULT '{}',
  author TEXT DEFAULT 'Md Sahin Alom',
  featured_image TEXT,
  read_time INTEGER DEFAULT 5,
  meta_title TEXT,
  meta_desc TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published articles" ON public.articles;
CREATE POLICY "Public can view published articles"
  ON public.articles
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Full access for authenticated users" ON public.articles;
CREATE POLICY "Full access for authenticated users"
  ON public.articles
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- --------------------------------------------------------------------
-- 2. Table: site_config (Single-row site configuration)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read site_config" ON public.site_config;
CREATE POLICY "Public read site_config"
  ON public.site_config
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Full write site_config" ON public.site_config;
CREATE POLICY "Full write site_config"
  ON public.site_config
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- --------------------------------------------------------------------
-- 3. Table: contact_messages (Contact form submissions)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  subject TEXT,
  message TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert contact_messages" ON public.contact_messages;
CREATE POLICY "Public insert contact_messages"
  ON public.contact_messages
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Read contact_messages" ON public.contact_messages;
CREATE POLICY "Read contact_messages"
  ON public.contact_messages
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- --------------------------------------------------------------------
-- 4. Table: office_notes (Admin scratchpad & site notes)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.office_notes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  date TEXT,
  priority TEXT DEFAULT 'normal',
  is_completed BOOLEAN DEFAULT false,
  author TEXT DEFAULT 'Engr. Sahin Alom',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.office_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Office notes access" ON public.office_notes;
CREATE POLICY "Office notes access"
  ON public.office_notes
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- --------------------------------------------------------------------
-- 5. Storage Bucket: blog-assets
-- --------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-assets', 'blog-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can view blog assets" ON storage.objects;
CREATE POLICY "Public can view blog assets"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'blog-assets');

DROP POLICY IF EXISTS "Anyone can upload blog assets" ON storage.objects;
CREATE POLICY "Anyone can upload blog assets"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'blog-assets');

DROP POLICY IF EXISTS "Anyone can update blog assets" ON storage.objects;
CREATE POLICY "Anyone can update blog assets"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'blog-assets');

-- --------------------------------------------------------------------
-- 6. Clean Old Data & Seed Fresh Chapter 1 Article
-- --------------------------------------------------------------------
DELETE FROM public.office_notes;
DELETE FROM public.articles;

INSERT INTO public.articles (
  id,
  title,
  slug,
  excerpt,
  content,
  status,
  category,
  tags,
  author,
  featured_image,
  read_time,
  meta_title,
  meta_desc,
  created_at,
  updated_at
)
VALUES (
  'art-ch1-lighting-design',
  'Chapter 1: Lighting Design কী? কেন একটি Building-এ শুধু Light লাগালেই Lighting Design হয় না?',
  'chapter-1-lighting-design-ki',
  'একটি নতুন বিল্ডিংয়ে কয়েকটি লাইট লাগিয়ে দিলেই কি লাইটিং ডিজাইন হয়ে যায়? জানুন লাইটিং ডিজাইন কী, Watt, Lumen, Lux-এর বাস্তব পার্থক্য এবং BNBC অনুযায়ী ৭ ধাপের প্রফেশনাল লাইটিং ডিজাইন মেথড।',
  to_jsonb('<h2>ভূমিকা: লাইট লাগানো বনাম লাইটিং ডিজাইন</h2><p>একটা নতুন কমার্শিয়াল বা রেসিডেন্সিয়াল বিল্ডিং তৈরি হচ্ছে। ফলস সিলিংয়ের কাজ শেষ। এরপর ইলেকট্রিক্যাল কন্ট্রাক্টর বা টেকনিশিয়ান এসে সিলিং মেপে মেপে একটার পর একটা 2x2 LED প্যানেল বা ডাউনলাইট বসিয়ে দিয়ে গেল। সুইচ অন করতেই পুরো ফ্লোর ধবধবে সাদা আলোয় ঝলমল করে উঠল।</p><p>বাইরে থেকে দেখলে মনে হবে—<em>"বাহ্! বেশ সুন্দর আলো হয়েছে, ঘর তো বেশ ব্রাইট!"</em></p><p>কিন্তু একজন প্রফেশনাল ইলেকট্রিক্যাল বা বিল্ডিং সার্ভিসেস ইঞ্জিনিয়ারের দৃষ্টিকোণ থেকে প্রশ্ন হলো—<strong>সত্যিই কি এই বিল্ডিংয়ের Lighting Design সম্পন্ন হয়েছে?</strong></p><blockquote><strong>উত্তর হলো: একদমই না।</strong><br/>কারণ একটি রুমে শুধু কয়েকটি ফিক্সচার ঝুলিয়ে দেওয়া আর একটি কমপ্লিট <strong>Lighting Design</strong> সম্পন্ন করা—দুটো সম্পূর্ণ ভিন্ন জিনিস।</blockquote><p>একজন প্রফেশনাল ইঞ্জিনিয়ার যখন একটি স্পেসের লাইটিং ডিজাইন করেন, তখন তিনি কেবল রুমটি কতটা উজ্জ্বল তা দেখেন না। তিনি নিশ্চিত করেন কাজের জন্য প্রয়োজনীয় Lux Level, Uniformity Ratio, Glare Rating (UGR), Lighting Power Density (LPD) এবং Maintenance Factor (MF)।</p><hr/><h2>১. Lighting Design আসলে কী?</h2><blockquote><strong>Lighting Design</strong> হলো কোনো নির্দিষ্ট স্পেসের অ্যাক্টিভিটি, ব্যবহারকারীর ভিজ্যুয়াল কমফোর্ট এবং আর্কিটেকচারাল বৈশিষ্ট্য অনুযায়ী—সঠিক স্থানে, সঠিক কোয়ালিটি ও কোয়ান্টিটির আলোর সুপরিকল্পিত প্রয়োগ।</blockquote><hr/><h2>২. মৌলিক চারটি শব্দ: Watt, Lumen, Lux এবং Candela</h2><p><strong>Watt (W):</strong> পাওয়ার কনজাম্পশন বা বিদ্যুতের খরচ।<br/><strong>Lumen (lm):</strong> লাইট সোর্স থেকে চারদিকে নির্গত মোট আলোর পরিমাণ।<br/><strong>Lux (lx):</strong> নির্দিষ্ট সারফেসে প্রতি বর্গমিটারে পতিত আলো (1 Lux = 1 Lumen/m²)। গাণিতিক সূত্র: $$E = \frac{\Phi}{A}$$<br/><strong>Candela (cd):</strong> নির্দিষ্ট অভিমুখে আলোর তীব্রতা।</p><hr/><h2>৩. প্রফেশনাল লাইটিং ডিজাইনের ৭টি ধাপ (Workflow)</h2><p>১. স্পেসের ব্যবহার ও অ্যাক্টিভিটি বিশ্লেষণ<br/>২. টার্গেট Lux নির্ধারণ (BNBC 2020 অনুযায়ী)<br/>৩. রুম জিওমেট্রি ও সারফেস রিফ্লেক্ট্যান্স ডাটা সংগ্রহ<br/>৪. উপযুক্ত Luminaire ও অপটিক্স নির্বাচন<br/>৫. লুমেন মেথডে গাণিতিক হিসাব ও ফিক্সচার সংখ্যা<br/>৬. ফিক্সচার গ্রিড লেআউট ও সুষম স্পেসিং<br/>৭. DIALux evo সিমুলেশন ও ফিল্ড ভেরিফিকেশন</p>'::text),
  'published',
  'Electrical Engineering',
  ARRAY['Lighting Design', 'BNBC 2020', 'Building Services', 'Electrical Engineering', 'Lux', 'Lumen'],
  'Md Sahin Alom',
  '/img/lighting-design-cover.jpg',
  8,
  'Chapter 1: Lighting Design কী? কেন শুধু Light লাগালেই Lighting Design হয় না? — Md Sahin Alom',
  'বিল্ডিং লাইটিং ডিজাইনের মৌলিক নীতিমালা, Watt বনাম Lumen বনাম Lux-এর ব্যবহারিক বিশ্লেষণ, এবং BNBC 2020 অনুযায়ী প্রফেশনাল ৭-স্টেপ লাইটিং ডিজাইন প্রসেস।',
  now(),
  now()
);
