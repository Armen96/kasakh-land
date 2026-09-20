# KASAKH 910

Single-page property site for the sale of a 910 m² residential plot in Kasakh,
Kotayk Province, Armenia. Angular 21 standalone components, Tailwind CSS v4,
prerendered to static HTML, deployed to Firebase Hosting.

## Editing the listing

Everything an owner normally changes lives in **`src/app/property.config.ts`** —
price, address, boundary lengths, gallery photographs, map URL and contact
details. No component template needs editing.

### Contact details

Each channel renders only when non-null; setting one to `null` hides that
button rather than emitting a dead link, and with all of them `null` the
contact section shows a notice instead.

```ts
contact: {
  phone: '+37498512371',      // E.164
  whatsapp: '37498512371',    // digits only, no '+'
  telegram: '+37498512371',   // username without '@', or a '+374…' number
  email: 'barsegyan96armen@gmail.com',
}
```

### Map

`location.coordinates` holds the verified point (40.223524, 44.467117), and
`mapEmbedUrl` / `mapLinkUrl` are built from the owner's Google Maps share link.
Setting `mapEmbedUrl` back to `null` swaps the embed for a labelled notice and
turns the button into an address search.

### Photographs

Add entries to `gallery`. Only real photographs of the property belong there.

Illustrative material goes in `concepts` instead, which renders as a separate
section carrying the «Պատկերավոր վիզուալիզացիա» badge and a disclaimer that
the images are not an approved project and that any construction or division
of the plot depends on planning rules and permits. Those images are rendered
at their natural aspect ratio because they have "CONCEPT ONLY" burned into the
corners — cropping them would clip that label.

Responsive variants are optional — set `srcset` when they exist, otherwise
`src` is used alone. The hero variants were produced with:

```bash
for w in 640 960; do
  sips -Z $w -s format jpeg -s formatOptions 80 \
    public/images/land-main-top.jpg --out public/images/land-main-top-$w.jpg
done
```

## Commands

```bash
npm install
npm start          # dev server at http://localhost:4200
npm run build      # production build + prerender → dist/kasakh-land/browser
npm test           # unit tests
npm run deploy:dev # build, then deploy to Firebase Hosting
```

## Deployment — Firebase Hosting

`outputMode: "static"` prerenders the page to plain HTML, so Hosting serves
static files with no Node runtime and no SPA rewrites.

Firebase project: **`kasakh-land`**, so the site publishes to
`https://kasakh-land.web.app`. That URL is also set as `siteUrl` in
`property.config.ts` and as the canonical / Open Graph URL in `src/index.html`.

```bash
npm run deploy:dev     # ng build && firebase deploy --only hosting
```

First time on a given machine:

```bash
npm i -g firebase-tools
firebase login         # must be the Google account that owns kasakh-land
```

If the CLI is signed in to a different account, `firebase projects:list` will
not show `kasakh-land` and the deploy fails with a 403. Either sign in as the
owning account, or add it alongside the current one:

```bash
firebase login:add
firebase deploy --only hosting --account <owning-account@gmail.com>
```

To try a build on a temporary URL before touching the live site:

```bash
npm run build
firebase hosting:channel:deploy preview --expires 7d
```

## Private documents

`src/assets/QASAX.pdf` — the state registration certificate — is **gitignored**
and excluded from the build. It contains the owner's name, the certificate
number and its verification password. Do not commit it and do not publish it:
this repository is public. Only the boundary dimensions derived from it appear
on the site.

## Land plan geometry

Taken from the official cadastral plan (ՀՈՂԱՄԱՍԻ ՀԱՏԱԿԱԳԻԾԸ, 1:1000). That
drawing renders sides 1–2 (32.0 m, marked «Ճանապարհի») and 3–4 (15.2 m) both
horizontal, i.e. the plot is a trapezoid with the road frontage parallel to the
rear boundary — which those four lengths do admit. Solving it is exact:

| Corner | Position | x | y |
|---|---|---:|---:|
| 2 | south-west, on the road | 5.765 | 0 |
| 1 | south-east, on the road | 37.765 | 0 |
| 3 | north-west | 0 | 38.47 |
| 4 | north-east | 15.2 | 38.47 |

All four sides come out at the documented lengths to three decimals, and the
enclosed area is 907.9 m² — within 0.23% of the registered 910 m², an
independent check that the construction is right. The registered figure is what
the page displays; the small gap is drawing tolerance.

Vertex numbering and orientation match the cadastral plan, so the SVG and the
scanned plan (in the gallery) can be read side by side.

The scan is cropped before publication: it keeps the title, diagram and
dimensions table, and drops the preparer's signature and the official seal.

## Analytics

The page loads `gtag.js` for the GA4 property behind the Firebase web app
(`G-NXKGWGQJBR`), and records a `contact_click` event with the channel —
`phone`, `whatsapp`, `telegram` or `email` — whenever a visitor reaches for
one. On a listing page that number matters more than pageviews.

The `firebase` npm package is deliberately **not** a dependency. The only value
this site needs from the web app config is the measurement id; the rest
(`apiKey`, `appId`, `messagingSenderId`, `storageBucket`) addresses Firebase
SDK products — Auth, Firestore, Storage — that a static page does not use.
Loading the tag directly reports to the same GA4 property and keeps the bundle
roughly 40 kB smaller. A measurement id is not a credential; it appears in the
page source of every GA4 site.

The tag is skipped when `isDevMode()` is true, so local work does not reach the
statistics. Note that GA4 sets cookies — if the listing is ever aimed at EU
visitors, a consent notice would be needed.

## Icons

`public/favicon.svg` is the source: the plot's own trapezoid silhouette, with
the 32 m road frontage picked out in gold. It is solid rather than outlined so
the shape still reads at 16px.

`favicon.ico` (16/32/48, PNG-encoded), `apple-touch-icon.png` (180),
`icon-512.png` and `site.webmanifest` are generated from it. To regenerate
after editing the SVG, render it at each size and repack the .ico — there is no
build step wired up for this, since it changes about as often as the brand.
