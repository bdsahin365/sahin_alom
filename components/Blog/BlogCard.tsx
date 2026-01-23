"use client";

import Link from "next/link";
import Image from "next/image";
import { calculateReadingTime, getCategoryColor, formatDate } from "@/lib/blogUtils";

interface BlogCardProps {
    uid: string;
    title: string;
    excerpt: string;
    featuredImage: {
        url: string;
        alt: string | null;
    };
    category: string;
    publishDate: string;
    content: any;
    variant?: "default" | "dark";
}

export default function BlogCard({
    uid,
    title,
    excerpt,
    featuredImage,
    category,
    publishDate,
    content,
    variant = "default"
}: BlogCardProps) {
    const readingTime = calculateReadingTime(content);
    const categoryColors = getCategoryColor(category);
    const formattedDate = formatDate(publishDate);

    return (
        <Link href={`/blog/${uid}`} className="blog-card-link">
            <article className={`blog-card ${variant === "dark" ? "blog-card-dark" : ""}`}>
                {/* Featured Image */}
                <div className="blog-card-image-wrapper">
                    {featuredImage?.url && (
                        <Image
                            src={featuredImage.url}
                            alt={featuredImage.alt || title}
                            fill
                            className="blog-card-image"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    )}
                    <div className="blog-card-image-overlay"></div>

                    {/* Category Badge */}
                    <div
                        className="blog-card-category"
                        style={{
                            backgroundColor: categoryColors.bg,
                            color: categoryColors.text,
                            borderColor: categoryColors.border
                        }}
                    >
                        {category}
                    </div>
                </div>

                {/* Content */}
                <div className="blog-card-content">
                    <h3 className="blog-card-title">{title}</h3>
                    <p className="blog-card-excerpt">{excerpt}</p>

                    {/* Metadata */}
                    <div className="blog-card-meta">
                        <time className="blog-card-date">{formattedDate}</time>
                        <span className="blog-card-separator">•</span>
                        <span className="blog-card-reading-time">{readingTime} min read</span>
                    </div>
                </div>

                {/* Hover Effect Gradient */}
                <div className="blog-card-hover-gradient"></div>
            </article>
        </Link>
    );
}
