/* ═══════════════════════════════════════════════════
   Instagram Profile Scraper
   Supports multiple scraping methods for flexibility
   ═══════════════════════════════════════════════════ */

import type { ProfileData } from './types';

// Type definitions for Instagram API responses
interface InstagramPost {
    node: {
        edge_liked_by?: { count: number };
        edge_media_to_comment?: { count: number };
        edge_media_to_caption?: {
            edges: Array<{ node: { text: string } }>;
        };
    };
}

interface Instagram120Post {
    like_count?: number;
    comment_count?: number;
    caption?: {
        text: string;
    };
    owner?: { is_verified?: boolean };
    user?: { is_verified?: boolean };
}

interface ApifyPost {
    likesCount?: number;
    likes_count?: number;
    commentsCount?: number;
    comments_count?: number;
    caption?: string;
    edge_liked_by?: { count: number };
    edge_media_to_comment?: { count: number };
    edge_media_to_caption?: {
        edges: Array<{ node: { text: string } }>;
    };
}

interface ApifyProfileData {
    username?: string;
    fullName?: string;
    full_name?: string;
    followersCount?: number;
    followers_count?: number;
    followingCount?: number;
    following_count?: number;
    postsCount?: number;
    posts_count?: number;
    mediaCount?: number;
    biography?: string;
    bio?: string;
    isVerified?: boolean;
    is_verified?: boolean;
    verified?: boolean;
    isPrivate?: boolean;
    is_private?: boolean;
    private?: boolean;
    isBusinessAccount?: boolean;
    is_business_account?: boolean;
    isProfessionalAccount?: boolean;
    is_professional_account?: boolean;
    profilePicUrl?: string;
    profile_pic_url?: string;
    profilePicUrlHd?: string;
    latestPosts?: ApifyPost[];
    external_url?: string;
    externalUrl?: string;
    category_name?: string;
    categoryName?: string;
    city_name?: string;
    address_street?: string;
    business_address_json?: { city_name?: string; street_address?: string };
    [key: string]: unknown;
}

/** Determine account type from API flags */
function getAccountType(data: Record<string, unknown>): 'Personal' | 'Professional' | 'Business' {
    if (data.is_business_account || data.is_business) return 'Business';
    if (data.is_professional_account || data.is_professional) return 'Professional';
    // Some APIs use category_enum or account_type
    if (data.account_type === 'BUSINESS') return 'Business';
    if (data.account_type === 'MEDIA_CREATOR' || data.account_type === 'CREATOR') return 'Professional';
    return 'Personal';
}

/**
 * Method 1: RapidAPI Instagram120
 * API: https://rapidapi.com/azharalimirjat/api/instagram120
 * Best for: Fast, reliable profile + posts data
 * Uses /api/instagram/profile for user info, /api/instagram/posts for engagement
 */
