# Job Tracker UI

Frontend for the Job Tracker API — built with Next.js, TypeScript, and Tailwind CSS.

**Live:** https://job-tracker-ui-iota.vercel.app  
**API:** https://job-tracker-api-production-5674.up.railway.app  
**API Docs:** https://job-tracker-api-production-5674.up.railway.app/api/docs  
**API Repo:** https://github.com/MastaR-svg/job-tracker-api

## Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Axios with JWT interceptor and auto-refresh

## Features
- Landing page
- Register / Login with validation
- Dashboard with analytics
- Job list with search, filter, sort, pagination
- Job detail with edit and resume upload
- Protected routes with auth context

## Quick Start
\`\`\`bash
npm install
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL
npm run dev
\`\`\`
