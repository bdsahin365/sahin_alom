// Blog utility functions

/**
 * Calculate reading time based on word count
 * Average reading speed: 200 words per minute
 */
export function calculateReadingTime(content: any): number {
    if (!content) return 1;

    let text = '';

    // Extract text from Prismic rich text structure
    if (Array.isArray(content)) {
        text = content
            .map((block: any) => block.text || '')
            .join(' ');
    } else if (typeof content === 'string') {
        text = content;
    }

    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);

    return minutes || 1;
}

/**
 * Extract headings from Prismic rich text for table of contents
 */
export function extractHeadings(content: any): Array<{ id: string; text: string; level: number }> {
    if (!Array.isArray(content)) return [];

    return content
        .filter((block: any) =>
            block.type === 'heading2' ||
            block.type === 'heading3'
        )
        .map((block: any, index: number) => ({
            id: `heading-${index}`,
            text: block.text || '',
            level: block.type === 'heading2' ? 2 : 3
        }));
}

/**
 * Format date to readable string
 */
export function formatDate(dateString: string | null | undefined): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    return date.toLocaleDateString('en-US', options);
}

/**
 * Get category color scheme
 */
export function getCategoryColor(category: string | null | undefined): { bg: string; text: string; border: string } {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
        Design: {
            bg: 'rgba(139, 92, 246, 0.1)',
            text: '#8b5cf6',
            border: 'rgba(139, 92, 246, 0.3)'
        },
        Development: {
            bg: 'rgba(59, 130, 246, 0.1)',
            text: '#3b82f6',
            border: 'rgba(59, 130, 246, 0.3)'
        },
        AI: {
            bg: 'rgba(236, 72, 153, 0.1)',
            text: '#ec4899',
            border: 'rgba(236, 72, 153, 0.3)'
        },
        Business: {
            bg: 'rgba(34, 197, 94, 0.1)',
            text: '#22c55e',
            border: 'rgba(34, 197, 94, 0.3)'
        },
        UX: {
            bg: 'rgba(249, 115, 22, 0.1)',
            text: '#f97316',
            border: 'rgba(249, 115, 22, 0.3)'
        },
        Systems: {
            bg: 'rgba(20, 184, 166, 0.1)',
            text: '#14b8a6',
            border: 'rgba(20, 184, 166, 0.3)'
        }
    };

    if (category && colors[category]) {
        return colors[category];
    }

    return {
        bg: 'rgba(107, 114, 128, 0.1)',
        text: '#6b7280',
        border: 'rgba(107, 114, 128, 0.3)'
    };
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}
