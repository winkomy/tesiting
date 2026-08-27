# WINKO upgrade checklist

## Fidelity ledger

- [x] Official WINKO logo is used as one unchanged image asset: `index_html_files/opengraph.webp`.
- [x] Original WINKO product images are used for all eight product routes.
- [x] The homepage hero uses the original sectional tank image as the reliable static fallback.
- [x] No generated image is used as production product imagery, logo artwork, certification artwork, or project evidence.
- [x] No unsupported project locations, client names, awards, dates, or certification badges were added.
- [x] The production page now uses the real Three.js / OrbitControls / GSAP / ScrollTrigger architecture with the authentic WINKO image retained as a failure fallback.

## Content and brand

- [x] Company: Jutarama Industries (M) Sdn Bhd.
- [x] Email: sales@winko.my.
- [x] Phone: +603-8727 7540.
- [x] Address: No. 19, Kawasan Perindustrian Mega 2, Jln Mega 2/1, 43500 Semenyih, Selangor, Malaysia.
- [x] WhatsApp: https://wa.me/60105161368.
- [x] Eight products are visible and linked from the homepage and Products page.
- [x] Homepage uses the official CTA labels: GET FREE QUOTATION and EXPLORE PRODUCTS.
- [x] Why WINKO uses the six original reasons and large numbered rows.
- [x] Countries We Serve restores Africa, Middle East, Maldives, Malaysia, Thailand, Cambodia, Vietnam, Singapore, Indonesia, and the Philippines.
- [x] Homepage statistics restored from the supplied original source: 30 Years of Experience, 5000+ Projects Completed, 20 Years+ Product Durability, and 15+ Country Cover.
- [x] Sustainability section uses the original repository eco graphic and food-grade graphic, with claims scoped by material/product family.
- [x] Countries We Serve uses the full original WINKO market list and includes an accessible text list alongside the map.
- [x] Project gallery uses an explicit ordered dataset and scoped lightbox navigation.
- [ ] TODO: the repository has no machine-readable project specification table, per-image project mapping, business hours, or verified map embed URL. Do not infer these values from photographs.
- [ ] TODO: confirm whether the existing source term “Sprinkle Tanks” should be “Sprinkler Tanks”; the current wording is intentionally preserved.
- [x] News page is truthful and does not present fabricated dates, articles, subscriptions, or fake CMS behavior.
- [x] Quotation form opens an email draft and does not claim a message was sent.

## Motion and interaction

- [x] Product switching uses opacity and scale motion at 550ms with no tilt.
- [x] Reveal motion is restrained and disabled for reduced-motion users.
- [x] Mobile navigation has a keyboard-accessible toggle, Escape close, and focus loop.
- [x] Assembly stage buttons update the visible stage label in static-fallback mode.
- [x] WebGL-only controls are hidden until the scene initializes; the static fallback remains visible if initialization fails.
- [x] The tank has a 4 × 3 base/roof grid, dense external flange bolt lines, one cloned canonical pressed-sheet panel, L-angle stay groups, cleats, roof truss, external ladder/handholds, sloped rectangular manhole, vent, level indicator, and dark steel pipework.
- [x] Every wall panel has an explicit outward pressed-face normal; every roof panel has its pressed face downward and its flat face upward.
- [x] Exploded view moves organized component groups without flipping the roof; internal structure mode moves/fades only the nearest front/right wall groups.
- [x] `3d-validation.html?debug3d=panel|roof|roof-underside|accessories|structure|complete|exploded` isolates the required geometry checks.

## Responsive QA

- [x] 375px: no horizontal overflow; eight product selectors present.
- [x] 430px: no horizontal overflow; mobile navigation available.
- [x] 768px: no horizontal overflow; compact navigation available.
- [x] 1024px: desktop navigation and two-column content fit.
- [x] 1440px: hero composition and product presentation fit.
- [x] 1920px: max-width container and footer remain aligned.
- [x] Browser console: no errors or warnings during the final matrix pass.
- [x] Desktop 3D states visually inspected: canonical panel, complete tank, flat roof top, pressed roof underside, accessories, internal angle-stay network, and exploded tank.
- [x] Assembly stages 09, 10, and 12 were exercised in the live renderer; internal/exploded controls return to the completed state.

## SEO and delivery

- [x] Canonical URLs and Open Graph metadata are present on primary pages.
- [x] Organization JSON-LD is present on the homepage.
- [x] Existing sitemap and robots files are preserved.
- [x] All primary pages share the same header, footer, logo, contact data, and WhatsApp route.
