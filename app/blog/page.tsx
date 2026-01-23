import { createClient } from "@/prismicio";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogListingClient from "./BlogListingClient";
import "./blog.css";

export default async function BlogPage() {
    const client = createClient();

    // Fetch blog listing page data
    const blogListing: any = await client.getSingle("blog_listing").catch(() => ({
        data: {
            page_title: "Blog",
            page_description: [{ type: "paragraph", text: "Thoughts on design, development, and systems thinking.", spans: [] }],
            meta_title: "Blog - Sahin Alom",
            meta_description: "Articles and insights on UX design, development, and systems thinking."
        }
    }));

    // Fetch all blog posts
    const blogPosts = await client.getAllByType("blog_post", {
        orderings: [
            { field: "my.blog_post.publish_date", direction: "desc" }
        ]
    }).catch(() => []);

    // Fetch settings for header/footer
    const settings: any = await client.getSingle("settings" as any).catch(() => ({
        data: {
            siteName: "Sahin Alom",
            navigationItems: [
                { label: "Home", link: "#home" },
                { label: "About", link: "#about" },
                { label: "Skills", link: "#skills" },
                { label: "Resume", link: "/resume" },
                { label: "Blog", link: "/blog" },
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

            <main className="blog-main">
                <BlogListingClient
                    posts={blogPosts}
                    pageTitle={blogListing.data.page_title || "Blog"}
                    pageDescription={blogListing.data.page_description}
                />
            </main>

            <Footer footerText={settings.data.footerText} />
        </>
    );
}

export async function generateMetadata() {
    const client = createClient();
    const blogListing = await client.getSingle("blog_listing").catch(() => null);

    return {
        title: blogListing?.data?.meta_title || "Blog - Sahin Alom",
        description: blogListing?.data?.meta_description || "Articles and insights on UX design, development, and systems thinking.",
        openGraph: {
            images: [blogListing?.data?.meta_image?.url || ""],
        },
    };
}
