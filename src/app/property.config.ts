/**
 * Central property configuration.
 *
 * Everything the owner may need to change lives here — no component template
 * should need editing to update price, contacts, photos or the map link.
 */

export interface GalleryImage {
  /** Path under /public. */
  readonly src: string;
  /** Armenian alt text — also used as the lightbox caption. */
  readonly alt: string;
  /** Shown as an overlay badge, e.g. for non-photographic material. */
  readonly badge?: string;
  /** Intrinsic size, declared to reserve layout space and avoid shifts. */
  readonly width: number;
  readonly height: number;
  /**
   * Optional responsive sources. Photographs added without pre-rendered
   * variants simply fall back to `src`.
   */
  readonly srcset?: string;
}

/** An illustrative development idea — never a photograph, never an approved plan. */
export interface ConceptImage extends GalleryImage {
  readonly title: string;
  readonly summary: string;
}

export interface BoundaryEdge {
  readonly id: string;
  /** Armenian label, e.g. «Ճակատային մաս (ճանապարհ)». */
  readonly label: string;
  readonly metres: number;
}

/**
 * A contact channel is rendered only when its value is non-null.
 * Leaving a value null hides the button entirely rather than emitting a
 * dead link.
 */
export interface ContactConfig {
  /** E.164, e.g. '+37477123456'. */
  readonly phone: string | null;
  /** Digits only, no '+', e.g. '37477123456'. */
  readonly whatsapp: string | null;
  /** Username without '@', or a phone number in '+374…' form. */
  readonly telegram: string | null;
  readonly email: string | null;
}

