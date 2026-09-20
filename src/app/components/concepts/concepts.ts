import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROPERTY } from '../../property.config';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-concepts',
  templateUrl: './concepts.html',
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Concepts {
  protected readonly concepts = PROPERTY.concepts;
}
