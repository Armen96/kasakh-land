import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROPERTY } from '../../property.config';
import { RevealDirective } from '../../shared/reveal.directive';

interface Highlight {
  readonly value: string;
  readonly label: string;
}

@Component({
  selector: 'app-highlights',
  templateUrl: './highlights.html',
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Highlights {
  protected readonly property = PROPERTY;

  protected readonly highlights: readonly Highlight[] = [
    { value: PROPERTY.area.display, label: 'Հողամասի մակերես' },
    { value: PROPERTY.frontage.display, label: 'Ճակատային մաս' },
    { value: 'Բնակելի', label: 'Կառուցապատման նշանակություն' },
    { value: PROPERTY.price.display, label: 'Վաճառքի գին' },
  ];
}