export const PROPERTY = {
  name: 'KASAKH 910',

  price: {
    /** Displayed asking price. */
    amount: 155_000,
    currency: 'USD',
    display: '$155,000',
  },

  area: {
    /**
     * Registered area, confirmed by the owner against the cadastral record.
     * The certificate records 0.091 ha, which is this figure.
     */
    squareMetres: 910,
    display: '910 քմ',
  },

  location: {
    village: 'Քասախ',
    municipality: 'Նաիրի',
    province: 'Կոտայքի մարզ',
    street: 'Մուշի 14-րդ փողոց, 15 հողամաս',
    short: 'Կոտայքի մարզ, Քասախ գյուղ',
    full: 'Կոտայքի մարզ, Նաիրի համայնք, գյուղ Քասախ, Մուշի 14-րդ փողոց, 15 հողամաս',
    /** Owner-supplied coordinates, resolved from a Google Maps share link. */
    coordinates: { lat: 40.223524, lng: 44.467117 },
    mapEmbedUrl:
      'https://www.google.com/maps?q=40.223524,44.467117&hl=hy&z=18&output=embed' as
        | string
        | null,
    mapLinkUrl: 'https://maps.app.goo.gl/Pu3W4R7Ae7a6aeL5A' as string | null,
  },

  designation: {
    land: 'Բնակավայրերի',
    functional: 'Բնակելի կառուցապատման',
    ownership: 'Սեփականություն',
  },

  frontage: {
    metres: 32,
    display: '32 մ',
  },

  /** Cadastral boundary lengths, walked front → left → rear → right. */
  boundaries: [
    { id: 'front', label: 'Ճակատային մաս (ճանապարհ)', metres: 32.0 },
    { id: 'left', label: 'Ձախ կողմ', metres: 38.9 },
    { id: 'rear', label: 'Հետին սահման', metres: 15.2 },
    { id: 'right', label: 'Աջ կողմ', metres: 44.6 },
  ] as readonly BoundaryEdge[],

  advantages: [
    '32 մետր լայն ճակատային մաս',
    'Բնակելի կառուցապատման նշանակություն',
    'Ասֆալտապատ ճանապարհ',
    'Բոլոր անհրաժեշտ կոմունիկացիաները հարևանությամբ',
  ] as readonly string[],

  description:
    'Վաճառվում է 910 քմ հողատարածք՝ Կոտայքի մարզի Քասախ գյուղում։ ' +
    'Հողամասը նախատեսված է բնակելի կառուցապատման համար և ունի 32 մետր լայն ճակատային մաս։',

  /**
   * Only real photographs of the property belong here. Anything that is not
   * a photograph of the land must carry an explicit `badge`.
   */
  gallery: [
    {
      src: '/images/land-main-top.jpg',
      srcset:
        '/images/land-main-top-640.jpg 640w, ' +
        '/images/land-main-top-960.jpg 960w, ' +
        '/images/land-main-top.jpg 1402w',
      alt: 'Հողամասի տեսքը վերևից՝ ճակատային մասը ասֆալտապատ ճանապարհի երկայնքով',
      width: 1402,
      height: 1122,
    },
    {
      src: '/images/land-road-view.jpg',
      srcset:
        '/images/land-road-view-640.jpg 640w, ' +
        '/images/land-road-view-960.jpg 960w, ' +
        '/images/land-road-view.jpg 1400w',
      alt: 'Հողամասի տեսքը ճանապարհից՝ հարևան կառուցապատումը և շրջակայքը',
      width: 1400,
      height: 959,
    },
  ] as readonly GalleryImage[],

  /**
   * Illustrative development ideas, shown apart from the photographs.
   * These are visualizations, not approved projects, and the section says so.
   */
  concepts: [
    {
      src: '/images/concept-house-large.jpg',
      alt: 'Պատկերավոր տարբերակ՝ մեկ բնակելի տուն մոտ 14 × 12 մ, լողավազան և հանգստի գոտի',
      badge: 'Պատկերավոր վիզուալիզացիա',
      title: 'Մեկ տուն՝ ընդարձակ',
      summary: 'Տուն՝ մոտ 14 × 12 մ, լողավազան՝ մոտ 8 × 4 մ, ավտոկանգառ և այգի։',
      width: 1400,
      height: 1200,
    },
    {
      src: '/images/concept-house-small.jpg',
      alt: 'Պատկերավոր տարբերակ՝ մեկ բնակելի տուն մոտ 12 × 10 մ, լողավազան և ավելի մեծ այգի',
      badge: 'Պատկերավոր վիզուալիզացիա',
      title: 'Մեկ տուն՝ կոմպակտ',
      summary: 'Տուն՝ մոտ 12 × 10 մ, լողավազան՝ մոտ 6 × 4 մ, ավելի ընդարձակ կանաչ տարածք։',
      width: 1400,
      height: 1199,
    },
    {
      src: '/images/concept-two-houses.jpg',
      alt: 'Պատկերավոր տարբերակ՝ երկու բնակելի տուն՝ յուրաքանչյուրը մոտ 10 × 11 մ',
      badge: 'Պատկերավոր վիզուալիզացիա',
      title: 'Երկու տուն',
      summary: 'Երկու տուն՝ յուրաքանչյուրը մոտ 10 × 11 մ, առանձին մուտքերով։',
      width: 1400,
      height: 1200,
    },
  ] as readonly ConceptImage[],

  contact: {
    phone: '+37498512371',
    whatsapp: '37498512371',
    telegram: '+37498512371',
    email: 'barsegyan96armen@gmail.com',
  } as ContactConfig,

  whatsappMessage:
    'Բարև Ձեզ, հետաքրքրված եմ Քասախում վաճառվող 910 քմ հողատարածքով։ ' +
    'Կցանկանայի ստանալ լրացուցիչ տեղեկություններ։',

  emailSubject: 'Հարցում՝ Քասախում վաճառվող 910 քմ հողատարածքի վերաբերյալ',

  /** Used for canonical + Open Graph URLs. */
  siteUrl: 'https://kasakh910.web.app',

  year: 2026,
} as const;

/** True when at least one contact channel is configured. */
export const HAS_CONTACT =
  PROPERTY.contact.phone !== null ||
  PROPERTY.contact.whatsapp !== null ||
  PROPERTY.contact.telegram !== null ||
  PROPERTY.contact.email !== null;
