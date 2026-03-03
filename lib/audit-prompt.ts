export const SEO_AUDIT_SYSTEM_PROMPT = `You are an expert SEO auditor with 15+ years of experience and deep knowledge of Google's ranking factors, Core Web Vitals, and modern SEO best practices. Your job is to perform comprehensive, accurate audits of websites.

IMPORTANT: You MUST use web search to actually visit and analyze the target website. Do not guess or fabricate data. Search for the URL, examine what you find, and base your analysis on real observations.`;

export function buildAuditUserPrompt(url: string): string {
  return `Perform a comprehensive SEO audit of this website: ${url}

First, search for and access this website to gather real data about its structure, content, and technical implementation.

Then return your analysis as a JSON object with EXACTLY this structure. Return ONLY valid JSON with no markdown and no code blocks:

{
  "url": "${url}",
  "overallScore": <number 0-100>,
  "summary": "<2-3 sentence executive summary>",
  "categories": {
    "technical": { "score": <0-100>, "issues": [...] },
    "onpage": { "score": <0-100>, "issues": [...] },
    "content": { "score": <0-100>, "issues": [...] },
    "performance": { "score": <0-100>, "issues": [...] },
    "mobile": { "score": <0-100>, "issues": [...] },
    "security": { "score": <0-100>, "issues": [...] }
  },
  "topPriorities": ["<top 3-5 most impactful fixes>"]
}

Each issue object must have:
{ "title": "Short descriptive title", "severity": "critical" | "warning" | "good" | "info", "description": "Detailed explanation referencing specific elements found on the site", "recommendation": "Specific, actionable fix" }

COMPREHENSIVE AUDIT CHECKLIST - evaluate every applicable item:

TECHNICAL SEO:
- HTTPS/SSL certificate validity and enforcement
- URL structure: clean, short, keyword-rich slugs (no dates, excessive query params, or deep nesting)
- URL standardization: consistent www vs non-www, trailing slash consistency
- Canonical tags: present, correct, self-referencing where needed
- Robots.txt: accessible, not blocking important content (CSS/JS/images)
- XML Sitemap: present, valid, submitted to search engines
- HTML Sitemap: present for visitors and bots
- Redirect chains or loops (301/302 usage); verify HTTP response is 200 on main pages
- Crawlability: no orphan pages, all important pages reachable within 3 clicks
- Structured data / Schema.org markup (JSON-LD for articles, breadcrumbs, organization, FAQ)
- Hreflang implementation (if multilingual)
- Clean internal link architecture: under 100-150 links per page
- HTML validation: clean, semantic HTML5 code
- Breadcrumb navigation with schema markup
- 404 error handling: custom 404 page, no broken internal links
- Next/previous pagination links or rel=prev/next
- No important content inside iframes, Flash, or hidden by JavaScript

ON-PAGE SEO:
- Title tag: exists, 50-60 characters, primary keyword at the beginning, unique per page
- Meta description: exists, 150-160 characters, compelling with CTA, unique per page
- Title and meta description should NOT be too similar to each other
- H1: exactly one per page, contains primary keyword, slightly different from title tag
- Header hierarchy: H1 > H2 > H3 properly nested (H1-H3 minimum)
- Image alt attributes on all images with descriptive keyword-rich text
- Image descriptions/captions where appropriate
- Internal linking: sufficient links to important pages, relevant anchor text surrounded by content
- Diversified internal link anchor text (avoid over-optimization)
- URL slug optimization: short, keyword-rich, no dates
- Open Graph tags: og:title, og:description, og:image, og:type
- Twitter Card tags
- Favicon and touch icons (apple-touch-icon)
- Logo present and properly linked
- No meta keywords tag (deprecated, can signal outdated SEO)
- Keyword in first 100 words of main content
- rel="nofollow" on external commercial/affiliate links
- Table of contents for long-form content

CONTENT QUALITY:
- Content depth: word count and comprehensiveness for the topic (300 words minimum, 1000+ ideal)
- E-E-A-T signals: author info, credentials, about page, contact info, trust signals
- Keyword targeting: primary keyword focus per page, semantic relevance, no keyword stuffing
- Content freshness: recent publish/update dates, regularly maintained
- Readability: short paragraphs, subheadings, bullet lists, bold for scanning (not keyword highlighting)
- Duplicate content risk: unique content that adds value beyond what exists elsewhere
- Multimedia usage: images, video, infographics to extend time on page
- Above-the-fold content quality: no large ads pushing content down
- Text-to-HTML ratio: sufficient text content vs code
- Content-first HTML structure: main content appears before sidebar in source code
- Category pages have descriptions (300+ words ideal)
- Related posts/articles shown to reduce bounce rate
- Outbound links to reputable, authoritative sources
- Social sharing buttons available
- Comments section for engagement (if applicable, spam-free)
- No thin pages: every indexed page has substantial unique content
- Content not hidden in responsive/mobile views

PERFORMANCE:
- Page load time estimate: target under 3 seconds
- Image optimization: WebP/AVIF format, compression, proper dimensions, lazy loading
- CSS/JS minification, bundling, and deferring
- Core Web Vitals: LCP under 2.5s, INP under 200ms, CLS under 0.1
- Render-blocking resources identification
- Font loading: font-display swap, limited font files
- Third-party script bloat assessment
- CDN usage for static assets
- Browser caching headers (Cache-Control, ETag)
- Server response time: fast TTFB
- Images not organized in excessive subdirectories
- Code cleanliness: no inline styles, semantic HTML, minimal plugin/builder bloat

MOBILE & UX:
- Viewport meta tag configuration
- Responsive design: works across all device sizes
- No content hidden in responsive mode that is visible on desktop
- Touch target sizing: minimum 48x48px
- Font sizing for mobile: minimum 16px base
- No horizontal overflow/scroll
- Mobile navigation: hamburger menu, easy to use
- Breadcrumb navigation present
- Clear calls-to-action above the fold
- No intrusive interstitials or large pop-ups
- Site architecture: logical, thematic category structure
- Main navigation: concise (5-7 primary links)
- Custom 404 page that helps visitors find content
- Bounce rate optimization: engaging layout, related content, fast loading
- Cross-device consistency: looks great on desktop, tablet, and mobile
- Unique, professional design (not generic template look)
- Pagination: reasonable number of items per page

SECURITY:
- HTTPS across all pages with valid SSL certificate
- No mixed content: all resources loaded over HTTPS
- HSTS header (Strict-Transport-Security)
- Content-Security-Policy header
- X-Frame-Options / X-Content-Type-Options headers
- Secure cookie attributes: Secure, HttpOnly, SameSite
- No exposed sensitive information in source code
- Server response codes correct (200 for pages, proper 301s for redirects)

THINGS TO FLAG:
- Any black hat techniques: cloaking, hidden text, doorway pages
- Keyword stuffing in content, titles, or anchor text
- Duplicate H1, title, and URL patterns across pages
- Excessive site-wide links
- Author archives creating duplicate content (single-author sites)
- Too many tags creating thin/duplicate tag pages

SCORING GUIDELINES:
- 90-100: Excellent, minor tweaks only
- 70-89: Good, some notable improvements needed
- 50-69: Fair, significant issues to address
- Below 50: Poor, critical problems blocking SEO performance

Generate 5-8 issues per category with a realistic mix of severities. Be SPECIFIC and reference actual elements, tag content, word counts, and real observations from the site.`;
}
