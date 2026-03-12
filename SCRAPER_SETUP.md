# Instagram Profile Scraper Setup Guide

## 🎯 Overview

Your Instagram profile analyzer now includes a real scraping implementation that can fetch actual profile data including:

- ✅ Username & Full Name
- ✅ Bio & Profile Picture
- ✅ Followers, Following, Post Count
- ✅ Verification Status
- ✅ Account Type (Private/Public)
- ✅ Engagement Rate
- ✅ Average Likes & Comments
- ✅ Recent Captions & Hashtags

## 🚀 Quick Start

### Method 1: No API Key Required (Public Web Scraping)

The scraper will automatically use Instagram's public web API without any configuration. This method:
- ✅ Works immediately with no setup
- ✅ No API key required
- ⚠️ Less reliable (Instagram may block requests)
- ⚠️ Limited rate (use cautiously)

**Just run your app and it will work!**

```bash
npm run dev
```

### Method 2: RapidAPI (Recommended for Production)

For reliable, production-ready scraping:

1. **Sign up for RapidAPI**
   - Go to [RapidAPI.com](https://rapidapi.com/)
   - Create a free account

2. **Subscribe to Instagram Scraper API**
   - Visit: [Instagram Scraper API](https://rapidapi.com/sparktech-sparktech-default/api/instagram-scraper-api3)
   - Click "Subscribe to Test"
   - Choose a plan:
     - **Free**: 100 requests/month
     - **Basic**: $10/month for 1,000 requests
     - **Pro**: $30/month for 10,000 requests

3. **Get Your API Key**
   - After subscribing, copy your API key from the "Code Snippets" section
   - Look for `X-RapidAPI-Key` header value

4. **Configure Environment Variables**
   ```bash
   # Copy the example file
   cp .env.example .env.local
   
   # Edit .env.local and add your key
   RAPIDAPI_KEY=your_api_key_here
   INSTAGRAM_SCRAPER_METHOD=rapidapi
   ```

5. **Run Your App**
   ```bash
   npm run dev
   ```

### Method 3: Apify (Alternative)

1. **Sign up for Apify**
   - Go to [Apify.com](https://apify.com/)
   - Create account (free tier includes $5 credit/month)

2. **Get API Token**
   - Go to [Integrations](https://console.apify.com/account/integrations)
   - Copy your API token

3. **Configure**
   ```bash
   # In .env.local
   APIFY_API_TOKEN=your_token_here
   INSTAGRAM_SCRAPER_METHOD=apify
   ```

## 📋 Configuration Options

### Environment Variables

Create a `.env.local` file in your project root:

```bash
# Scraper Method
# Options: auto, public, rapidapi, rapidapi-alt, apify
INSTAGRAM_SCRAPER_METHOD=auto

# RapidAPI (if using)
RAPIDAPI_KEY=your_rapidapi_key

# Apify (if using)
APIFY_API_TOKEN=your_apify_token
```

### Scraper Methods Explained

| Method | Requires API Key | Reliability | Speed | Cost |
|--------|------------------|-------------|-------|------|
| `auto` | No (tries all) | High (fallbacks) | Medium | Free → Paid |
| `public` | No | Medium | Fast | Free |
| `rapidapi` | Yes | Very High | Fast | $0-$30/mo |
| `rapidapi-alt` | Yes | High | Fast | $0-$30/mo |
| `apify` | Yes | Very High | Slow | $5/mo credit |

**Recommendation:**
- **Development**: Use `auto` mode (no config needed)
- **Production**: Use `rapidapi` with a paid plan

## 🔧 Testing

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)

3. Enter a public Instagram username (e.g., `instagram`, `cristiano`, `selenagomez`)

4. View the scraped profile data and AI analysis!

## 🐛 Troubleshooting

### "All scraping methods failed"

**Solution 1: Private Account**
- The profile might be private. The scraper only works with public profiles.

**Solution 2: Rate Limiting**
- If using public method, you may be rate-limited by Instagram
- Solution: Wait 5-10 minutes or use RapidAPI

**Solution 3: Invalid Username**
- Double-check the username is correct
- The scraper will validate format automatically

### "RAPIDAPI_KEY not configured"

Make sure:
1. You created `.env.local` (not `.env.example`)
2. The variable name is exactly `RAPIDAPI_KEY`
3. You restarted the dev server after adding the key

### Poor Engagement Data

Some scraping methods provide limited engagement metrics:
- `public` and `rapidapi` methods: Full engagement data
- `rapidapi-alt`: Limited to average metrics
- `apify`: Full engagement data

## 📊 API Response Example

```json
{
  "success": true,
  "data": {
    "username": "cristiano",
    "fullName": "Cristiano Ronaldo",
    "bio": "SIUUUbscribe to my YouTube channel",
    "profilePicUrl": "https://...",
    "followers": 643000000,
    "following": 567,
    "postsCount": 3600,
    "isVerified": true,
    "isPrivate": false,
    "engagementRate": 2.45,
    "avgLikes": 8500000,
    "avgComments": 125000,
    "overallScore": 9.2,
    "summary": "Excellent profile! Strong engagement...",
    "categories": [...],
    "improvements": [...]
  }
}
```

## 🔐 Security Notes

- Never commit `.env.local` to version control
- `.env.local` is already in `.gitignore`
- Keep your API keys private
- Rotate keys if accidentally exposed

## 💰 Cost Optimization

### RapidAPI Free Tier (100 requests/month)

- **Enough for**: Testing, personal projects, low-traffic sites
- **Optimization**: Cache results, limit to verified users

### Scaling Up

For high-traffic production:

1. **Caching Strategy**
   - Cache profile data for 1-24 hours
   - Use Redis or database caching
   - Implement rate limiting

2. **Upgrade Plan**
   - RapidAPI Pro: $30/month = 10,000 requests
   - Equivalent to ~330 requests/day

3. **Smart Scraping**
   - Only scrape when user explicitly requests
   - Don't auto-refresh on every page load

## 📚 Additional Features (Coming Soon)

The infrastructure supports future enhancements:

- ✨ AI-powered insights using GPT-4/Gemini/Claude
- 📈 Historical data tracking
- 🎯 Competitor comparison
- 📊 Advanced analytics dashboard
- 🔔 Engagement alerts

To enable AI analysis, add to `.env.local`:
```bash
OPENAI_API_KEY=your_openai_key
# or
GEMINI_API_KEY=your_gemini_key
# or
ANTHROPIC_API_KEY=your_claude_key
```

## 🆘 Support

If you encounter issues:

1. Check the browser console for errors
2. Check the server terminal for logs (scraper outputs debug info)
3. Verify profile is public on Instagram
4. Try different scraper methods in `.env.local`

## 📄 License & Legal

⚠️ **Important**: 
- This tool is for educational/personal use
- Respect Instagram's Terms of Service
- Don't use for spam, harassment, or commercial scraping at scale
- Rate limit your requests appropriately
- Consider Instagram's official API for commercial use

## 🎉 You're Ready!

Your Instagram profile scraper is now fully configured. Start analyzing profiles and building awesome features! 🚀
