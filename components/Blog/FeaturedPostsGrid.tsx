"use client";

import { motion } from "framer-motion";
import BlogCard from "@/components/Blog/BlogCard";

interface FeaturedPostsGridProps {
    posts: any[];
    variant?: "news" | "grid";
}

export function FeaturedPostsGrid({ posts, variant = "news" }: FeaturedPostsGridProps) {
    if (!posts || posts.length === 0) return null;

    const displayPosts = posts.slice(0, 4);
    const [featured, ...rest] = displayPosts;

    // ─── NEWS LAYOUT (homepage): 1 large featured + list sidebar ───────────
    if (variant === "news") {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 lg:gap-8">
                {/* Featured article — left column */}
                {featured && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <BlogCard
                            uid={featured.uid}
                            title={featured.data.title}
                            excerpt={featured.data.excerpt}
                            featuredImage={featured.data.featured_image}
                            category={featured.data.category}
                            publishDate={featured.data.publish_date}
                            content={featured.data.content}
                            variant="featured"
                        />
                    </motion.div>
                )}

                {/* List articles — right column */}
                {rest.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="flex flex-col gap-1"
                    >
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)] mb-4 px-1 opacity-80">
                            More Articles
                        </p>
                        {rest.map((post: any, index: number) => (
                            <BlogCard
                                key={post.id}
                                uid={post.uid}
                                title={post.data.title}
                                excerpt={post.data.excerpt}
                                featuredImage={post.data.featured_image}
                                category={post.data.category}
                                publishDate={post.data.publish_date}
                                content={post.data.content}
                                variant="list"
                            />
                        ))}
                    </motion.div>
                )}
            </div>
        );
    }

    // ─── GRID LAYOUT (blog listing page): 3-column card grid ───────────────
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPosts.map((post: any, index: number) => (
                <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className="h-full"
                >
                    <BlogCard
                        uid={post.uid}
                        title={post.data.title}
                        excerpt={post.data.excerpt}
                        featuredImage={post.data.featured_image}
                        category={post.data.category}
                        publishDate={post.data.publish_date}
                        content={post.data.content}
                        variant="grid"
                    />
                </motion.div>
            ))}
        </div>
    );
}
