import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SocialIcons from "@/components/SocialIcons";

export default async function Home() {
  const client = createClient();

  // Fetch homepage data
  const homepage: any = await client.getSingle("homepage").catch(() => ({
    data: {
      slices: [
        {
          id: "hero_mock",
          slice_type: "hero",
          variation: "default",
          primary: {
            eyebrow: "UX • Systems • AI",
            name: "Sahin Alom",
            headline: [{ type: "heading1", text: "UX Designer with Engineering Systems Thinking", spans: [] }],
            description: [{ type: "paragraph", text: "I combine design thinking with systems engineering principles to create intuitive, scalable digital experiences.", spans: [] }],
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
            headline: [{ type: "heading2", text: "Architecting systems, not just screens.", spans: [] }],
            description: [
              { type: "paragraph", text: "Bridging the gap between vision and execution.", spans: [{ start: 0, end: 46, type: "strong" }] },
              { type: "paragraph", text: "I bring an engineering mindset to creative problems. With a background in Electrical Engineering and hands-on experience building SaaS products, I don't just make things look good—I ensure they work, scale, and drive specific business outcomes.", spans: [] }
            ],
            image: {
              url: "/sahinalom-about.png",
              dimensions: { width: 1920, height: 1080 },
              alt: "Sahin Alom",
              copyright: null,
            }
          },
          items: [
            { title: "SYSTEMIC", description: "Scalable design systems over one-off artifacts." },
            { title: "TECHNICAL", description: "Deep understanding of the code that powers the design." },
            { title: "STRATEGIC", description: "Focus on metrics, conversion, and user retention." }
          ]
        },
        {
          id: "skills_mock",
          slice_type: "skills",
          variation: "default",
          primary: {
            sectionTitle: "Skills",
            intro: "Tools and strengths I use to design, validate, and execute digital systems."
          },
          items: [
            {
              groupTitle: "Design",
              skills: "UI/UX Design, Design Systems, Wireframing, Interaction Design, Visual Hierarchy, Prototyping"
            },
            {
              groupTitle: "Research",
              skills: "User Journeys, Usability Testing, Competitor Analysis, Personas, A/B Testing"
            },
            {
              groupTitle: "Engineering Systems",
              skills: "Systems Thinking, Workflow Optimization, Technical Specs, Scalability, Logical Architecture"
            },
            {
              groupTitle: "AI & Automation",
              skills: "Prompt Engineering, AI Workflows, Cursor/V0, Process Automation, LLM Integration"
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
      meta_title: "Sahin Alom - UX Designer",
      meta_description: "UX Designer with Engineering Systems Thinking",
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

  return (
    <>
      <Header
        siteName={settings.data.siteName || "Sahin Alom"}
        navigationItems={settings.data.navigationItems || []}
        socialLinks={socialLinks}
      />

      <main>
        <SliceZone slices={homepage.data.slices} components={components} />
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
    title: homepage?.data?.meta_title || "Sahin Alom - UX Designer",
    description: homepage?.data?.meta_description || "UX Designer with Engineering Systems Thinking",
    openGraph: {
      images: [homepage?.data?.meta_image?.url || ""],
    },
  };
}
