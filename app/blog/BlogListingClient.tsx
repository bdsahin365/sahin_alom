"use client";

import { useState } from "react";
import BlogCard from "@/components/Blog/BlogCard";
import SearchBar from "@/components/Blog/SearchBar";
import { PrismicRichText } from "@prismicio/react";

interface BlogListingClientProps {
    posts: any[];
    pageTitle: string;
    pageDescription: any;
}

export default function BlogListingClient({ posts, pageTitle, pageDescription }: BlogListingClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Extract categories
    const categories = ["All", ...Array.from(new Set(posts.map(post => post.data.category))).filter(Boolean)];

    // Filter logic
    const filteredPosts = posts.filter(post => {
        const matchesCategory = selectedCategory === "All" || post.data.category === selectedCategory;
        const matchesSearch = !searchQuery || 
            post.data.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.data.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="blog-listing-container">
            {/* Minimal Header */}
            <div className="blog-hero py-16 md:py-24 text-center border-b border-[var(--divider)]">
                <div className="max-w-4xl mx-auto px-4">
                    <span className="skills-title mb-6 inline-block">Engineering Journal</span>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-[var(--foreground)] mb-8 tracking-tight leading-tight">
                        {pageTitle}
                    </h1>
                    <div className="text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto">
                        <PrismicRichText field={pageDescription} />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-8 relative z-10">
                {/* Search & Filters Section */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-16 px-4 py-2">
                    <div className="category-filters flex flex-wrap gap-2 justify-center md:justify-start">
                        {categories.map((category: any) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                    
                    <div className="w-full md:w-auto relative flex-1 max-w-xs">
                        <SearchBar 
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery} 
                        />
                    </div>
                </div>

                {/* Unified Blog Grid */}
                {filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                        {filteredPosts.map((post) => (
                            <BlogCard
                                key={post.id}
                                uid={post.uid}
                                title={post.data.title}
                                excerpt={post.data.excerpt}
                                featuredImage={post.data.featured_image}
                                category={post.data.category}
                                publishDate={post.data.publish_date}
                                content={post.data.content}
                                variant="grid"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-3xl mb-24">
                        <p className="text-lg text-[var(--text-secondary)] mb-4">No articles found matching your criteria.</p>
                        <button 
                            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                            className="text-[var(--accent)] font-semibold hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
            
            <div className="py-10" />
        </div>
    );
}
