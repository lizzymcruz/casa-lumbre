# Casa Lumbre — boutique hotel demo (Astro)

Demo site for a fictional 12-room townhouse hotel in Málaga old town. Built from the Figma file
"Casa Lumbre — Brand & Website" (tokens, type and components match the Figma variables and styles).

## Run
```
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
```

## Pages
| URL | Page |
|---|---|
| `/` | Home (Spanish, default) |
| `/en/` | Home (English) |
| `/habitaciones/patio/`, `/habitaciones/balcon/`, `/habitaciones/suite-lumbre/` | Room pages (ES) |
| `/en/rooms/patio/`, `/en/rooms/balcony/`, `/en/rooms/lumbre-suite/` | Room pages (EN) |

## Structure
- `src/styles/global.css` — colour, type and spacing tokens (same names as Figma)
- `src/i18n/ui.ts` — all interface copy in ES/EN + route helpers
- `src/data/rooms.ts` — room content (moves to Storyblok for a client build; same shape)
- `src/components/` — Header, Footer, Button, SectionLabel, RoomCard, MobileBar, HomePage, RoomPage
- `src/assets/photos/` — AI-generated placeholder photos (replace with stock/real photos before going live)

## Built in
- Astro i18n with hreflang + canonical, Hotel / HotelRoom JSON-LD
- Responsive images (WebP, srcset) via astro:assets, self-hosted fonts (Fontsource)
- Header turns solid on scroll; mobile menu with Escape to close
- Swipe carousels on mobile, sticky booking card (desktop) and booking bar (mobile)
- Booking widget mock: dates → nights × price; no booking is made
- Motion (src/scripts/motion.ts + global.css), all off for prefers-reduced-motion:
  - Lenis smooth scroll
  - parallax display words (LUMBRE / DESPACIO drift against their small lines)
  - curtain image reveals (wipe + settle from zoom) on collage, rooms, ethos, experience tiles
  - rotating collage photos (cross-fade, only while on screen)
  - hero wordmark writes in left to right (wordmark is an SVG outline, so it doesn't delay LCP)
- Lighthouse (local, simulated): home mobile 96 / desktop 98, room mobile 100 / desktop 100;
  accessibility 100, best practices 100. SEO shows 66 only because of the demo `noindex`.
- `noindex` while it's a demo

## Next
1. Deploy to Cloudflare Pages (build `npm run build`, output `dist`)
2. Swap `src/data/rooms.ts` for Storyblok (room, page and settings content types)
3. Replace photos, wire newsletter form (Web3Forms), add legal pages and cookie notice if analytics are added
