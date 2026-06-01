---
name: Navigation pattern
description: How to navigate between pages in this Next.js app running in Replit proxy
---

Use `window.location.href = "..."` for ALL navigation. Never use `router.push()` or Next.js Link for page transitions.

**Why:** Replit's mTLS proxy blocks RSC payload fetches that Next.js App Router uses for client-side navigation. Silent failures result in pages not loading.

**How to apply:** Both the homepage Investigate button (`app/page.tsx`) and the back button (`app/report/[address]/ReportPageClient.tsx`) already use `window.location.href`. Apply this to any new navigation links added to the app.