async function scrapeWithInstagram120(username: string): Promise<ProfileData> {
    const apiKey = process.env.RAPIDAPI_KEY;

    if (!apiKey) {
        throw new Error('RAPIDAPI_KEY not configured');
    }

    const headers = {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'instagram120.p.rapidapi.com',
        'Content-Type': 'application/json'
    };

    // Step 1: Fetch profile info via dedicated profile endpoint
    const profileResponse = await fetch('https://instagram120.p.rapidapi.com/api/instagram/profile', {
        method: 'POST',
        headers,
        body: JSON.stringify({ username })
    });

    if (!profileResponse.ok) {
        const errorText = await profileResponse.text();
        console.error('[Instagram120] Profile error:', errorText);
        throw new Error(`Instagram120 profile API error: ${profileResponse.status} ${profileResponse.statusText}. Response: ${errorText}`);
    }

    const profileJson = await profileResponse.json();
    console.log('[Instagram120] Profile response keys:', Object.keys(profileJson));

    // Extract user object from various response shapes
    const user = profileJson.result?.user || profileJson.result || profileJson.data?.user || profileJson.data || profileJson.user || profileJson;

    if (!user || (!user.username && !user.full_name && !user.follower_count && !user.edge_followed_by)) {
        console.error('[Instagram120] Profile data:', JSON.stringify(profileJson, null, 2).substring(0, 1000));
        throw new Error('Could not extract profile data from Instagram120 API');
    }

    console.log('[Instagram120] Extracted user:', JSON.stringify({
        username: user.username, full_name: user.full_name,
        follower_count: user.follower_count, following_count: user.following_count,
        media_count: user.media_count, is_verified: user.is_verified,
        is_business_account: user.is_business_account,
        biography: (user.biography || '').substring(0, 80),
        profile_pic_url: (user.profile_pic_url || '').substring(0, 60) + '...',
    }));

    // Step 2: Fetch posts for engagement calculation
    let avgLikes = 0;
    let avgComments = 0;
    let recentCaptions: string[] = [];
    let recentHashtags: string[] = [];

    try {
        const postsResponse = await fetch('https://instagram120.p.rapidapi.com/api/instagram/posts', {
            method: 'POST',
            headers,
            body: JSON.stringify({ username, maxId: '' })
        });

        if (postsResponse.ok) {
            const postsData = await postsResponse.json();
            const responseData = postsData.result || postsData.data || postsData;

            // Posts may be in edges[].node, items[], or directly
            let posts: Instagram120Post[] = [];
            if (responseData.edges) {
                posts = responseData.edges.map((e: { node: Instagram120Post }) => e.node || e);
            } else if (responseData.items) {
                posts = responseData.items;
            } else if (Array.isArray(responseData)) {
                posts = responseData;
            }

            console.log(`[Instagram120] Found ${posts.length} posts for engagement`);

            if (posts.length > 0) {
                const recentPosts = posts.slice(0, 12);
                const totalLikes = recentPosts.reduce((sum: number, post: Instagram120Post) =>
                    sum + (post.like_count || 0), 0);
                const totalComments = recentPosts.reduce((sum: number, post: Instagram120Post) =>
                    sum + (post.comment_count || 0), 0);

                avgLikes = Math.floor(totalLikes / recentPosts.length);
                avgComments = Math.floor(totalComments / recentPosts.length);

                recentCaptions = recentPosts
                    .map((post: Instagram120Post) => post.caption?.text)
                    .filter((text): text is string => Boolean(text))
                    .slice(0, 5);

                const allText = recentCaptions.join(' ');
                const hashtagMatches = allText.match(/#[\w]+/g) || [];
                recentHashtags = Array.from(new Set(hashtagMatches)).slice(0, 10) as string[];

                // Try to glean is_verified from post owner info, since profile info strips it
                for (const post of recentPosts) {
                    if (post.owner?.is_verified !== undefined) {
                        user.is_verified = post.owner.is_verified;
                        break;
                    } else if (post.user?.is_verified !== undefined) {
                        user.is_verified = post.user.is_verified;
                        break;
                    }
                }
            }
        }
    } catch (postsError) {
        console.warn('[Instagram120] Posts fetch failed (non-critical):', postsError);
    }

    const followers = user.follower_count || user.edge_followed_by?.count || 0;
    const engagementRate = followers > 0 && avgLikes > 0
        ? parseFloat(((avgLikes + avgComments) / followers * 100).toFixed(2))
        : 0;

    return {
        username: user.username || username,
        fullName: user.full_name || user.name || username,
        bio: user.biography || user.bio || '',
        profilePicUrl: user.profile_pic_url_hd || user.profile_pic_url || user.hd_profile_pic_url_info?.url || '',
        followers: followers,
        following: user.following_count || user.edge_follow?.count || 0,
        postsCount: user.media_count || user.edge_owner_to_timeline_media?.count || 0,
        isVerified: user.is_verified || false,
        isPrivate: user.is_private || false,
        accountType: getAccountType(user),
        engagementRate,
        avgLikes,
        avgComments,
        recentCaptions,
        recentHashtags,
        website: user.external_url || user.bio_links?.[0]?.url || '',
        externalUrl: user.external_url || '',
        categoryName: user.category_name || user.category || '',
        address: user.city_name || user.address_street || (user.business_address_json ? `${user.business_address_json.street_address || ''} ${user.business_address_json.city_name || ''}`.trim() : ''),
    };
}

/**
 * Method 2: RapidAPI Instagram Scraper API3
 * Sign up at: https://rapidapi.com/
 * API: https://rapidapi.com/sparktech-sparktech-default/api/instagram-scraper-api3
 */
async function scrapeWithRapidAPI(username: string): Promise<ProfileData> {
    const apiKey = process.env.RAPIDAPI_KEY;

    if (!apiKey) {
        throw new Error('RAPIDAPI_KEY not configured');
    }

    const url = `https://instagram-scraper-api3.p.rapidapi.com/profile_info?username=${username}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'instagram-scraper-api3.p.rapidapi.com'
        }
    });

    if (!response.ok) {
        throw new Error(`RapidAPI error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !data.data) {
        throw new Error('Invalid response from Instagram API');
    }

    const profile = data.data;

    // Extract and calculate engagement metrics
    const posts = (profile.edge_owner_to_timeline_media?.edges || []) as InstagramPost[];
    const recentPosts = posts.slice(0, 12);

    const avgLikes = recentPosts.length > 0
        ? Math.floor(
            recentPosts.reduce((sum: number, post: InstagramPost) => sum + (post.node.edge_liked_by?.count || 0), 0) /
            recentPosts.length
        )
        : 0;

    const avgComments = recentPosts.length > 0
        ? Math.floor(
            recentPosts.reduce((sum: number, post: InstagramPost) => sum + (post.node.edge_media_to_comment?.count || 0), 0) /
            recentPosts.length
        )
        : 0;

    const followers = profile.edge_followed_by?.count || 0;
    const engagementRate = followers > 0
        ? parseFloat(((avgLikes + avgComments) / followers * 100).toFixed(2))
        : 0;

    // Extract recent captions and hashtags
    const recentCaptions = recentPosts
        .map((post: InstagramPost) => post.node.edge_media_to_caption?.edges?.[0]?.node?.text)
        .filter((text): text is string => Boolean(text))
        .slice(0, 5);

    const recentHashtags = Array.from(
        new Set(
            recentCaptions
                .join(' ')
                .match(/#\w+/g)
                ?.slice(0, 20) || []
        )
    ).slice(0, 10) as string[];

    return {
        username: profile.username,
        fullName: profile.full_name || profile.username,
        bio: profile.biography || '',
        profilePicUrl: profile.profile_pic_url_hd || profile.profile_pic_url || '',
        followers: followers,
        following: profile.edge_follow?.count || 0,
        postsCount: profile.edge_owner_to_timeline_media?.count || 0,
        isVerified: profile.is_verified || false,
        isPrivate: profile.is_private || false,
        accountType: getAccountType(profile),
        engagementRate,
        avgLikes,
        avgComments,
        recentCaptions,
        recentHashtags,
        website: profile.external_url || '',
        externalUrl: profile.external_url || '',
        categoryName: profile.category_name || '',
        address: profile.city_name || profile.address_street || '',
    };
}

/**
 * Method 3: Alternative RapidAPI - Instagram Bulk Profile Scraper
 * API: https://rapidapi.com/restyler/api/instagram-bulk-profile-scrapper
 */
async function scrapeWithAlternativeAPI(username: string): Promise<ProfileData> {
    const apiKey = process.env.RAPIDAPI_KEY;

    if (!apiKey) {
        throw new Error('RAPIDAPI_KEY not configured');
    }

    const url = `https://instagram-bulk-profile-scrapper.p.rapidapi.com/clients/api/ig/ig_profile?ig=${username}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'instagram-bulk-profile-scrapper.p.rapidapi.com'
        }
    });

    if (!response.ok) {
        throw new Error(`Alternative API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
        throw new Error('Profile not found');
    }

    const profile = data[0];

    // Calculate engagement rate
    const followers = profile.follower_count || 0;
    const avgLikes = profile.average_likes || 0;
    const avgComments = profile.average_comments || 0;
    const engagementRate = followers > 0
        ? parseFloat(((avgLikes + avgComments) / followers * 100).toFixed(2))
        : 0;

    return {
        username: profile.username,
        fullName: profile.full_name || profile.username,
        bio: profile.biography || '',
        profilePicUrl: profile.profile_pic_url || '',
        followers: followers,
        following: profile.following_count || 0,
        postsCount: profile.media_count || 0,
        isVerified: profile.is_verified || false,
        isPrivate: profile.is_private || false,
        accountType: getAccountType(profile),
        engagementRate,
        avgLikes,
        avgComments,
        recentCaptions: [],
        recentHashtags: [],
        website: profile.external_url || '',
        externalUrl: profile.external_url || '',
        categoryName: profile.category_name || '',
        address: profile.city_name || profile.address_street || '',
    };
}

