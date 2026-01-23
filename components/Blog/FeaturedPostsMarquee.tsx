"use client";

import { motion } from "framer-motion";
import BlogCard from "@/components/Blog/BlogCard";

interface FeaturedPostsMarqueeProps {
    posts: any[];
}

export function FeaturedPostsMarquee({ posts }: FeaturedPostsMarqueeProps) {
    if (!posts || posts.length === 0) return null;

    // Duplicate posts to create seamless loop
    const marqueePosts = [...posts, ...posts, ...posts];

    return (
        <div className="featured-posts-marquee">
            <div className="marquee-gradient-left"></div>
            <div className="marquee-gradient-right"></div>

            <motion.div
                className="marquee-track"
                animate={{
                    x: [0, "-33.33%"]
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >
                {marqueePosts.map((post, index) => (
                    <div key={`${post.id}-${index}`} className="marquee-item">
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
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
