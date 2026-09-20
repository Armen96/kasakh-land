import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROPERTY } from '../../property.config';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-utilities',
  templateUrl: './utilities.html',
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Utilities {
  protected readonly utilities = PROPERTY.utilities;
}
