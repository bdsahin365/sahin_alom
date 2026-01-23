"use client";

import { useState, useEffect } from "react";
import BlogCard from "@/components/Blog/BlogCard";
import SearchBar from "@/components/Blog/SearchBar";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import "@/components/ui/shape-landing-hero.css";
import { FeaturedPostsGrid } from "@/components/Blog/FeaturedPostsGrid";

interface BlogListingClientProps {
    posts: any[];
    pageTitle: string;
    pageDescription: any;
}

export default function BlogListingClient({
    posts,
    pageTitle,
    pageDescription
}: BlogListingClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [filteredPosts, setFilteredPosts] = useState(posts);

    useEffect(() => {
        let filtered = posts;

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(post =>
                post.data.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.data.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory !== "All") {
            filtered = filtered.filter(post => post.data.category === selectedCategory);
        }

        setFilteredPosts(filtered);
    }, [searchQuery, selectedCategory, posts]);

    const description = pageDescription && pageDescription[0]
        ? pageDescription[0].text
        : "Thoughts on design, development, and systems thinking.";

    return (
        <>
            {/* Hero Section with HeroGeometric */}
            <HeroGeometric
                badge="Sahin Alom"
                title1="Blog"
                title2="& Insights"
                description={description}
            >
                <FeaturedPostsGrid posts={posts} />
            </HeroGeometric>
        </>
    );
}
