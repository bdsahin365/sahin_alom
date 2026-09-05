-- ====================================================================
-- FULL STRUCTURED & NORMALIZED DATABASE MIGRATION
-- Project: sahinalom.com (https://yrxyvivvbkmfmsmuwlaz.supabase.co)
--
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/yrxyvivvbkmfmsmuwlaz/sql
-- ====================================================================

-- --------------------------------------------------------------------
-- --------------------------------------------------------------------
-- 1. Table: engineer_profile
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.engineer_profile (
  id TEXT PRIMARY KEY DEFAULT 'sahin',
  name TEXT NOT NULL,
  initials TEXT NOT NULL,
  photo TEXT,
  title TEXT NOT NULL,
  subtitle TEXT,
  location TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  linkedin TEXT,
  tagline TEXT,
  bio TEXT[] DEFAULT '{}',
  years_exp TEXT,
  projects_mw TEXT,
  projects_count TEXT,
  clients TEXT,
  available BOOLEAN DEFAULT true,
  credentials_tag TEXT DEFAULT 'PE',
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.engineer_profile ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read engineer_profile" ON public.engineer_profile;
CREATE POLICY "Public read engineer_profile" ON public.engineer_profile FOR SELECT USING (true);
DROP POLICY IF EXISTS "Write engineer_profile" ON public.engineer_profile;
CREATE POLICY "Write engineer_profile" ON public.engineer_profile FOR ALL USING (true) WITH CHECK (true);

-- --------------------------------------------------------------------
-- 2. Table: projects
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  num TEXT,
  title TEXT NOT NULL,
  client TEXT,
  location TEXT,
  capacity TEXT,
  year TEXT,
  category TEXT,
  img TEXT,
  img_color TEXT,
  summary TEXT,
  scope TEXT[] DEFAULT '{}',
  deliverables TEXT[] DEFAULT '{}',
  outcome TEXT,
  tools TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read projects" ON public.projects;
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
DROP POLICY IF EXISTS "Write projects" ON public.projects;
CREATE POLICY "Write projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);

-- --------------------------------------------------------------------
-- 3. Table: services
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  num TEXT,
  name TEXT NOT NULL,
  detail TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read services" ON public.services;
CREATE POLICY "Public read services" ON public.services FOR SELECT USING (true);
DROP POLICY IF EXISTS "Write services" ON public.services;
CREATE POLICY "Write services" ON public.services FOR ALL USING (true) WITH CHECK (true);

-- --------------------------------------------------------------------
-- 4. Table: expertise
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.expertise (
  id TEXT PRIMARY KEY,
  num TEXT,
  title TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.expertise ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read expertise" ON public.expertise;
CREATE POLICY "Public read expertise" ON public.expertise FOR SELECT USING (true);
DROP POLICY IF EXISTS "Write expertise" ON public.expertise;
CREATE POLICY "Write expertise" ON public.expertise FOR ALL USING (true) WITH CHECK (true);

-- --------------------------------------------------------------------
-- 5. Table: credentials
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.credentials (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT,
  detail TEXT,
  url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read credentials" ON public.credentials;
CREATE POLICY "Public read credentials" ON public.credentials FOR SELECT USING (true);
DROP POLICY IF EXISTS "Write credentials" ON public.credentials;
CREATE POLICY "Write credentials" ON public.credentials FOR ALL USING (true) WITH CHECK (true);

-- --------------------------------------------------------------------
-- 6. Table: experience
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.experience (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  period TEXT,
  current BOOLEAN DEFAULT false,
  description TEXT,
  highlights TEXT[] DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read experience" ON public.experience;
CREATE POLICY "Public read experience" ON public.experience FOR SELECT USING (true);
DROP POLICY IF EXISTS "Write experience" ON public.experience;
CREATE POLICY "Write experience" ON public.experience FOR ALL USING (true) WITH CHECK (true);

-- --------------------------------------------------------------------
-- 7. Table: education
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.education (
  id TEXT PRIMARY KEY,
  period TEXT,
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  note TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read education" ON public.education;
CREATE POLICY "Public read education" ON public.education FOR SELECT USING (true);
DROP POLICY IF EXISTS "Write education" ON public.education;
CREATE POLICY "Write education" ON public.education FOR ALL USING (true) WITH CHECK (true);

-- --------------------------------------------------------------------
-- 8. Table: site_settings
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'general',
  site_title TEXT NOT NULL,
  page_description TEXT,
  site_url TEXT,
  logo_url TEXT,
  logo_type TEXT DEFAULT 'default_emblem',
  favicon_url TEXT,
  og_image_url TEXT,
  resume_url TEXT,
  tools TEXT[] DEFAULT '{}',
  social_linkedin TEXT,
  social_twitter TEXT,
  social_github TEXT,
  social_facebook TEXT,
  social_youtube TEXT,
  ga_id TEXT,
  clarity_id TEXT,
  google_verification TEXT,
  bing_verification TEXT,
  yandex_verification TEXT,
  pinterest_verification TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Write site_settings" ON public.site_settings;
CREATE POLICY "Write site_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- --------------------------------------------------------------------
-- 9. Table: articles
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
CREATE POLICY "Public can view published articles" ON public.articles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Full access for authenticated users" ON public.articles;
CREATE POLICY "Full access for authenticated users" ON public.articles FOR ALL USING (true) WITH CHECK (true);

-- --------------------------------------------------------------------
-- 10. Table: contact_messages
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
CREATE POLICY "Public insert contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Read contact_messages" ON public.contact_messages;
CREATE POLICY "Read contact_messages" ON public.contact_messages FOR ALL USING (true) WITH CHECK (true);

-- --------------------------------------------------------------------
-- 11. Table: office_notes
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
CREATE POLICY "Office notes access" ON public.office_notes FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- SEED DATA: INSERT ALL STRUCTURED ROWS
-- ====================================================================

-- 1. Engineer Profile
INSERT INTO public.engineer_profile (
  id, name, initials, photo, title, subtitle, location, email, phone, linkedin, tagline, bio, years_exp, projects_mw, projects_count, clients, available, updated_at
) VALUES (
  'sahin',
  'Md Sahin Alom',
  'SAHIN',
  '/src/img/sahin.png',
  'Electrical Engineer',
  'Power Systems · ABC Licensed',
  'Zirabo, Ashulia, Savar, Dhaka',
  'info@sahinalom.com',
  '01760816120',
  'https://linkedin.com/in/sahinalom',
  'Designing reliable, efficient and safe electrical power infrastructure for modern industrial and garment manufacturing facilities.',
  ARRAY[
    'I am Md Sahin Alom — an Electrical Engineer based in Savar, Dhaka, Bangladesh, with practical experience in industrial electrical maintenance, power distribution networks, and standby generation systems.',
    'My work includes hands-on maintenance of LV/MV distribution, transformer and switchgear operations, Automatic Transfer Switch (ATS) wiring, and single-line diagram (SLD) preparation using AutoCAD Electrical.',
    'I combine thorough technical analysis with practical site execution, ensuring that industrial power systems are safe, compliant, and built for uninterrupted production.'
  ],
  '2+',
  '1250 KVA',
  '5+',
  'RMG Sector',
  true,
  now()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  tagline = EXCLUDED.tagline,
  bio = EXCLUDED.bio,
  updated_at = now();

-- 2. Projects (4 Full Featured Projects)
INSERT INTO public.projects (
  id, num, title, client, location, capacity, year, category, img, img_color, summary, scope, deliverables, outcome, tools, featured, display_order
) VALUES
(
  'styllent-knit-generator',
  '01',
  '1250 KVA Generator & ATS Installation',
  'Styllent Knit Limited',
  'Dhaka, Bangladesh',
  '1250 KVA',
  '2026',
  'Industrial Power · Standby Generation',
  '/src/img/projects/1250-kva-cummins-diesel-generator.jpg',
  '#1A1208',
  'End-to-end engineering, installation, and commissioning of a 1250 KVA standby diesel generator set with Automatic Transfer Switch (ATS) for Styllent Knit Limited — ensuring 100% power reliability for continuous garment knitting and sewing lines.',
  ARRAY[
    'Load assessment and generator sizing study',
    'Site survey and foundation / civil works coordination',
    'Electrical panel and automatic transfer switch (ATS) design',
    'Cabling, earthing, and fuel system installation',
    'Commissioning, load testing, and operator handover'
  ],
  ARRAY['Generator sizing report', 'Single-line diagram (SLD)', 'ATS wiring schematics', 'Earthing design', 'Commissioning test records'],
  'Zero downtime during grid fluctuations; seamless power switchover in under 8 seconds, protecting sensitive sewing machines and knitting looms.',
  ARRAY['AutoCAD Electrical', 'ETAP', 'CYMGRD', 'Fluke Earth Tester'],
  true,
  1
),
(
  'rooftop-solar-rmg',
  '02',
  '1.2 MWp Rooftop Solar PV Net-Metering',
  'Pacific Composite Textiles Ltd',
  'Gazipur, Bangladesh',
  '1.2 MWp',
  '2024',
  'Renewable Energy · BREB Net-Metering',
  'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1400&h=900&fit=crop&auto=format&q=85',
  '#0A1A10',
  'Complete electrical engineering design and BREB net-metering interconnection for a 1.2 MWp industrial rooftop solar installation across 3 shed buildings of a green composite garment facility.',
  ARRAY[
    'Solar PV array string sizing and roof shading analysis',
    'LT synchronizing panel & bi-directional net-metering integration with 11kV substation',
    'DC/AC cable schedule, inverter station design, and surge protection',
    'Lightning Protection System (LPS) as per BNBC / IEC 62305',
    'BREB grid-compliance testing and net-metering synchronization'
  ],
  ARRAY['PVSyst simulation & yield assessment', 'Complete electrical layout and AC/DC single-line diagrams', 'Net-metering protection coordination study', 'Structural earthing & LPS drawing package', 'As-built documentation & commissioning report'],
  'Generates ~1.65 GWh clean energy annually, reducing factory grid utility bills by 28% while advancing factory LEED Platinum decarbonization goals.',
  ARRAY['PVSyst', 'AutoCAD Electrical', 'ETAP', 'SMA Sunny Design'],
  true,
  2
),
(
  'substation-pfi-upgrade',
  '03',
  '2500 KVA Substation & 1200 kVAR PFI Upgrade',
  'Aman Graphics & Apparel Ltd',
  'Narayanganj, Bangladesh',
  '2500 KVA',
  '2023',
  'Substation Engineering · Power Quality',
  '/src/img/projects/pfi.jpg',
  '#0F0A00',
  'Modernization of an 11/0.415 kV 2500 KVA indoor substation, HT vacuum circuit breaker (VCB) overhaul, and installation of a 1200 kVAR microprocessor-controlled Power Factor Improvement (PFI) plant.',
  ARRAY[
    '11kV HT switchgear panel and VCB relay calibration',
    'Transformer oil dielectric testing and bushing maintenance',
    '1200 kVAR automatic PFI plant with detuned harmonic filters design',
    'Main Distribution Board (MDB) & Sub-Distribution Board (SDB) re-balancing',
    'Power quality harmonic survey and transient analysis'
  ],
  ARRAY['Substation layout and section drawings', 'Relay coordination & fault current calculation', 'PFI sizing and harmonic mitigation report', 'DESCO inspection compliance documentation', 'Thermographic survey report'],
  'Maintained power factor above 0.98 lagging, eliminating utility low power factor penalty and reducing overall line thermal losses by 14%.',
  ARRAY['AutoCAD', 'ETAP', 'Fluke 435 Power Quality Analyzer', 'Schneider Easergy'],
  true,
  3
),
(
  'bbt-safety-remediation',
  '04',
  '1600A Busbar Trunking & RSC Electrical Remediation',
  'Elegance Fashion Wear Ltd',
  'Savar / Ashulia, Bangladesh',
  '1600A / 1000 KVA',
  '2023',
  'Industrial Safety · RSC Compliance',
  '/src/img/projects/busbar-trunking.webp',
  '#050D1A',
  'Comprehensive electrical safety remediation and installation of 1600A sandwich-type Busbar Trunking (BBT) across 4 production floors to satisfy RMG Sustainability Council (RSC) and Accord/Alliance safety guidelines.',
  ARRAY[
    'Electrical hazard identification, single-line diagram updates, and load audit',
    'Design and installation of 1600A sandwich-type copper BBT risers & tap-off units',
    'Residual current protection (RCCB/ELCB) and circuit breaker coordination',
    'Dedicated earth pit network overhaul with resistance reduced to < 0.8 Ohm',
    'RSC / Accord safety audit liaison and CAP (Corrective Action Plan) closure'
  ],
  ARRAY['Updated as-built single-line diagrams (SLD) for all floors', 'BBT route layout & isometric installation drawings', 'Earth loop impedance and insulation resistance logs', 'RSC Electrical Safety Audit closure report', 'Preventive maintenance standard operating procedure'],
  '100% RSC electrical safety audit compliance achieved with zero pending findings; enhanced fire safety and reduced production floor wiring clutter.',
  ARRAY['AutoCAD Electrical', 'Megger Insulation Tester', 'FLIR Thermal Imaging Camera'],
  true,
  4
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  client = EXCLUDED.client,
  location = EXCLUDED.location,
  capacity = EXCLUDED.capacity,
  year = EXCLUDED.year,
  summary = EXCLUDED.summary,
  scope = EXCLUDED.scope,
  deliverables = EXCLUDED.deliverables,
  outcome = EXCLUDED.outcome,
  tools = EXCLUDED.tools,
  updated_at = now();

-- 3. Services (6 items)
INSERT INTO public.services (id, num, name, detail, display_order) VALUES
('s1', '01', 'Power Systems Studies', 'Load flow · fault analysis · stability · harmonics · contingency', 1),
('s2', '02', 'Substation Engineering', 'Concept through IFC — 11kV to 500kV AC systems', 2),
('s3', '03', 'Renewable Grid Integration', 'Solar · wind · BESS interconnection and compliance studies', 3),
('s4', '04', 'Protection & Control', 'Relay coordination · arc flash · IEC 61850 · SCADA', 4),
('s5', '05', 'Technical Due Diligence', 'Independent engineer reviews for lenders and investors', 5),
('s6', '06', 'Expert Witness & Review', 'Technical expert services for disputes and regulatory proceedings', 6)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  detail = EXCLUDED.detail;

-- 4. Expertise (6 items)
INSERT INTO public.expertise (id, num, title, tags, description, display_order) VALUES
('power-systems', '01', 'Power Systems Analysis', ARRAY['Load Flow', 'Short-Circuit', 'Stability Studies', 'Harmonic Analysis', 'PSCAD', 'PSS/E'], 'Comprehensive power flow, fault analysis and transient stability studies for transmission and distribution networks using industry-standard simulation tools.', 1),
('hv-substation', '02', 'HV Substation Design', ARRAY['69kV–500kV', 'Single-Line Diagrams', 'Protection Schemes', 'Grounding', 'AutoCAD', 'ETAP'], 'End-to-end substation engineering from conceptual design through detailed design packages, IFC drawings and commissioning support.', 2),
('renewables', '03', 'Renewable Energy Integration', ARRAY['Solar PV', 'Wind', 'BESS', 'Interconnection', 'Grid Code', 'Power Quality'], 'Grid integration engineering for utility-scale solar, wind and energy storage projects — from interconnection studies to protection coordination and SCADA.', 3),
('protection', '04', 'Protection & Control', ARRAY['Relay Coordination', 'IEC 61850', 'SCADA', 'PLC', 'Arc Flash', 'NFPA 70E'], 'Protection system design, relay coordination studies, arc flash hazard analysis and control system engineering for industrial and utility clients.', 4),
('grid-planning', '05', 'Transmission Planning', ARRAY['N-1 Contingency', 'Capacity Studies', 'Voltage Regulation', 'Loss Analysis', 'GIS'], 'Long-range transmission planning studies assessing reliability, thermal limits and voltage performance under base case and contingency conditions.', 5),
('power-quality', '06', 'Power Quality & EMC', ARRAY['THD', 'Flicker', 'Capacitor Banks', 'Filters', 'IEEE 519', 'EN 50160'], 'Power quality assessment, harmonic mitigation design and electromagnetic compatibility studies for industrial facilities and grid-connected assets.', 6)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  tags = EXCLUDED.tags,
  description = EXCLUDED.description;

-- 5. Credentials (6 items)
INSERT INTO public.credentials (id, label, value, detail, url, display_order) VALUES
('cred-1', 'ABC License', 'Electrical Licensing Board', 'Electricity Licensing Board (ELB), Bangladesh · Category A, B & C', '', 1),
('cred-2', 'Prompt Engineering', 'Generative AI & Prompting', 'LinkedIn Learning · Issued Jan 2025', 'https://www.linkedin.com/learning/certificates/f8a91a6c479f690d316965810fa87921a3ec71caa28aa8d54391ee97b3c1fbd9/', 2),
('cred-3', 'Design Thinking', 'Design Thinking in AI Age', 'LinkedIn Learning · Issued Jan 2025', 'https://www.linkedin.com/learning/certificates/c37b971869567938016f63c0017f044150f06cc9f6f0d5857519102fe1ef157f/', 3),
('cred-4', 'Jira & PM', 'Managing Jira Projects', 'Atlassian · Issued Jan 2024 · ID: 70e90c15ad04', 'https://www.linkedin.com/learning/certificates/70e90c15ad046dcac394160b884ad55c10d7e807dc900a42fd66e258ad322637/', 4),
('cred-5', 'UX Design', 'Foundations of UX Design', 'Coursera / Google · Issued May 2023', 'https://coursera.org/share/7b1fa4f3f951f5cc8bdf82cd9db6f63b', 5),
('cred-6', 'IT & Networks', 'Technical Support Fundamentals', 'Coursera / Google · Issued May 2023 · ID: NWGWMNS22HRY', 'https://coursera.org/share/83b8b4f8bcf0c4434589fca7c2e561af', 6)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  value = EXCLUDED.value,
  detail = EXCLUDED.detail;

-- 6. Experience (2 items)
INSERT INTO public.experience (id, role, company, location, period, current, description, highlights, display_order) VALUES
(
  'styllent-knit',
  'Junior Electrical Engineer',
  'Styllent Knit Limited',
  'Dhaka, Bangladesh',
  'Apr 2026 — Present',
  true,
  'Responsible for electrical system maintenance, power distribution, and infrastructure projects at a large garment manufacturing facility.',
  ARRAY[
    'Engineered and commissioned a 1250 KVA standby diesel generator installation, eliminating production downtime during grid outages',
    'Oversee daily operations of the facility''s LV/MV power distribution network',
    'Coordinate preventive maintenance schedules for transformers, switchgear, and motor control centres',
    'Prepare electrical drawings, single-line diagrams, and load schedules using AutoCAD Electrical'
  ],
  1
),
(
  'blusyenergy',
  'UX Engineer',
  'Blusyenergy Ltd',
  'Remote',
  '2022 — 2024',
  false,
  'Worked at the intersection of electrical engineering and digital product design, building user-facing tools and dashboards for energy monitoring and management platforms.',
  ARRAY[
    'Designed and developed interactive energy dashboards for real-time power monitoring',
    'Collaborated with electrical engineers to translate technical data into accessible UI/UX',
    'Built data visualisation components for grid performance and consumption analytics',
    'Bridged engineering and product teams to improve technical product usability'
  ],
  2
)
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  company = EXCLUDED.company,
  period = EXCLUDED.period,
  description = EXCLUDED.description,
  highlights = EXCLUDED.highlights;

-- 7. Education (3 items)
INSERT INTO public.education (id, period, degree, institution, note, display_order) VALUES
('edu-1', '2024', 'BSc in Electrical & Electronic Engineering', 'Green University of Bangladesh', 'EEE Department', 1),
('edu-2', '2018', 'Diploma in Engineering (Electronics & Telecommunication)', 'BCMC College of Engineering & Technology', 'ET Discipline', 2),
('edu-3', '2014', 'Secondary School Certificate (SSC)', 'Panikauria Secondary School', 'Science Group', 3)
ON CONFLICT (id) DO UPDATE SET
  degree = EXCLUDED.degree,
  institution = EXCLUDED.institution,
  note = EXCLUDED.note;

-- 8. Site Settings (1 item)
INSERT INTO public.site_settings (id, site_title, page_description, tools, social_linkedin, social_twitter, social_github, updated_at) VALUES
(
  'general',
  'Md Sahin Alom — Electrical Engineer',
  'Power systems engineer based in Zirabo, Ashulia, Savar, Dhaka.',
  ARRAY['PSS/E', 'PSCAD', 'ETAP', 'DIgSILENT', 'AutoCAD Electrical', 'CYMGRD', 'SKM Power Tools', 'MATLAB/Simulink', 'Python', 'Microstation'],
  'https://linkedin.com/in/sahinalom',
  '',
  '',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  site_title = EXCLUDED.site_title,
  page_description = EXCLUDED.page_description,
  tools = EXCLUDED.tools,
  social_linkedin = EXCLUDED.social_linkedin,
  updated_at = now();
