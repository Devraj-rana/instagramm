import { NextRequest, NextResponse } from 'next/server';
import type { AnalysisResult, AnalysisAPIResponse } from '@/lib/types';
import { scrapeInstagramProfile } from '@/lib/instagram-scraper';

/* ═══════════════════════════════════════════════════
   POST /api/analyze
   Accepts { username } → returns AI-powered analysis

   Uses real Instagram scraping with multiple fallback methods
   AI scoring can be enhanced with OpenAI/Gemini/Claude
   ═══════════════════════════════════════════════════ */

// ──── Simulated AI analysis ────
async function analyzeWithAI(profileData: Awaited<ReturnType<typeof scrapeInstagramProfile>>): Promise<Omit<AnalysisResult, 'username' | 'profilePicUrl' | 'fullName' | 'followers' | 'following' | 'postsCount' | 'isVerified'>> {
    // TODO: Replace with real AI API call
    // e.g. const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', { ... })

    await new Promise((r) => setTimeout(r, 1000));

    const engRate = profileData.engagementRate;
    const overallScore = parseFloat(Math.min(10, engRate * 1.8 + (profileData.followers > 10000 ? 2 : 0) + Math.random() * 2 + 3).toFixed(1));

    return {
        overallScore,
        summary: overallScore >= 8
            ? `Excellent profile! @${profileData.username} shows strong engagement with a well-optimized presence. Content quality is high and the audience is actively engaged.`
            : overallScore >= 6
                ? `Good foundation! @${profileData.username} has solid metrics with room for optimization. Focus on consistency and engagement tactics to reach the next level.`
                : overallScore >= 4
                    ? `@${profileData.username}'s profile has potential but needs strategic improvements. Key areas like content quality and posting consistency need attention.`
                    : `@${profileData.username}'s profile needs significant work. Focus on the fundamentals — bio optimization, content quality, and engagement strategies.`,
        categories: [
            {
                title: 'Content Quality',
                score: Math.min(100, Math.floor(overallScore * 9 + Math.random() * 15)),
                insight: 'Visual consistency and content originality across recent posts.',
                icon: '📸',
            },
            {
                title: 'Engagement Rate',
                score: Math.min(100, Math.floor(engRate * 18 + Math.random() * 10)),
                insight: `${engRate}% engagement rate — ${engRate > 3 ? 'above' : engRate > 1.5 ? 'at' : 'below'} industry average.`,
                icon: '💬',
            },
            {
                title: 'Bio & Profile',
                score: Math.min(100, Math.floor(overallScore * 8 + Math.random() * 20)),
                insight: 'Bio clarity, call-to-action presence, and profile completeness.',
                icon: '✍️',
            },
            {
                title: 'Posting Consistency',
                score: Math.min(100, Math.floor(overallScore * 7 + Math.random() * 25)),
                insight: 'Regularity and timing optimization of content publishing.',
                icon: '📅',
            },
            {
                title: 'Hashtag Strategy',
                score: Math.min(100, Math.floor(overallScore * 6 + Math.random() * 30)),
                insight: 'Hashtag diversity, relevance, and reach potential.',
                icon: '#️⃣',
            },
            {
                title: 'Growth Potential',
                score: Math.min(100, Math.floor(overallScore * 8 + Math.random() * 18)),
                insight: 'Follower-to-following ratio and audience growth trajectory.',
                icon: '🚀',
            },
        ],
        improvements: [
            {
                title: 'Optimize Posting Schedule',
                suggestions: [
                    'Post during peak hours (11am–1pm and 7pm–9pm) for maximum reach',
                    'Maintain a consistent 4–5 posts per week cadence',
                    'Use Instagram Insights to find your audience\'s active times',
                ],
                priority: 'high',
                icon: '⏰',
            },
            {
                title: 'Enhance Engagement',
                suggestions: [
                    'Reply to comments within the first hour of posting',
                    'Use interactive stickers (polls, questions) in Stories',
                    'Collaborate with creators in your niche for cross-promotion',
                ],
                priority: 'high',
                icon: '🤝',
            },
            {
                title: 'Improve Content Mix',
                suggestions: [
                    'Add more Reels — they get 2x more reach than static posts',
                    'Create carousel posts for educational content (higher saves)',
                    'Experiment with behind-the-scenes and authentic content',
                ],
                priority: 'medium',
                icon: '🎬',
            },
            {
                title: 'Refine Hashtag Strategy',
                suggestions: [
                    'Use a mix of 3–5 large, 10–15 mid-size, and 5–10 niche hashtags',
                    'Rotate hashtag sets to avoid shadowban risks',
                    'Research competitor hashtags for untapped opportunities',
                ],
                priority: 'medium',
                icon: '🏷️',
            },
            {
                title: 'Strengthen Bio & Profile',
                suggestions: [
                    'Add a clear value proposition in the first line of your bio',
                    'Include a compelling call-to-action with link',
                    'Use branded Story Highlights with custom cover images',
                ],
                priority: 'low',
                icon: '✨',
            },
        ],
    };
}

// ──── Route handler ────
export async function POST(request: NextRequest) {
    try {
        const { username } = await request.json();

        if (!username || typeof username !== 'string') {
            return NextResponse.json<AnalysisAPIResponse>(
                { success: false, error: 'Username is required' },
                { status: 400 }
            );
        }

        const sanitized = username.replace(/^@/, '').trim().toLowerCase();

        if (!/^[a-z0-9._]{1,30}$/.test(sanitized)) {
            return NextResponse.json<AnalysisAPIResponse>(
                { success: false, error: 'Invalid Instagram username format' },
                { status: 400 }
            );
        }

        // Step 1: Fetch profile data using real Instagram scraper
        const profileData = await scrapeInstagramProfile(sanitized);

        // Check if profile is private
        if (profileData.isPrivate) {
            return NextResponse.json<AnalysisAPIResponse>(
                { success: false, error: 'This profile is private and cannot be analyzed' },
                { status: 403 }
            );
        }

        // Step 2: Run AI analysis
        const analysis = await analyzeWithAI(profileData);

        // Step 3: Combine and respond
        // Proxy the profile pic URL so the frontend doesn't hit Instagram CORP restrictions
        const origin = request.headers.get('host') || 'localhost:3000';
        const protocol = request.headers.get('x-forwarded-proto') || 'http';
        const proxiedPicUrl = profileData.profilePicUrl
            ? `/api/proxy-image?url=${encodeURIComponent(profileData.profilePicUrl)}`
            : '';

        const result: AnalysisResult = {
            username: profileData.username,
            profilePicUrl: proxiedPicUrl,
            fullName: profileData.fullName,
            followers: profileData.followers,
            following: profileData.following,
            postsCount: profileData.postsCount,
            isVerified: profileData.isVerified,
            // Include all scraped data for visual display
            bio: profileData.bio,
            isPrivate: profileData.isPrivate,
            accountType: profileData.accountType,
            engagementRate: profileData.engagementRate,
            avgLikes: profileData.avgLikes,
            avgComments: profileData.avgComments,
            recentCaptions: profileData.recentCaptions,
            recentHashtags: profileData.recentHashtags,
            website: profileData.website,
            externalUrl: profileData.externalUrl,
            categoryName: profileData.categoryName,
            address: profileData.address,
            ...analysis,
        };

        return NextResponse.json<AnalysisAPIResponse>({ success: true, data: result });
    } catch (error) {
        console.error(`[API] Analysis request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return NextResponse.json<AnalysisAPIResponse>(
            { success: false, error: 'Failed to analyze profile. Please try again.' },
            { status: 500 }
        );
    }
}