/**
 * Method 4: Apify Instagram Scraper
 * Sign up at: https://apify.com/
 * Actor: https://apify.com/apify/instagram-scraper
 */
async function scrapeWithApify(username: string): Promise<ProfileData> {
    const apiKey = process.env.APIFY_API_TOKEN;

    if (!apiKey) {
        throw new Error('APIFY_API_TOKEN not configured');
    }

    // Use a working Instagram scraper actor
    // Actor IDs with slashes need URL encoding: slash (/) becomes %2F
    const actorId = 'zuzka%2Finstagram-scraper';

    // Start the actor - pass Instagram profile URL
    const runResponse = await fetch(
        `https://api.apify.com/v2/acts/${actorId}/runs?token=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                directUrls: [`https://www.instagram.com/${username}/`],
                resultsType: 'details',
                resultsLimit: 1
            })
        }
    );

    if (!runResponse.ok) {
        const errorText = await runResponse.text();
        console.error('[Apify] Start error:', errorText);
        throw new Error(`Apify start error: ${runResponse.status}`);
    }

    const runData = await runResponse.json();
    const runId = runData.data.id;
    const datasetId = runData.data.defaultDatasetId;

    console.log(`[Apify] Run started - ID: ${runId}`);

    // Wait for the run to complete (poll every 3 seconds, max 2 minutes)
    let attempts = 0;
    const maxAttempts = 40; // 2 minutes total
    let runStatus;

    while (attempts < maxAttempts) {
        await new Promise(r => setTimeout(r, 3000));

        const statusResponse = await fetch(
            `https://api.apify.com/v2/acts/${actorId}/runs/${runId}?token=${apiKey}`
        );

        runStatus = await statusResponse.json();

        console.log(`[Apify] Status check ${attempts + 1}/${maxAttempts}: ${runStatus.data.status}`);

        if (runStatus.data.status === 'SUCCEEDED') {
            console.log('[Apify] Run succeeded!');
            break;
        } else if (runStatus.data.status === 'FAILED' || runStatus.data.status === 'ABORTED') {
            const errorMsg = runStatus.data.error || 'Unknown error';
            throw new Error(`Apify scraping ${runStatus.data.status.toLowerCase()}: ${errorMsg}`);
        }

        attempts++;
    }

    if (attempts >= maxAttempts) {
        throw new Error('Apify scraping timeout (exceeded 2 minutes). The profile may be private or have too many posts.');
    }

    // Get the results from dataset
    const resultsResponse = await fetch(
        `https://api.apify.com/v2/datasets/${datasetId}/items?token=${apiKey}`
    );

    if (!resultsResponse.ok) {
        throw new Error(`Failed to fetch Apify results: ${resultsResponse.status}`);
    }

    const results = await resultsResponse.json();

    console.log(`[Apify] Retrieved ${results.length} items from dataset`);

    if (!results || results.length === 0) {
        throw new Error('No data returned from Apify. The profile may be private or doesn\'t exist.');
    }

    // Apify Profile Scraper returns proper profile data
    const profile = results[0] as ApifyProfileData;

    console.log('[Apify] Full profile data:', JSON.stringify(profile, null, 2));
    console.log('[Apify] Available keys:', Object.keys(profile).join(', '));

    // Extract profile data - Profile scraper has consistent field names
    const username2: string = (profile.username || username) as string;
    const fullName: string = (profile.fullName || profile.full_name || username2) as string;
    const followers: number = (profile.followersCount || profile.followerscount || 0) as number;
    const following: number = (profile.followingCount || profile.followsCount || profile.followingcount || 0) as number;
    const postsCount: number = (profile.postsCount || profile.mediaCount || 0) as number;
    const bio: string = (profile.biography || profile.bio || '') as string;
    const isVerified: boolean = (profile.isVerified || profile.verified || false) as boolean;
    const isPrivate: boolean = (profile.isPrivate || profile.private || false) as boolean;
    const profilePicUrl: string = (profile.profilePicUrl || profile.profilePicUrlHd || '') as string;

    // Get latest posts for engagement if available
    const latestPosts = (profile.latestPosts || []) as ApifyPost[];
    let avgLikes = 0;
    let avgComments = 0;
    let recentCaptions: string[] = [];
    let recentHashtags: string[] = [];

    if (latestPosts.length > 0) {
        const posts = latestPosts.slice(0, 5);
        const totalLikes = posts.reduce((sum: number, post) =>
            sum + (post.likesCount || post.likes_count || post.edge_liked_by?.count || 0), 0);
        const totalComments = posts.reduce((sum: number, post) =>
            sum + (post.commentsCount || post.comments_count || post.edge_media_to_comment?.count || 0), 0);

        avgLikes = posts.length > 0 ? Math.floor(totalLikes / posts.length) : 0;
        avgComments = posts.length > 0 ? Math.floor(totalComments / posts.length) : 0;

        recentCaptions = posts
            .map((post) => post.caption || post.edge_media_to_caption?.edges?.[0]?.node?.text)
            .filter((caption): caption is string => Boolean(caption))
            .slice(0, 5);

        const allText = recentCaptions.join(' ');
        const hashtagMatches = allText.match(/#[\w]+/g) || [];
        recentHashtags = Array.from(new Set(hashtagMatches)).slice(0, 10) as string[];
    }

    // Calculate engagement rate
    const engagementRate = followers > 0 && avgLikes > 0
        ? parseFloat(((avgLikes + avgComments) / followers * 100).toFixed(2))
        : 0;

    console.log('[Apify] Extracted REAL data:', {
        username: username2,
        fullName,
        followers,
        following,
        postsCount,
        bio: bio.substring(0, 50) + '...',
        isVerified,
        isPrivate,
        avgLikes,
        avgComments,
        engagementRate
    });

    return {
        username: username2,
        fullName: fullName,
        bio: bio,
        profilePicUrl: profilePicUrl,
        followers: followers,
        following: following,
        postsCount: postsCount,
        isVerified: isVerified,
        isPrivate: isPrivate,
        accountType: getAccountType(profile as unknown as Record<string, unknown>),
        engagementRate: engagementRate,
        avgLikes,
        avgComments,
        recentCaptions,
        recentHashtags,
        website: (profile.externalUrl || profile.external_url || '') as string,
        externalUrl: (profile.externalUrl || profile.external_url || '') as string,
        categoryName: (profile.categoryName || profile.category_name || '') as string,
        address: (profile.city_name || profile.address_street || (profile.business_address_json ? `${profile.business_address_json.street_address || ''} ${profile.business_address_json.city_name || ''}`.trim() : '')) as string,
    };
}

