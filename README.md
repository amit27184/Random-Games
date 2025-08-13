Random Game Generator - upgraded version
=====================================

How to deploy:
1. Add this repo to GitHub.
2. Connect repository to Vercel (Import Project).
3. Vercel will detect the `api/` folder and deploy serverless functions automatically.
4. Visit the deployed site. The app fetches games from the Free-to-Play Games API via the serverless function (no CORS issues).

Notes:
- Icons `icon-192.png` and `icon-512.png` are included if provided.
- Service worker caches core assets for offline UX.
