import { createClient } from "@/prismicio";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PrismicRichText } from "@prismicio/react";
import { calculateReadingTime, formatDate, getCategoryColor } from "@/lib/blogUtils";
import Image from "next/image";

import { filter } from "@prismicio/client";
import { FeaturedPostsGrid } from "@/components/Blog/FeaturedPostsGrid";
import "../blog.css";


export default async function BlogPostPage({ params }: { params: Promise<{ uid: string }> }) {
    const client = createClient();
    const { uid } = await params;

    // Fetch the blog post
    const post = await client.getByUID("blog_post", uid).catch(() => null);

    if (!post) {
        notFound();
    }

    // Fetch related posts (exclude current)
    const relatedPosts = await client.getAllByType("blog_post", {
        limit: 3,
        orderings: [{ field: "my.blog_post.publish_date", direction: "desc" }],
        filters: [
            filter.not("my.blog_post.uid", uid)
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

    const readingTime = calculateReadingTime(post.data.content);
    const formattedDate = formatDate(post.data.publish_date);
    const categoryColors = getCategoryColor(post.data.category);

    return (
        <>
            <Header
                siteName={settings.data.siteName || "Sahin Alom"}
                navigationItems={settings.data.navigationItems || []}
                socialLinks={socialLinks}
            />

            <main className="blog-post-template">
                <article className="blog-post-article">
                    <header className="blog-post-header">
                        <div className="blog-post-meta-top">
                            <span
                                className="blog-category-label"
                                style={{
                                    color: categoryColors.text
                                }}
                            >
                                {post.data.category}
                            </span>
                            <span className="meta-dot">·</span>
                            <time className="meta-date">{formattedDate}</time>
                            <span className="meta-dot">·</span>
                            <span className="meta-read-time">{readingTime} min read</span>
                        </div>

                        <h1 className="blog-title">{post.data.title}</h1>

                        {post.data.excerpt && (
                            <p className="blog-excerpt">{post.data.excerpt}</p>
                        )}

                        {post.data.author_name && (
                            <div className="blog-author-block">
                                {post.data.author_avatar?.url && (
                                    <Image
                                        src={post.data.author_avatar.url}
                                        alt={post.data.author_name}
                                        width={40}
                                        height={40}
                                        className="author-avatar"
                                    />
                                )}
                                <div className="author-info">
                                    <span className="author-name">{post.data.author_name}</span>
                                </div>
                            </div>
                        )}
                    </header>

                    {post.data.featured_image?.url && (
                        <figure className="blog-featured-image-container">
                            <Image
                                src={post.data.featured_image.url}
                                alt={post.data.featured_image.alt || post.data.title}
                                width={1200}
                                height={630}
                                priority
                                className="blog-featured-image"
                                sizes="(max-width: 768px) 100vw, 900px"
                            />
                        </figure>
                    )}

                    <div className="blog-content-body">
                        <PrismicRichText field={post.data.content} />
                    </div>
                </article>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <section className="blog-related-section">
                        <div className="related-header">
                            <h2 className="related-title">Read Next</h2>
                            <a href="/blog" className="view-all-link">View all posts</a>
                        </div>
                        <FeaturedPostsGrid posts={relatedPosts} />
                    </section>
                )}
            </main>

            <Footer footerText={settings.data.footerText} />
        </>
    );
}

export async function generateMetadata({ params }: { params: Promise<{ uid: string }> }) {
    const client = createClient();
    const { uid } = await params;
    const post = await client.getByUID("blog_post", uid).catch(() => null);

    if (!post) {
        return {
            title: "Post Not Found",
        };
    }

    return {
        title: post.data.meta_title || post.data.title,
        description: post.data.meta_description || post.data.excerpt,
        openGraph: {
            images: [post.data.meta_image?.url || post.data.featured_image?.url || ""],
        },
    };
}

export async function generateStaticParams() {
    const client = createClient();
    const posts = await client.getAllByType("blog_post").catch(() => []);

    return posts.map((post) => ({
        uid: post.uid,
    }));
}
