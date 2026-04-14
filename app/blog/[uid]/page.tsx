import { createClient } from "@/prismicio";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PrismicRichText } from "@prismicio/react";
import { calculateReadingTime, formatDate, getCategoryColor } from "@/lib/blogUtils";
import Image from "next/image";

import { filter } from "@prismicio/client";
import { FeaturedPostsGrid } from "@/components/Blog/FeaturedPostsGrid";
import BlogCard from "@/components/Blog/BlogCard";
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
                <article className="blog-post-article pt-12 md:pt-20">
                    <div className="mb-12">
                        <a 
                            href="/blog" 
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors group"
                        >
                            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Blog
                        </a>
                    </div>

                    <header className="blog-post-header mb-16">
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
                            <div className="flex items-center justify-center gap-4 mt-10 p-6 bg-[var(--surface)] rounded-2xl border border-[var(--card-border)] max-w-sm mx-auto">
                                {post.data.author_avatar?.url && (
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--accent)]/20 shadow-sm">
                                        <Image
                                            src={post.data.author_avatar.url}
                                            alt={post.data.author_name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div className="text-left">
                                    <span className="block text-xs uppercase tracking-widest text-[var(--accent)] font-bold mb-0.5">Author</span>
                                    <span className="block text-base font-bold text-[var(--foreground)]">{post.data.author_name}</span>
                                </div>
                            </div>
                        )}
                    </header>

                    {post.data.featured_image?.url && (
                        <figure className="blog-featured-image-container group mb-16">
                            <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl border border-[var(--card-border)] bg-[var(--surface)]">
                                <Image
                                    src={post.data.featured_image.url}
                                    alt={post.data.featured_image.alt || post.data.title || ""}
                                    fill
                                    priority
                                    className="object-cover group-hover:scale-[1.02] transition-transform duration-1000"
                                    sizes="(max-width: 1200px) 100vw, 1200px"
                                />
                                <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
                            </div>
                        </figure>
                    )}

                    <div className="blog-content-body">
                        <PrismicRichText field={post.data.content} />
                    </div>
                </article>

                {/* Related Posts: More Compact and Nice */}
                {relatedPosts.length > 0 && (
                    <section className="blog-related-section mt-24 border-t border-[var(--divider)] pt-16">
                        <div className="max-w-4xl mx-auto px-4 md:px-6">
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-2xl font-black text-[var(--foreground)] tracking-tight">Read Next</h2>
                                <a href="/blog" className="text-sm font-bold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">
                                    All articles →
                                </a>
                            </div>
                            <div className="flex flex-col gap-2">
                                {relatedPosts.map((rp: any) => (
                                    <BlogCard 
                                        key={rp.id}
                                        uid={rp.uid}
                                        title={rp.data.title}
                                        excerpt={rp.data.excerpt}
                                        featuredImage={rp.data.featured_image}
                                        category={rp.data.category}
                                        publishDate={rp.data.publish_date}
                                        content={rp.data.content}
                                        variant="list" 
                                    />
                                ))}
                            </div>
                        </div>
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
