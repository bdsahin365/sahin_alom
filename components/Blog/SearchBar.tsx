"use client";

import { useState, ChangeEvent } from "react";

interface SearchBarProps {
    onSearch: (query: string) => void;
    onCategoryFilter: (category: string) => void;
    selectedCategory: string;
    resultsCount: number;
}

const categories = ["All", "Design", "Development", "AI", "Business", "UX", "Systems"];

export default function SearchBar({
    onSearch,
    onCategoryFilter,
    selectedCategory,
    resultsCount
}: SearchBarProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch(query);
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        onSearch("");
        onCategoryFilter("All");
    };

    return (
        <div className="search-bar-container">
            {/* Search Input */}
            <div className="search-input-wrapper">
                <svg
                    className="search-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-input"
                />
                {searchQuery && (
                    <button
                        onClick={() => {
                            setSearchQuery("");
                            onSearch("");
                        }}
                        className="search-clear-btn"
                        aria-label="Clear search"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                )}
            </div>

            {/* Category Filters */}
            <div className="category-filters">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onCategoryFilter(category)}
                        className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Results Count & Clear */}
            <div className="search-results-info">
                <span className="results-count">
                    {resultsCount} {resultsCount === 1 ? 'article' : 'articles'} found
                </span>
                {(searchQuery || selectedCategory !== "All") && (
                    <button onClick={handleClearFilters} className="clear-filters-btn">
                        Clear filters
                    </button>
                )}
            </div>
        </div>
    );
}
