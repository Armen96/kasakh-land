import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HAS_CONTACT, PROPERTY } from '../../property.config';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  protected readonly property = PROPERTY;
  protected readonly hasContact = HAS_CONTACT;
  protected readonly heroImage = PROPERTY.gallery[0];
}
