
import { NextRequest, NextResponse } from 'next/server';
import type { AnalysisResult, AnalysisAPIResponse } from '@/lib/types';
import { scrapeInstagramProfile } from '@/lib/instagram-scraper';
import type { ProfileData } from '@/lib/types';

/* ═══════════════════════════════════════════════════
   POST /api/analyze
   Accepts { username } → returns AI-powered analysis

   Uses real Instagram scraping with multiple fallback methods
   AI scoring can be enhanced with OpenAI/Gemini/Claude
   ═══════════════════════════════════════════════════ */

// ──── Real AI analysis using DeepSeek-V3.2 via NVIDIA NIM ────
type NvidiaChatResponse = {
    choices?: Array<{
        message?: {
            content?: string;
        };
    }>;
};

async function analyzeWithAI(profileData: ProfileData): Promise<Omit<AnalysisResult, 'username' | 'profilePicUrl' | 'fullName' | 'followers' | 'following' | 'postsCount' | 'isVerified'>> {
    if (!process.env.NVIDIA_API_KEY) {
        throw new Error('NVIDIA_API_KEY is not configured');
    }

    const systemPrompt = "You are an elite social media growth expert. Analyze the provided Instagram profile data and return a detailed, high-intelligence audit in JSON format. Be critical but constructive. Ensure the JSON strictly follows the required schema.";
    const userPrompt = `Analyze this Instagram profile:
Username: @${profileData.username}
Full Name: ${profileData.fullName}
Bio: ${profileData.bio}
Followers: ${profileData.followers}
Following: ${profileData.following}
Posts: ${profileData.postsCount}
Verified: ${profileData.isVerified}
Engagement Rate: ${profileData.engagementRate}%
Avg Likes: ${profileData.avgLikes}
Avg Comments: ${profileData.avgComments}
Recent Captions: ${profileData.recentCaptions?.join(' | ') || 'N/A'}
Recent Hashtags: ${profileData.recentHashtags?.join(', ') || 'N/A'}
Category: ${profileData.categoryName || 'N/A'}

Return a JSON object with this exact structure:
{
    "overallScore": number (0-10, one decimal),
    "summary": "detailed 2-3 sentence overview",
    "categories": [
        { "title": "Content Quality", "score": 0-100, "insight": "...", "icon": "📸" },
        { "title": "Engagement Rate", "score": 0-100, "insight": "...", "icon": "💬" },
        { "title": "Bio & Profile", "score": 0-100, "insight": "...", "icon": "✍️" },
        { "title": "Posting Consistency", "score": 0-100, "insight": "...", "icon": "📅" },
        { "title": "Hashtag Strategy", "score": 0-100, "insight": "...", "icon": "#️⃣" },
        { "title": "Growth Potential", "score": 0-100, "insight": "...", "icon": "🚀" }
    ],
    "improvements": [
        { "title": "...", "suggestions": ["...", "...", "..."], "priority": "high"|"medium"|"low", "icon": "..." }
    ]
}
Return ONLY the JSON object, no other text.`;

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'openai/gpt-oss-120b',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 1,
            top_p: 1,
            max_tokens: 4096,
            stream: false,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[NVIDIA NIM] Request failed:', response.status, errorText);
        throw new Error(`NVIDIA API request failed with status ${response.status}`);
    }

    const completion = await response.json() as NvidiaChatResponse;
    const content = completion.choices?.[0]?.message?.content;
    try {
        return JSON.parse(content || '{}');
    } catch {
        console.error("[NVIDIA NIM] JSON Parse Error:", content);
        throw new Error("Invalid response format from AI");
    }
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
