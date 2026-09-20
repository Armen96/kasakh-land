import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PROPERTY } from '../../property.config';
import { RevealDirective } from '../../shared/reveal.directive';

/**
 * Plot geometry, taken from the official cadastral plan (ՀՈՂԱՄԱՍԻ ՀԱՏԱԿԱԳԻԾԸ,
 * 1:1000) supplied by the owner.
 *
 * That drawing renders sides 1–2 (32.0 m, marked «Ճանապարհի») and 3–4 (15.2 m)
 * both horizontal — i.e. the plot is a trapezoid with the road frontage
 * parallel to the rear boundary. Those four documented lengths do admit such a
 * trapezoid, and solving it is exact:
 *
 *   2 = (5.765,  0    )   south-west, on the road
 *   1 = (37.765, 0    )   south-east, on the road
 *   3 = (0,      38.47)   north-west
 *   4 = (15.2,   38.47)   north-east
 *
 * All four sides come out at the documented lengths to three decimals, and the
 * enclosed area is 907.9 m² — within 0.23% of the registered 910 m², which is
 * an independent check the construction is right. The registered figure is
 * what the page displays; the small gap is drawing tolerance.
 *
 * Vertex numbering and orientation match the cadastral plan so the two can be
 * read side by side — that plan is in the gallery.
 *
 * Local frame: metres, x right, y up.
 */
interface Point {
  readonly x: number;
  readonly y: number;
}

const SCALE = 9;
const OFFSET_X = 130;
const OFFSET_Y = 60;
const MAX_NORTHING = 38.47;

const toSvg = (xm: number, ym: number): Point => ({
  x: OFFSET_X + xm * SCALE,
  y: OFFSET_Y + (MAX_NORTHING - ym) * SCALE,
});

const round = (p: Point): Point => ({
  x: Math.round(p.x * 10) / 10,
  y: Math.round(p.y * 10) / 10,
});

const unit = (a: Point, b: Point): Point => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.hypot(dx, dy);
  return { x: dx / length, y: dy / length };
};

const midpoint = (a: Point, b: Point): Point => ({
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2,
});

const shift = (p: Point, direction: Point, distance: number): Point => ({
  x: p.x + direction.x * distance,
  y: p.y + direction.y * distance,
});

/**
 * Outward normal of edge a→b for a ring wound 1 → 2 → 3 → 4 in SVG space
 * (y down). Check against the frontage: 1→2 runs in −x, so this returns +y,
 * which points down — away from the plot, toward the road.
 */
const outward = (a: Point, b: Point): Point => {
  const u = unit(a, b);
  return { x: u.y, y: -u.x };
};

/** Degrees of rotation that keep a label reading along its edge. */
const along = (a: Point, b: Point): number => {
  let deg = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
  if (deg > 90) deg -= 180;
  if (deg < -90) deg += 180;
  return Math.round(deg * 10) / 10;
};

@Component({
  selector: 'app-land-plan',
  templateUrl: './land-plan.html',
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandPlan {
  protected readonly property = PROPERTY;

  /** Numbered as on the cadastral plan; the ring is wound 1 → 2 → 3 → 4. */
  protected readonly corner1 = toSvg(37.765, 0);
  protected readonly corner2 = toSvg(5.765, 0);
  protected readonly corner3 = toSvg(0, 38.47);
  protected readonly corner4 = toSvg(15.2, 38.47);

  protected readonly corners = [
    { id: '1', point: this.corner1 },
    { id: '2', point: this.corner2 },
    { id: '3', point: this.corner3 },
    { id: '4', point: this.corner4 },
  ];

  protected readonly polygonPoints = this.corners
    .map(({ point }) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`)
    .join(' ');

  protected readonly centroid = round({
    x: this.corners.reduce((sum, c) => sum + c.point.x, 0) / 4,
    y: this.corners.reduce((sum, c) => sum + c.point.y, 0) / 4,
  });

  /** Vertex number badges, nudged outward from the plot. */
  protected readonly cornerLabels = this.corners.map(({ id, point }) => ({
    id,
    point: round(shift(point, unit(this.centroid, point), 17)),
  }));

  /** Road band, running along the 1–2 frontage. */
  protected readonly road = (() => {
    const frontTop = this.corner1.y;
    return {
      x: 96,
      y: frontTop + 46,
      width: 400,
      height: 56,
      dashY: Math.round(frontTop + 46 + 28),
      labelX: 296,
      labelY: Math.round(frontTop + 46 + 34),
    };
  })();

  /** Dimension label anchors, each pushed clear of its own edge. */
  protected readonly labels = {
    front: {
      at: round(shift(midpoint(this.corner1, this.corner2), outward(this.corner1, this.corner2), 26)),
      angle: 0,
    },
    left: {
      at: round(shift(midpoint(this.corner2, this.corner3), outward(this.corner2, this.corner3), 32)),
      // Less 180° so the near-vertical label reads bottom-to-top.
      angle: Math.round((along(this.corner2, this.corner3) - 180) * 10) / 10,
    },
    rear: {
      at: round(shift(midpoint(this.corner3, this.corner4), outward(this.corner3, this.corner4), 24)),
      angle: 0,
    },
    right: {
      at: round(shift(midpoint(this.corner4, this.corner1), outward(this.corner4, this.corner1), 32)),
      angle: along(this.corner4, this.corner1),
    },
  };

  /** Highlights the matching boundary when a table row is hovered. */
  protected readonly activeEdge = signal<string | null>(null);

  protected setActive(id: string | null): void {
    this.activeEdge.set(id);
  }

  protected edgeStroke(id: string): string {
    return this.activeEdge() === id ? '#a8894f' : '#1e3d32';
  }

  protected edgeWidth(id: string): number {
    return this.activeEdge() === id ? 4 : 2;
  }
}
