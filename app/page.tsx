import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialIcons from "@/components/SocialIcons";
import { FeaturedPostsGrid } from "@/components/Blog/FeaturedPostsGrid";

export default async function Home() {
  const client = createClient();

  let blogPosts = await client.getAllByType("blog_post", {
      orderings: [
          { field: "my.blog_post.publish_date", direction: "desc" }
      ]
  }).catch(() => []);

  // Create a dummy post if no posts are found
  if (!blogPosts || blogPosts.length === 0) {
      blogPosts = [
          {
              id: "dummy-1",
              uid: "preventive-maintenance",
              data: {
                  title: "The Importance of Preventive Maintenance in Industrial Scalability",
                  excerpt: "Preventive maintenance is crucial for preventing unexpected failures and ensuring smooth operations...",
                  publish_date: "2026-04-10",
                  category: "Maintenance",
                  featured_image: { url: "" },
                  read_time: 5
              }
          } as any
      ];
  }

  // Fetch homepage data
  const homepage: any = await client.getSingle("homepage").catch(() => ({
    data: {
      slices: [
        {
          id: "hero_mock",
          slice_type: "hero",
          variation: "default",
          primary: {
            eyebrow: "Electrical • Maintenance • Systems",
            name: "Sahin Alom",
            headline: [{ type: "heading1", text: "Electrical Engineer with Systems Thinking.", spans: [] }],
            description: [{ type: "paragraph", text: "I combine electrical engineering principles with systems maintenance to ensure scalable and reliable industrial operations.", spans: [] }],
            primaryCtaLabel: "Get in Touch",
            primaryCtaLink: "#contact",
            secondaryCtaLabel: "Linkedin",
            secondaryCtaLink: { link_type: "Web", url: "https://www.linkedin.com" },
            showSocialIcons: true
          },
          items: []
        },
        {
          id: "about_mock",
          slice_type: "about",
          variation: "default",
          primary: {
            sectionTitle: "About",
            headline: [{ type: "heading2", text: "Maintaining systems, ensuring reliability.", spans: [] }],
            description: [
              { type: "paragraph", text: "Bridging the gap between vision and execution.", spans: [{ start: 0, end: 46, type: "strong" }] },
              { type: "paragraph", text: "I bring an engineering mindset to industrial problems. As a Maintenance Engineer at Styllent Knitt Limited with a background in Electrical Engineering, I ensure operations run smoothly, safely, and efficiently.", spans: [] }
            ],
            image: {
              url: "/sahinalom-about.png",
              dimensions: { width: 1920, height: 1080 },
              alt: "Sahin Alom",
              copyright: null,
            }
          },
          items: [
            { title: "MAINTENANCE", description: "Preventive and corrective maintenance of industrial systems." },
            { title: "TECHNICAL", description: "Deep understanding of electrical infrastructure and PLCs." },
            { title: "SYSTEMIC", description: "Scalable solutions for continuous industrial improvement." }
          ]
        },
        {
          id: "skills_mock",
          slice_type: "skills",
          variation: "default",
          primary: {
            sectionTitle: "Skills",
            intro: "Tools and strengths I use to maintain and optimize electrical systems."
          },
          items: [
            {
              groupTitle: "Electrical Engineering",
              skills: "Circuit Design, Power Distribution, Motor Controls, Switchgears, Electrical Safety"
            },
            {
              groupTitle: "Maintenance",
              skills: "Preventive Maintenance, Corrective Maintenance, Troubleshooting, Fault Analysis"
            },
            {
              groupTitle: "Systems Operation",
              skills: "Industrial Automation, Logic Controllers (PLCs), Process Optimization, Equipment Reliability"
            },
            {
              groupTitle: "Tools & Software",
              skills: "AutoCAD Electrical, SCADA, Maintenance Management Systems, Diagnostic Equipment"
            }
          ]
        },
        {
          id: "contact_mock",
          slice_type: "contact",
          variation: "default",
          primary: {
            header: "Let's Connect",
            description: [{ type: "paragraph", text: "Have a project or opportunity? I'm always open to discussing new ideas.", spans: [] }]
          },
          items: []
        }
      ],
      meta_title: "Sahin Alom - Electrical Engineer",
      meta_description: "Electrical Engineer based in Bangladesh, currently working in Maintenance at Styllent Knitt Limited.",
      meta_image: {}
    },
  }));

  // Fetch settings data
  const settings: any = await client.getSingle("settings" as any).catch(() => ({
    data: {
      siteName: "Sahin Alom",
      contactEmail: "hello@sahinalom.com",
      navigationItems: [
        { label: "Home", link: "#home" },
        { label: "About", link: "#about" },
        { label: "Skills", link: "#skills" },
        { label: "Resume", link: "/resume" },
        { label: "Tools", link: "/tools" },
        { label: "Contact", link: "#contact" },
      ],
      linkedinUrl: { url: "" },
      behanceUrl: { url: "" },
      dribbbleUrl: { url: "" },
      githubUrl: { url: "" },
      instagramUrl: { url: "" },
      footerText: [{ type: "paragraph", text: "© 2026 Sahin Alom. All rights reserved.", spans: [] }],
    },
  }));

  const socialLinks = {
    linkedinUrl: settings.data.linkedinUrl,
    behanceUrl: settings.data.behanceUrl,
    dribbbleUrl: settings.data.dribbbleUrl,
    githubUrl: settings.data.githubUrl,
    instagramUrl: settings.data.instagramUrl,
  };

  // Ensure Tools is always in the nav even if Prismic settings don't include it
  const rawNavItems: { label: string; link: string }[] = settings.data.navigationItems || [];
  const navigationItems = rawNavItems.some((item: any) => item.link === '/tools')
    ? rawNavItems
    : [...rawNavItems, { label: "Tools", link: "/tools" }];

  // Split slices: hero+about first, then blog preview, then skills+contact below
  const allSlices: any[] = homepage.data.slices || [];
  const aboveSlices = allSlices.filter((s: any) => ['hero', 'about'].includes(s.slice_type));
  const belowSlices = allSlices.filter((s: any) => !['hero', 'about'].includes(s.slice_type));

  return (
    <>
      <Header
        siteName={settings.data.siteName || "Sahin Alom"}
        navigationItems={navigationItems}
        socialLinks={socialLinks}
      />

      <main>
        {/* Hero, About, Skills */}
        <SliceZone slices={aboveSlices} components={components} />

        {/* Latest Insights — between About/Skills and Contact */}
        <section id="blog" className="py-20 bg-[var(--surface)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--card-border)] to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--card-border)] to-transparent" />

          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
              <div>
                <span className="skills-title mb-3 inline-block">From the Blog</span>
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)]">Latest Insights</h2>
              </div>
              <a
                href="/blog"
                className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-[var(--accent-hover)] font-semibold text-sm transition-colors group"
              >
                View all articles
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>

            <FeaturedPostsGrid posts={blogPosts.slice(0, 3)} variant="grid" />
          </div>
        </section>

        {/* Contact and remaining slices */}
        <SliceZone slices={belowSlices} components={components} />
      </main>

      <Footer footerText={settings.data.footerText} />

      {/* Inject social icons into hero and contact sections */}
      <SocialIcons socialLinks={socialLinks} targetId="hero-social-icons" />
      <SocialIcons socialLinks={socialLinks} targetId="contact-social-icons" />
    </>
  );

}

export async function generateMetadata() {
  const client = createClient();
  const homepage = await client.getSingle("homepage").catch(() => null);

  return {
    title: homepage?.data?.meta_title || "Sahin Alom - Electrical Engineer",
    description: homepage?.data?.meta_description || "Electrical Engineer based in Bangladesh.",
    openGraph: {
      images: [homepage?.data?.meta_image?.url || ""],
    },
  };
}
