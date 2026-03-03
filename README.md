# SEO Audit Tool

AI-powered SEO audit tool that analyzes any website across 40+ ranking factors.

Built with Next.js 15, TypeScript, Tailwind CSS, Neon Postgres, Drizzle ORM, and Claude AI.

---

## Architecture

    Browser (React + Tailwind)
        |
        v
    Next.js API Routes (/api/audit, /api/history)
        |          |
        v          v
    Anthropic     Neon Postgres
    Claude API    (Drizzle ORM)
    + Web Search

- **Frontend**: Next.js 15 App Router with React client components
- **API**: Serverless route handlers that call Claude with web search
- **Database**: Neon serverless Postgres via Drizzle ORM
- **Hosting**: Vercel (60s function timeout for audits)

---

## Quick Start (Local)

### Prerequisites

- Node.js 18+
- Anthropic API key (https://console.anthropic.com/)
- Neon Postgres database (https://neon.tech - free tier available)

### Steps

    # 1. Clone and install
    git clone <your-repo-url>
    cd seo-audit-tool
    npm install

    # 2. Configure environment
    cp .env.example .env.local
    # Edit .env.local with your keys:
    #   ANTHROPIC_API_KEY=sk-ant-your-key
    #   DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require

    # 3. Push database schema
    npm run db:push

    # 4. Run
    npm run dev

Open http://localhost:3000

---

## Deploy to Vercel

### Option A: Git Integration (Recommended)

1. Push code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Add environment variables (see table below)
5. Click **Deploy**

Every push to `main` auto-deploys.

### Option B: Vercel CLI

    npm i -g vercel
    vercel login
    vercel          # preview deploy
    vercel --prod   # production deploy

### Required Environment Variables

Set these in **Vercel Dashboard > Settings > Environment Variables**:

| Variable           | Value |
|--------------------|-------|
| `ANTHROPIC_API_KEY`| Your Anthropic API key (`sk-ant-api03-...`) |
| `DATABASE_URL`     | Neon Postgres connection string |

### Function Timeout

The audit endpoint needs up to 60 seconds (Claude + web search). Configured in `vercel.json`. Vercel Hobby (free) supports up to 60s; Pro supports 300s.

---

## Database Setup

### Option A: Neon Directly (Recommended)

1. Create account at https://neon.tech (free tier: 0.5 GB)
2. Create a new project (US East region recommended)
3. Copy the connection string from the dashboard
4. Set it as `DATABASE_URL` in your env

### Option B: Via Vercel Storage

1. In Vercel project, go to **Storage** tab
2. Click **Create Database** > **Neon Serverless Postgres**
3. Vercel auto-sets `DATABASE_URL` - no manual config needed

### Push the Schema

After database is ready, run:

    npm run db:push

This creates two tables:

**`audits`** stores every audit result: id, url, normalized_url, overall_score, summary (text), categories (JSONB with full audit data), top_priorities (JSONB), ip_address, user_agent, duration_ms, created_at.

**`audit_categories`** stores denormalized per-category scores for fast dashboard queries: id, audit_id (FK to audits), category, score, issue_count, critical_count, warning_count.

### Browse Your Data

    npm run db:studio

Opens Drizzle Studio visual database browser.

---

## API Reference

**POST /api/audit** - Run a new audit. Body: `{ "url": "example.com" }`. Returns full audit JSON.

**GET /api/history** - List recent audits. Params: `limit` (max 100), `offset`, `url` (filter).

**GET /api/history/[id]** - Get full audit by ID.

---

## What Gets Audited (40+ Checks)

| Category | Checks |
|----------|--------|
| Technical SEO | HTTPS, URL structure, canonical tags, robots.txt, XML sitemap, redirects, crawlability, structured data, hreflang |
| On-Page SEO | Title tag, meta description, H1/headers, image alt text, internal links, Open Graph, Twitter Cards |
| Content Quality | Depth, E-E-A-T signals, keyword targeting, freshness, readability, duplicate content, multimedia |
| Performance | Core Web Vitals (LCP/INP/CLS), page speed, image optimization, minification, caching |
| Mobile & UX | Viewport, responsive design, touch targets, font sizing, navigation, breadcrumbs |
| Security | HTTPS enforcement, mixed content, HSTS, CSP, X-Frame-Options, cookie security |

---

## Customization

- **Change audit checks**: Edit `lib/audit-prompt.ts`
- **Use a different model**: Change `model` in `app/api/audit/route.ts`
- **Add rate limiting**: IP stored per audit; add `@upstash/ratelimit`
- **Add auth**: Wrap with NextAuth.js or Clerk

---

## Cost Estimates

| Component | Free Tier | Paid |
|-----------|-----------|------|
| Vercel | Hobby (free) | Pro $20/mo |
| Anthropic API | - | ~$0.02-0.04/audit (Sonnet) |
| Neon Postgres | 0.5 GB free | $19/mo for 10 GB |

---

## Project Structure

    seo-audit-tool/
      app/
        api/
          audit/route.ts          # Main audit (calls Claude)
          history/
            route.ts              # List audits
            [id]/route.ts         # Get audit by ID
        globals.css               # Tailwind + animations
        layout.tsx                # Root layout
        page.tsx                  # Main UI
      components/
        CategorySection.tsx       # Category view + filters
        IssueCard.tsx             # Expandable issue card
        LoadingAnimation.tsx      # Progress animation
        PriorityList.tsx          # Top priorities
        ScoreRing.tsx             # Circular score gauge
        SeverityBadge.tsx         # Severity labels
      lib/
        audit-prompt.ts           # Claude prompts
        db/
          index.ts                # DB connection
          schema.ts               # Table schemas
      .env.example
      drizzle.config.ts
      next.config.ts
      package.json
      vercel.json

## License

MIT