import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  inject,
} from '@angular/core';
import { Concepts } from './components/concepts/concepts';
import { Contact } from './components/contact/contact';
import { Footer } from './components/footer/footer';
import { Gallery } from './components/gallery/gallery';
import { Header } from './components/header/header';
import { Hero } from './components/hero/hero';
import { Highlights } from './components/highlights/highlights';
import { LandPlan } from './components/land-plan/land-plan';
import { Location } from './components/location/location';
import { Analytics } from './shared/analytics';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    Header,
    Hero,
    Highlights,
    Gallery,
    LandPlan,
    Concepts,
    Location,
    Contact,
    Footer,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  constructor() {
    const analytics = inject(Analytics);
    // Browser-only: the prerender pass has no document to attach the tag to.
    afterNextRender(() => analytics.load());
  }
}
