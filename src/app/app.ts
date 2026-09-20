import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Contact } from './components/contact/contact';
import { Footer } from './components/footer/footer';
import { Gallery } from './components/gallery/gallery';
import { Header } from './components/header/header';
import { Hero } from './components/hero/hero';
import { Highlights } from './components/highlights/highlights';
import { LandPlan } from './components/land-plan/land-plan';
import { Location } from './components/location/location';
import { HAS_CONTACT } from './property.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [Header, Hero, Highlights, Gallery, LandPlan, Location, Contact, Footer],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  /** Reserves space under the sticky mobile contact bar. */
  protected readonly hasContact = HAS_CONTACT;
}
