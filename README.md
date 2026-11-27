# Casa Lumbre — boutique hotel demo (Astro)

Demo site for a fictional 12-room townhouse hotel in Málaga old town, by [Lizzy Cruz](https://lizzymcruz.com). Built from the Figma file
"Casa Lumbre — Brand & Website" (tokens, type and components match the Figma variables and styles).

## Pages
| Spanish (default) | English | Page |
|---|---|---|
| `/` | `/en/` | Home, with the booking bar over the hero |
| `/habitaciones/` | `/en/rooms/` | All rooms |
| `/habitaciones/patio/` … | `/en/rooms/patio/` … | Room pages with photo viewer and booking card |
| `/reservar/` | `/en/book/` | Three-step booking: room, details, confirmation |
| `/privacidad/`, `/aviso-legal/`, `/accesibilidad/` | `/en/privacy/`, `/en/legal/`, `/en/accessibility/` | Text pages (photo credits on the legal page) |

## Structure
- `src/styles/global.css`: Lumbre colour, type and spacing tokens (same names as Figma)
- `src/styles/core.css` + `src/styles/lumbre-ui.css`: shared booking/accessibility components and the Lumbre skin for them
- `src/i18n/ui.ts`: interface copy (ES/EN) · `src/lib/site.ts`: booking words, extras, page paths
- `src/data/rooms.ts`: rooms · `src/data/photos.ts`: Unsplash photos and credits
- `src/lib/core.mjs` + `public/js/core.js`: booking bar, date picker, booking flow, accessibility panel, gallery (shared with the Alqueria Llimona and Casa Azahar demos)

## Built in
- **Booking:** date picker with availability (keyboard and screen-reader friendly, bottom sheet on phones), booking bar on home and room pages, three-step flow with live price summary, extras, inline validation, booking code, add-to-calendar file and "you save vs booking sites"
- **Accessibility panel:** text size up to 150%, high contrast, stop animations, underline links, extra spacing, simpler font; saved per device and applied before the page paints. Follows reduced-motion. Aims for WCAG 2.2 AA.
- **SEO:** canonical + hreflang, Open Graph, Hotel / HotelRoom / BreadcrumbList structured data, sitemap, robots.txt, security and caching headers (`public/_headers`)
- **Motion:** Lenis smooth scroll, hero wordmark write-in, curtain image reveals, parallax display words, rotating collage photos, photo viewer
- **Photos:** Unsplash, loaded from Unsplash's CDN in the right size for each screen
- Two typefaces: EB Garamond and Jost (the wordmark is an SVG drawing)

## Run
```
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
```

## Deploy (Cloudflare Pages)
Framework preset **Astro**, build command `npm run build`, output directory `dist`.

## Next
1. Swap `src/data/rooms.ts` for Storyblok (room, page and settings content types)
2. Wire the newsletter form (e.g. Web3Forms) and connect the booking flow to the hotel's booking engine
