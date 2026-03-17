import { NextRequest, NextResponse } from 'next/server';
import type { AnalysisResult, AnalysisAPIResponse } from '@/lib/types';
import { scrapeInstagramProfile } from '@/lib/instagram-scraper';

/* ═══════════════════════════════════════════════════
   POST /api/analyze
   Accepts { username } → returns AI-powered analysis

   Uses real Instagram scraping with multiple fallback methods
   AI scoring can be enhanced with OpenAI/Gemini/Claude
   ═══════════════════════════════════════════════════ */

// ──── Real AI analysis using DeepSeek-V3.2 via NVIDIA NIM ────
async function analyzeWithAI(profileData: any): Promise<Omit<AnalysisResult, 'username' | 'profilePicUrl' | 'fullName' | 'followers' | 'following' | 'postsCount' | 'isVerified'>> {
    const apiKey = process.env.NVIDIA_API_KEY;

    if (!apiKey) {
        throw new Error('NVIDIA_API_KEY is not configured');
    }

    const payload = {
        model: "deepseek-ai/deepseek-v3.2", // Using the specific DeepSeek V3.2 model requested
        messages: [
            {
                role: "system",
                content: "You are an elite social media growth expert. Analyze the provided Instagram profile data and return a detailed, high-intelligence audit in JSON format. Be critical but constructive. Ensure the JSON strictly follows the required schema."
            },
            {
                role: "user",
                content: `Analyze this Instagram profile:
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
Return ONLY the JSON object, no other text.`
            }
        ],
        max_tokens: 1024,
        temperature: 0.7,
        response_format: { type: "json_object" }
    };

    try {
        const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[NVIDIA NIM] API Error: ${response.status} - ${errorText}`);
            throw new Error(`AI Analysis failed with status ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        // Ensure content is valid JSON
        try {
            return JSON.parse(content);
        } catch (parseError) {
            console.error("[NVIDIA NIM] JSON Parse Error:", content);
            throw new Error("Invalid response format from AI");
        }
    } catch (error) {
        console.error(`[NVIDIA NIM] Fetch Error:`, error);
        throw error;
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
