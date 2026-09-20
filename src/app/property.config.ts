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

export interface BoundaryEdge {
  readonly id: string;
  /** Armenian label, e.g. «Ճակատային մաս (ճանապարհ)». */
  readonly label: string;
  readonly metres: number;
}

/**
 * A contact channel is rendered only when its value is non-null.
 * Leaving a value null hides the button entirely rather than emitting a
 * dead link — see CONTACT_PLACEHOLDERS below.
 */
export interface ContactConfig {
  /** E.164, e.g. '+37477123456'. */
  readonly phone: string | null;
  /** Digits only, no '+', e.g. '37477123456'. */
  readonly whatsapp: string | null;
  /** Username without '@'. */
  readonly telegram: string | null;
}

export const PROPERTY = {
  name: 'KASAKH 917',

  price: {
    /** Displayed asking price. */
    amount: 155_000,
    currency: 'USD',
    display: '$155,000',
  },

  area: {
    /** Advertised area, in square metres. */
    squareMetres: 917,
    display: '917 քմ',
    /**
     * The registration certificate records 0.091 ha at three-decimal
     * precision. Confirm the exact registered area before publication —
     * tracked as a GitHub issue.
     */
    certificateHectares: 0.091,
  },

  location: {
    village: 'Քասախ',
    municipality: 'Նաիրի',
    province: 'Կոտայքի մարզ',
    street: 'Մուշի 14-րդ փողոց, 15 հողամաս',
    short: 'Կոտայքի մարզ, Քասախ գյուղ',
    full: 'Կոտայքի մարզ, Նաիրի համայնք, գյուղ Քասախ, Մուշի 14-րդ փողոց, 15 հողամաս',
    /**
     * Set to a verified Google Maps embed URL once exact coordinates are
     * confirmed. While null, the section falls back to a clearly labelled
     * address search rather than dropping a pin at a guessed location.
     */
    mapEmbedUrl: null as string | null,
    mapLinkUrl: null as string | null,
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
    'Վաճառվում է 917 քմ հողատարածք՝ Կոտայքի մարզի Քասախ գյուղում։ ' +
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
  ] as readonly GalleryImage[],

  contact: {
    phone: null,
    whatsapp: null,
    telegram: null,
  } as ContactConfig,

  whatsappMessage:
    'Բարև Ձեզ, հետաքրքրված եմ Քասախում վաճառվող 917 քմ հողատարածքով։ ' +
    'Կցանկանայի ստանալ լրացուցիչ տեղեկություններ։',

  /** Used for canonical + Open Graph URLs. */
  siteUrl: 'https://kasakh917.web.app',

  year: 2026,
} as const;

/** True when at least one contact channel is configured. */
export const HAS_CONTACT =
  PROPERTY.contact.phone !== null ||
  PROPERTY.contact.whatsapp !== null ||
  PROPERTY.contact.telegram !== null;
