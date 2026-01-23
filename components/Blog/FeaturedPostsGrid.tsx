"use client";

import { motion } from "framer-motion";
import BlogCard from "@/components/Blog/BlogCard";

interface FeaturedPostsGridProps {
    posts: any[];
}

export function FeaturedPostsGrid({ posts }: FeaturedPostsGridProps) {
    if (!posts || posts.length === 0) return null;

    // Take only the first 3 posts
    const displayPosts = posts.slice(0, 3);

    return (
        <div className="featured-posts-grid-container">
            <div className="featured-posts-grid">
                {displayPosts.map((post, index) => (
                    <motion.div
                        key={post.id}
                        className="featured-post-item"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                    >
                        <BlogCard
                            uid={post.uid}
                            title={post.data.title}
                            excerpt={post.data.excerpt}
                            featuredImage={post.data.featured_image}
                            category={post.data.category}
                            publishDate={post.data.publish_date}
                            content={post.data.content}
                            variant="dark"
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
