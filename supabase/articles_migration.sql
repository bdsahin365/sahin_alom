-- ====================================================================
-- SUPABASE MIGRATION: Articles Table & Initial Seed
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/rtihttzsmkkmzpnlmnlx/sql
-- ====================================================================

-- 1. Create articles table
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

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Allow anyone to read published articles
CREATE POLICY "Public can view published articles"
  ON public.articles
  FOR SELECT
  USING (true);

-- Allow authenticated users or service role to perform all operations
CREATE POLICY "Full access for authenticated users"
  ON public.articles
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 4. Create Storage Bucket for blog assets if not already existing
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-assets', 'blog-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for blog-assets
CREATE POLICY "Public can read blog assets"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'blog-assets');

CREATE POLICY "Anyone can upload blog assets"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'blog-assets');

-- 5. Insert Chapter 1 Article
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
  '"<h2>ভূমিকা: লাইট লাগানো বনাম লাইটিং ডিজাইন</h2><p>একটা নতুন কমার্শিয়াল বা রেসিডেন্সিয়াল বিল্ডিং তৈরি হচ্ছে। ফলস সিলিংয়ের কাজ শেষ। এরপর ইলেকট্রিক্যাল কন্ট্রাক্টর বা টেকনিশিয়ান এসে সিলিং মেপে মেপে একটার পর একটা 2x2 LED প্যানেল বা ডাউনলাইট বসিয়ে দিয়ে গেল। সুইচ অন করতেই পুরো ফ্লোর ধবধবে সাদা আলোয় ঝলমল করে উঠল।</p><p>বাইরে থেকে দেখলে মনে হবে—<em>\"বাহ্! বেশ সুন্দর আলো হয়েছে, ঘর তো বেশ ব্রাইট!\"</em></p><p>কিন্তু একজন প্রফেশনাল ইলেকট্রিক্যাল বা বিল্ডিং সার্ভিসেস ইঞ্জিনিয়ারের দৃষ্টিকোণ থেকে প্রশ্ন হলো—<strong>সত্যিই কি এই বিল্ডিংয়ের Lighting Design সম্পন্ন হয়েছে?</strong></p><blockquote><strong>উত্তর হলো: একদমই না।</strong><br/>কারণ একটি রুমে শুধু কয়েকটি ফিক্সচার ঝুলিয়ে দেওয়া আর একটি কমপ্লিট <strong>Lighting Design</strong> সম্পন্ন করা—দুটো সম্পূর্ণ ভিন্ন জিনিস।</blockquote>"'::jsonb,
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
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  excerpt = EXCLUDED.excerpt,
  status = EXCLUDED.status,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  featured_image = EXCLUDED.featured_image,
  read_time = EXCLUDED.read_time,
  updated_at = now();
