import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PROPERTY } from '../../property.config';
import { RevealDirective } from '../../shared/reveal.directive';

/**
 * Schematic plot geometry.
 *
 * The registration certificate contains no cadastral boundary drawing, so
 * these vertices are NOT surveyed coordinates. They were derived by taking the
 * plot outline visible on the aerial photograph to fix the arrangement of the
 * four sides, then solving a closed quadrilateral that carries the documented
 * boundary lengths (32.0 / 38.9 / 15.2 / 44.6 m). The solution was chosen so
 * the enclosed area lands on the registered 910 m² (it comes out at 911.2).
 *
 * The whole polygon is then rotated 8.05° so the 38.9 m side runs exactly
 * horizontally. Rotation preserves every length and interior angle — it only
 * changes how the drawing sits on the page — so the road, which follows the
 * frontage, is drawn at its true angle to that side rather than forced
 * vertical.
 *
 * The drawing is therefore schematic: correct in arrangement, carrying
 * documented lengths, but not a survey-accurate boundary. Replace these
 * values if an official cadastral plan becomes available.
 *
 * Local frame: metres, x right, y up, origin at the southern road corner.
 */
interface Point {
  readonly x: number;
  readonly y: number;
}

const SCALE = 10;
const OFFSET_X = 150;
const OFFSET_Y = 110;
const MAX_NORTHING = 31.685;

const toSvg = (xm: number, ym: number): Point => ({
  x: OFFSET_X + xm * SCALE,
  y: OFFSET_Y + (MAX_NORTHING - ym) * SCALE,
});

const round = (p: Point): Point => ({
  x: Math.round(p.x * 10) / 10,
  y: Math.round(p.y * 10) / 10,
});

/** Unit vector from `a` to `b`, in SVG space. */
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
 * Outward normal of edge a→b, for a polygon wound A → B → C → D in SVG space
 * (y down). Rotating the edge direction by −90° points away from the interior.
 */
const outward = (a: Point, b: Point): Point => {
  const u = unit(a, b);
  return { x: u.y, y: -u.x };
};

@Component({
  selector: 'app-land-plan',
  templateUrl: './land-plan.html',
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandPlan {
  protected readonly property = PROPERTY;

  /** Walk order A → B → C → D; A and D sit on the road. */
  protected readonly cornerA = toSvg(4.481, 31.685);
  protected readonly cornerB = toSvg(43.382, 31.685);
  protected readonly cornerC = toSvg(41.386, 16.629);
  protected readonly cornerD = toSvg(0, 0);

  protected readonly corners = [
    this.cornerA,
    this.cornerB,
    this.cornerC,
    this.cornerD,
  ];

  protected readonly polygonPoints = this.corners
    .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ');

  protected readonly centroid = round({
    x: this.corners.reduce((sum, p) => sum + p.x, 0) / 4,
    y: this.corners.reduce((sum, p) => sum + p.y, 0) / 4,
  });

  /** Along the frontage, pointing from the northern corner to the southern. */
  private readonly frontageDir = unit(this.cornerA, this.cornerD);
  /** Away from the plot, i.e. toward the road. */
  private readonly frontageOut = outward(this.cornerD, this.cornerA);

  /** Road drawn as a band parallel to the frontage, at its true angle. */
  protected readonly road = (() => {
    const head = shift(this.cornerA, this.frontageDir, -45);
    const tail = shift(this.cornerD, this.frontageDir, 45);
    const near = [head, tail].map((p) => shift(p, this.frontageOut, 58));
    const far = [tail, head].map((p) => shift(p, this.frontageOut, 122));
    const ring = [...near, ...far].map(round);

    return {
      points: ring.map((p) => `${p.x},${p.y}`).join(' '),
      centreFrom: round(midpoint(ring[0], ring[3])),
      centreTo: round(midpoint(ring[1], ring[2])),
      label: round(
        midpoint(midpoint(ring[0], ring[3]), midpoint(ring[1], ring[2])),
      ),
      /** Degrees, so the label reads up the road rather than upside down. */
      angle:
        Math.round(
          (Math.atan2(this.frontageDir.y, this.frontageDir.x) * 180) / Math.PI -
            180,
        ) * 1,
    };
  })();

  /** Dimension label anchors, each pushed clear of its own edge. */
  protected readonly labels = {
    front: round(
      shift(midpoint(this.cornerD, this.cornerA), this.frontageOut, 26),
    ),
    left: round(
      shift(
        midpoint(this.cornerA, this.cornerB),
        outward(this.cornerA, this.cornerB),
        22,
      ),
    ),
    rear: round(
      shift(
        midpoint(this.cornerB, this.cornerC),
        outward(this.cornerB, this.cornerC),
        30,
      ),
    ),
    right: round(
      shift(
        midpoint(this.cornerC, this.cornerD),
        outward(this.cornerC, this.cornerD),
        30,
      ),
    ),
  };

  /** Rotation for the frontage label, matching the road. */
  protected readonly frontageAngle = this.road.angle;

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
