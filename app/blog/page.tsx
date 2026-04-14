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
            page_description: [{ type: "paragraph", text: "Thoughts on electrical engineering, industrial maintenance, and systems stability.", spans: [] }],
            meta_title: "Blog - Sahin Alom",
            meta_description: "Articles and insights on electrical engineering and industrial maintenance."
        }
    }));

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

    // Fetch settings for header/footer
    const settings: any = await client.getSingle("settings" as any).catch(() => ({
        data: {
            siteName: "Sahin Alom",
            navigationItems: [
                { label: "Home", link: "#home" },
                { label: "About", link: "#about" },
                { label: "Skills", link: "#skills" },
                { label: "Resume", link: "/resume" },
                { label: "Tools", link: "/tools" },
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
        description: blogListing?.data?.meta_description || "Articles and insights on electrical engineering and industrial maintenance.",
        openGraph: {
            images: [blogListing?.data?.meta_image?.url || ""],
        },
    };
}
