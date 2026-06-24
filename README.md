# Eurogrip — Homepage

A bold, motion-rich marketing homepage for **Eurogrip**, the flagship tyre brand of **TVS Srichakra Ltd** (a TVS Mobility Group company). Built for the export market — _"Specialist tyre technology, engineered to outperform."_

> Brand promise: **Outlive · Outperform · Outdo**

## Tech stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS** (v3) with a custom Eurogrip theme + **shadcn/ui** conventions
- **Framer Motion** for scroll reveals, parallax, count-ups and transitions
- Real components from the **[21st.dev](https://21st.dev)** registry

## 21st.dev components used

| Component | Where | Source |
|---|---|---|
| Interactive cobe globe | Global Presence | `@shuding/cobe-globe-interactive` |
| Spotlight cards | Technology | `@berkcangumusisik/spotlight-card` |
| Product Range Card (own) | Product Range | `@senthilindiagit-team/productrangecard` |

## Sections

Hero · Brand Promise · Product Range (6 categories) · Technology · Racing &
Partnership · About the Group · Global Presence · Newsroom · Contact · Footer.
Fully responsive and `prefers-reduced-motion` aware.

## Getting started

```sh
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5180)
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```

> Requires Node.js 20+.

## Deployment

Auto-deploys to **Vercel** on every push to `main` (Framework preset: Vite,
build `npm run build`, output `dist`). The build uses a relative asset base
(`base: './'` in `vite.config.ts`), so the `dist/` folder is also portable to
any static host or sub-path.

## Brand

- **Racing Blue** `#0054a6` · **Eurogrip Red** `#ed1c24` · **Asphalt** `#0d1014`
- Display type: **Saira** (black italic) · Body: **Noto Sans**

## Notes

- Tyre-platform names, OEM logos, rider videos and product photos are
  placeholders (`NAME TBC`) pending final client assets.
- The original single-file HTML prototype lives separately; this React app is
  the current build.

---

© 2026 TVS Srichakra Limited. _Eurogrip_ is a registered trademark.
Built by NewgenDigital.
