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

The certificate contains no cadastral boundary drawing. The SVG in
`src/app/components/land-plan/land-plan.ts` is **schematic**: the arrangement of
the four sides was taken from the plot outline on the aerial photograph, then a
closed quadrilateral carrying the documented lengths (32.0 / 38.9 / 15.2 /
44.6 m) was solved for it, choosing the solution whose enclosed area lands on
the registered 910 m².

The polygon is then rotated 8.05° so the 38.9 m side runs exactly horizontally.
Rotation preserves every length and interior angle — it only changes how the
drawing sits on the page — so the road is drawn at its true angle to that side
rather than forced vertical. The four lengths cannot form a trapezoid with the
38.9 m and 44.6 m sides parallel (15.2 + 5.7 < 32), so a straight, horizontal
38.9 m side is as close to "parallel" as the real geometry allows.

It is labelled as informational on the page and is not a survey-accurate
boundary. Replace the vertices if an official cadastral plan becomes available.

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
