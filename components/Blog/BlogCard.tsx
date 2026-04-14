"use client";

import Link from "next/link";
import Image from "next/image";
import { calculateReadingTime, getCategoryColor, formatDate } from "@/lib/blogUtils";

interface BlogCardProps {
    uid: string;
    title: string;
    excerpt: string;
    featuredImage: { url: string; alt: string | null };
    category: string;
    publishDate: string;
    content: any;
    variant?: "featured" | "list" | "grid";
}

export default function BlogCard({
    uid, title, excerpt, featuredImage, category, publishDate, content, variant = "grid"
}: BlogCardProps) {
    const readingTime = calculateReadingTime(content);
    const categoryColors = getCategoryColor(category);
    const formattedDate = formatDate(publishDate);

    // ─── FEATURED: large hero card (top of news section) ───────────────────
    if (variant === "featured") {
        return (
            <Link href={`/blog/${uid}`} className="group block">
                <article className="relative rounded-2xl overflow-hidden bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--accent)]/40 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
                    {/* Image */}
                    <div className="relative w-full aspect-[16/9] overflow-hidden bg-[var(--surface)]">
                        {featuredImage?.url ? (
                            <Image
                                src={featuredImage.url}
                                alt={featuredImage.alt || title}
                                fill
                                className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                                sizes="(max-width: 768px) 100vw, 60vw"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center">
                                <span className="text-4xl opacity-30">📰</span>
                            </div>
                        )}
                        {/* Dark gradient for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Category badge */}
                        <span
                            className="absolute top-4 left-4 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-sm"
                            style={{ backgroundColor: categoryColors.bg, color: categoryColors.text, border: `1px solid ${categoryColors.border}` }}
                        >
                            {category}
                        </span>
                    </div>

                    {/* Content below image */}
                    <div className="p-5 md:p-6">
                        <h3 className="text-xl md:text-2xl font-bold text-[var(--foreground)] leading-snug mb-2 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                            {title}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-4">
                            {excerpt}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                            <time className="font-medium">{formattedDate}</time>
                            <span className="w-1 h-1 rounded-full bg-[var(--card-border)]" />
                            <span>{readingTime} min read</span>
                        </div>
                    </div>
                </article>
            </Link>
        );
    }

    // ─── LIST: compact horizontal row item (news list style) ───────────────
    if (variant === "list") {
        return (
            <Link href={`/blog/${uid}`} className="group block">
                <article className="flex gap-4 py-5 border-b border-[var(--divider)] last:border-0 hover:bg-[var(--surface)] transition-all duration-300 -mx-4 px-4 rounded-xl">
                    {/* Thumbnail */}
                    <div className="relative w-24 h-24 md:w-28 md:h-20 rounded-lg overflow-hidden bg-[var(--surface)] shrink-0 shadow-sm">
                        {featuredImage?.url ? (
                            <Image
                                src={featuredImage.url}
                                alt={featuredImage.alt || title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                sizes="112px"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[var(--accent)]/10 to-transparent" />
                        )}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <span
                            className="text-[9px] font-bold uppercase tracking-widest mb-1.5 block opacity-70"
                            style={{ color: categoryColors.text }}
                        >
                            {category}
                        </span>
                        <h3 className="text-sm md:text-base font-bold text-[var(--foreground)] leading-snug line-clamp-2 group-hover:text-[var(--accent)] transition-colors tracking-tight">
                            {title}
                        </h3>
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-[var(--text-secondary)] font-medium">
                            <time>{formattedDate}</time>
                            <span className="w-0.5 h-0.5 rounded-full bg-[var(--text-secondary)] opacity-40" />
                            <span>{readingTime} min read</span>
                        </div>
                    </div>
                </article>
            </Link>
        );
    }

    // ─── GRID: standard vertical card (blog listing page) ──────────────────
    return (
        <Link href={`/blog/${uid}`} className="group block h-full">
            <article className="h-full flex flex-col bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl overflow-hidden hover:border-[var(--accent)]/30 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] transition-all duration-300">
                {/* Image */}
                <div className="relative w-full h-48 overflow-hidden bg-[var(--surface)]">
                    {featuredImage?.url ? (
                        <Image
                            src={featuredImage.url}
                            alt={featuredImage.alt || title}
                            fill
                            className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-amber-500/20 to-amber-600/10" />
                    )}
                    <span
                        className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm"
                        style={{ backgroundColor: categoryColors.bg, color: categoryColors.text, border: `1px solid ${categoryColors.border}` }}
                    >
                        {category}
                    </span>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5">
                    <h3 className="text-base font-bold text-[var(--foreground)] leading-snug mb-2 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                        {title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] line-clamp-3 leading-relaxed flex-1">
                        {excerpt}
                    </p>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[var(--card-border)] text-xs text-[var(--text-secondary)]">
                        <time className="font-medium">{formattedDate}</time>
                        <span>·</span>
                        <span>{readingTime} min read</span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