/**
 * Method 5: Instagram Public Web Scraper (No API key needed)
 * Uses Instagram's public web endpoint
 * Note: This is less reliable and may break if Instagram changes their structure
 */
async function scrapeWithPublicWeb(username: string): Promise<ProfileData> {
    try {
        const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`;

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'X-Ig-App-Id': '936619743392459',
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Instagram API returned ${response.status}`);
        }

        const data = await response.json();
        const user = data?.data?.user;

        if (!user) {
            throw new Error('User not found');
        }

        // Calculate engagement metrics from recent posts
        const posts = (user.edge_owner_to_timeline_media?.edges || []) as InstagramPost[];
        const recentPosts = posts.slice(0, 12);

        const totalLikes = recentPosts.reduce(
            (sum: number, post: InstagramPost) => sum + (post.node.edge_liked_by?.count || 0),
            0
        );
        const totalComments = recentPosts.reduce(
            (sum: number, post: InstagramPost) => sum + (post.node.edge_media_to_comment?.count || 0),
            0
        );

        const avgLikes = recentPosts.length > 0 ? Math.floor(totalLikes / recentPosts.length) : 0;
        const avgComments = recentPosts.length > 0 ? Math.floor(totalComments / recentPosts.length) : 0;

        const followers = user.edge_followed_by?.count || 0;
        const engagementRate = followers > 0
            ? parseFloat(((avgLikes + avgComments) / followers * 100).toFixed(2))
            : 0;

        // Extract captions and hashtags
        const recentCaptions = recentPosts
            .map((post: InstagramPost) => post.node.edge_media_to_caption?.edges?.[0]?.node?.text)
            .filter((text): text is string => Boolean(text))
            .slice(0, 5);

        const allText = recentCaptions.join(' ');
        const hashtagMatches = allText.match(/#[\w]+/g) || [];
        const recentHashtags = Array.from(new Set(hashtagMatches)).slice(0, 10) as string[];

        return {
            username: user.username,
            fullName: user.full_name || user.username,
            bio: user.biography || '',
            profilePicUrl: user.profile_pic_url_hd || user.profile_pic_url || '',
            followers: followers,
            following: user.edge_follow?.count || 0,
            postsCount: user.edge_owner_to_timeline_media?.count || 0,
            isVerified: user.is_verified || false,
            isPrivate: user.is_private || false,
            accountType: getAccountType(user),
            engagementRate,
            avgLikes,
            avgComments,
            recentCaptions,
            recentHashtags,
            website: user.external_url || '',
            externalUrl: user.external_url || '',
            categoryName: user.category_name || '',
            address: user.city_name || user.address_street || '',
        };
    } catch (error) {
        throw new Error(`Public web scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Main scraper function that tries multiple methods with fallbacks
 */
export async function scrapeInstagramProfile(username: string): Promise<ProfileData> {
    const method = process.env.INSTAGRAM_SCRAPER_METHOD || 'auto';

    // Single method mode
    if (method === 'instagram120') {
        return await scrapeWithInstagram120(username);
    } else if (method === 'rapidapi') {
        return await scrapeWithRapidAPI(username);
    } else if (method === 'rapidapi-alt') {
        return await scrapeWithAlternativeAPI(username);
    } else if (method === 'apify') {
        return await scrapeWithApify(username);
    } else if (method === 'public') {
        return await scrapeWithPublicWeb(username);
    }

    // Auto mode: Try methods in order until one succeeds
    const errors: string[] = [];

    // Try RapidAPI methods first if configured (most reliable)
    if (process.env.RAPIDAPI_KEY) {
        // Try Instagram120 first (fastest and most reliable)
        try {
            console.log('[Scraper] Trying Instagram120 API...');
            const result = await scrapeWithInstagram120(username);
            console.log('[Scraper] ✓ Instagram120 method succeeded');
            return result;
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Unknown error';
            console.log(`[Scraper] ✗ Instagram120 method failed: ${msg}`);
            errors.push(`Instagram120: ${msg}`);
        }

        // Try original RapidAPI scraper
        try {
            console.log('[Scraper] Trying RapidAPI Scraper API3...');
            const result = await scrapeWithRapidAPI(username);
            console.log('[Scraper] ✓ RapidAPI Scraper API3 succeeded');
            return result;
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Unknown error';
            console.log(`[Scraper] ✗ RapidAPI Scraper API3 failed: ${msg}`);
            errors.push(`RapidAPI-API3: ${msg}`);
        }

        // Try alternative RapidAPI
        try {
            console.log('[Scraper] Trying alternative RapidAPI method...');
            const result = await scrapeWithAlternativeAPI(username);
            console.log('[Scraper] ✓ Alternative RapidAPI succeeded');
            return result;
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Unknown error';
            console.log(`[Scraper] ✗ Alternative RapidAPI failed: ${msg}`);
            errors.push(`RapidAPI-Alt: ${msg}`);
        }
    }

    // Try public web scraping (no API key needed)
    try {
        console.log('[Scraper] Trying public web method...');
        const result = await scrapeWithPublicWeb(username);
        console.log('[Scraper] ✓ Public web method succeeded');
        return result;
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Unknown error';
        console.log(`[Scraper] ✗ Public web method failed: ${msg}`);
        errors.push(`Public: ${msg}`);
    }

    // Try Apify if configured
    if (process.env.APIFY_API_TOKEN) {
        try {
            console.log('[Scraper] Trying Apify method...');
            const result = await scrapeWithApify(username);
            console.log('[Scraper] ✓ Apify method succeeded');
            return result;
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Unknown error';
            console.log(`[Scraper] ✗ Apify method failed: ${msg}`);
            errors.push(`Apify: ${msg}`);
        }
    }

    // All methods failed
    console.error('[Scraper] All scraping methods failed:', errors);
    throw new Error(
        `Failed to scrape Instagram profile. Tried ${errors.length} method(s). ` +
        `Errors: ${errors.join('; ')}`
    );
}
