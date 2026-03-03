export const SEO_AUDIT_SYSTEM_PROMPT = `You are an expert SEO auditor with deep knowledge of Google's ranking factors, Core Web Vitals, and modern SEO best practices. Your job is to perform comprehensive, accurate audits of websites.

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

AUDIT CHECKLIST:

TECHNICAL SEO: HTTPS/SSL validity, URL structure, canonical tags, robots.txt, XML Sitemap, redirect chains, crawlability, structured data / Schema.org (JSON-LD), hreflang, internal link architecture.

ON-PAGE SEO: Title tag (50-60 chars, keyword), meta description (150-160 chars), H1 (exactly one), header hierarchy, image alt text, internal linking, URL slugs, Open Graph tags, Twitter Cards, favicon.

CONTENT QUALITY: Content depth and word count, E-E-A-T signals, keyword targeting, content freshness, readability, duplicate content risk, multimedia usage, above-the-fold quality.

PERFORMANCE: Page load time (<3s), image optimization (WebP/AVIF, lazy loading), CSS/JS minification, Core Web Vitals (LCP <2.5s, INP <200ms, CLS <0.1), render-blocking resources, font-display, caching.

MOBILE & UX: Viewport meta, responsive design, touch targets (48x48px min), font sizing (16px min), no horizontal scroll, mobile navigation, breadcrumbs, intrusive interstitials.

SECURITY: HTTPS enforcement, mixed content, HSTS, Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, cookie security (Secure, HttpOnly, SameSite).

SCORING: 90-100 Excellent, 70-89 Good, 50-69 Fair, Below 50 Poor.

Generate 5-8 issues per category with a realistic mix of severities. Be SPECIFIC and reference actual elements found on the site.`;
}
