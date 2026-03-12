/* ═══════════════════════════════════════════════════
   Shared types for Instagram Profile Analysis
   ═══════════════════════════════════════════════════ */

/** Raw Instagram profile data fetched from API */
export interface ProfileData {
    username: string;
    fullName: string;
    bio: string;
    profilePicUrl: string;
    followers: number;
    following: number;
    postsCount: number;
    isVerified: boolean;
    isPrivate: boolean;
    accountType: 'Personal' | 'Professional' | 'Business';
    engagementRate: number;
    avgLikes: number;
    avgComments: number;
    recentCaptions: string[];
    recentHashtags: string[];
    website: string;
    externalUrl: string;
    categoryName: string;
    address: string;
}

/** A single category in the breakdown grid */
export interface CategoryBreakdown {
    title: string;
    score: number;       // 0–100
    insight: string;
    icon: string;        // emoji
}

/** A single improvement recommendation */
export interface Improvement {
    title: string;
    suggestions: string[];
    priority: 'high' | 'medium' | 'low';
    icon: string;        // emoji
}

/** Full AI analysis result returned from /api/analyze */
export interface AnalysisResult {
    username: string;
    profilePicUrl: string;
    fullName: string;
    followers: number;
    following: number;
    postsCount: number;
    isVerified: boolean;
    overallScore: number;  // 0–10
    summary: string;
    categories: CategoryBreakdown[];
    improvements: Improvement[];
    // Additional scraped data
    bio?: string;
    isPrivate?: boolean;
    accountType?: 'Personal' | 'Professional' | 'Business';
    engagementRate?: number;
    avgLikes?: number;
    avgComments?: number;
    recentCaptions?: string[];
    recentHashtags?: string[];
    website?: string;
    externalUrl?: string;
    categoryName?: string;
    address?: string;
}

/** API response envelope */
export interface AnalysisAPIResponse {
    success: boolean;
    data?: AnalysisResult;
    error?: string;
}
