# KASAKH 917

Single-page property site for the sale of a 917 m² residential plot in Kasakh,
Kotayk Province, Armenia. Angular 21 standalone components, Tailwind CSS v4,
prerendered to static HTML, deployed to Firebase Hosting.

## Editing the listing

Everything an owner normally changes lives in **`src/app/property.config.ts`** —
price, address, boundary lengths, gallery photographs, map URL and contact
details. No component template needs editing.

### Contact details

`contact.phone`, `contact.whatsapp` and `contact.telegram` are `null` until
configured. Any channel left `null` is hidden rather than rendered as a dead
link, and while all three are `null` the contact section shows a notice instead
of buttons.

```ts
contact: {
  phone: '+374XXXXXXXX',     // E.164
  whatsapp: '374XXXXXXXX',   // digits only, no '+'
  telegram: 'username',      // without '@'
}
```

### Map

`location.mapEmbedUrl` is `null` until exact coordinates are verified. While it
is `null` the map panel shows a labelled notice, and "Բացել Google Maps-ում"
performs an address search rather than dropping a pin at a guessed point.

### Photographs

Add entries to `gallery`. Only real photographs of the property belong there;
anything that is not a photograph of the land (for example a visualization)
must carry a `badge`, e.g. `badge: 'Պատկերավոր վիզուալիզացիա'`.

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
firebase projects:create kasakh917        # or create it in the Firebase console
firebase use kasakh917
```

Then, for every release:

```bash
npm run build
firebase deploy --only hosting
```

The site publishes to `https://kasakh917.web.app`. If a different project id is
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
44.6 m) was solved for it. It is labelled as informational on the page and is
not a survey-accurate boundary. Replace the vertices if an official cadastral
plan becomes available.
