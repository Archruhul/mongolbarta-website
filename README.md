# মঙ্গল বার্তা — Website

A bilingual (Bangla/English) landing page + daily good-news feed. Plain HTML/CSS/JS — no build step needed.

## Files
- `index.html` — the page
- `style.css` — design system (colors, type, layout)
- `script.js` — loads `posts.json` and powers the language toggle
- `posts.json` — **your daily content lives here.** Add a new object to the top of the array each day.
- `assets/logo.svg` — paper-airplane logo placeholder (swap with your real logo file any time)

## Adding a new day's story
Open `posts.json` and add a new block at the top, following the same shape as the existing entries (date, category in Bangla/English, title, excerpt, source).

## Deploy — Option A: No GitHub, drag & drop (fastest)
1. Go to https://vercel.com and sign up (free) with email or Google.
2. Click **Add New → Project**.
3. Choose **"Deploy without Git"** / drag the whole `mongolbarta-site` folder onto the page.
4. Click **Deploy**. You'll get a free `yourproject.vercel.app` link in under a minute.
5. To update the site later (e.g. new posts.json), just drag the folder again — it creates a new deployment.

## Deploy — Option B: GitHub + Vercel (recommended, auto-updates)
1. Create a free account at https://github.com if you don't have one.
2. Create a new repository (e.g. `mongolbarta-website`), public or private.
3. Upload these files to the repo:
   - Easiest: on the repo page, click **Add file → Upload files**, drag in everything from this folder, commit.
   - Or with git from your computer:
     ```
     cd mongolbarta-site
     git init
     git add .
     git commit -m "Initial site"
     git branch -M main
     git remote add origin https://github.com/YOUR-USERNAME/mongolbarta-website.git
     git push -u origin main
     ```
4. Go to https://vercel.com, sign up/log in **with your GitHub account**.
5. Click **Add New → Project**, select the `mongolbarta-website` repo, click **Deploy**.
6. Vercel detects it as a static site automatically — no framework settings needed.
7. From now on, any time you push a change to GitHub (e.g. edit `posts.json` for a new day's story), Vercel redeploys automatically within seconds.

## Custom domain (optional, later)
In the Vercel project → **Settings → Domains**, add your own domain (e.g. `mongolbarta.com`) once you've purchased one from any registrar. Vercel's own hosting stays free; only the domain name itself costs money.
