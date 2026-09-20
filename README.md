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
```

## Deployment — Firebase Hosting

`outputMode: "static"` prerenders the page to plain HTML, so Hosting serves
static files with no Node runtime and no SPA rewrites.

The Firebase project does **not** exist yet. First time only:

```bash
npm i -g firebase-tools
firebase login
firebase projects:create kasakh910        # or create it in the Firebase console
firebase use kasakh910
```

Then, for every release:

```bash
npm run build
firebase deploy --only hosting
```

The site publishes to `https://kasakh910.web.app`. If a different project id is
used, update `.firebaserc` and the `siteUrl` in `property.config.ts`, plus the
canonical and Open Graph URLs in `src/index.html`.

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
