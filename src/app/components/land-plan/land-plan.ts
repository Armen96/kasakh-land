import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PROPERTY } from '../../property.config';
import { RevealDirective } from '../../shared/reveal.directive';

/**
 * Schematic plot geometry.
 *
 * The supplied registration certificate contains no cadastral boundary
 * drawing, so these vertices are NOT surveyed coordinates. They were derived
 * by taking the plot outline visible on the aerial photograph to fix the
 * arrangement of the four sides, then solving a closed quadrilateral that
 * carries the documented boundary lengths (32.0 / 38.9 / 15.2 / 44.6 m).
 *
 * The drawing is therefore schematic: correct in arrangement and labelled
 * with documented lengths, but not a survey-accurate boundary. Replace these
 * values if an official cadastral plan becomes available.
 *
 * Local frame: x east, y north, metres, origin at the southern road corner.
 *   D (0.00,  0.00)  south road corner
 *   A (0.00, 32.00)  north road corner
 *   B (38.65, 36.41) north-east corner
 *   C (39.24, 21.20) south-east corner
 */
interface Point {
  readonly x: number;
  readonly y: number;
}

const SCALE = 9;
const OFFSET_X = 175;
const OFFSET_Y = 120;
const MAX_NORTHING = 36.41;

const toSvg = (xm: number, ym: number): Point => ({
  x: OFFSET_X + xm * SCALE,
  y: OFFSET_Y + (MAX_NORTHING - ym) * SCALE,
});

@Component({
  selector: 'app-land-plan',
  templateUrl: './land-plan.html',
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandPlan {
  protected readonly property = PROPERTY;

  /** Corner A is the northern road corner; the walk runs A → B → C → D. */
  protected readonly cornerA = toSvg(0, 32);
  protected readonly cornerB = toSvg(38.65, 36.41);
  protected readonly cornerC = toSvg(39.24, 21.2);
  protected readonly cornerD = toSvg(0, 0);

  protected readonly polygonPoints = [
    this.cornerA,
    this.cornerB,
    this.cornerC,
    this.cornerD,
  ]
    .map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ');

  protected readonly centroid = {
    x: (this.cornerA.x + this.cornerB.x + this.cornerC.x + this.cornerD.x) / 4,
    y: (this.cornerA.y + this.cornerB.y + this.cornerC.y + this.cornerD.y) / 4,
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
