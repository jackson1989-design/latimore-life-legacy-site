# Deployment notes

1. Set your GA4 Measurement ID in `js/config.js`:
   - `window.LLL_GA_ID = "G-XXXXXXXXXX";`

2. Update `js/config.js` and the `sitemap.xml` / `robots.txt` placeholders:
   - Replace `https://example.com` with your real site URL.

3. Re-generate sitemap if you add/remove pages:
   - Update `sitemap.xml` accordingly (each <loc> must be an absolute URL).
