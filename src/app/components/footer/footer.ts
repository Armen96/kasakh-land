import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROPERTY } from '../../property.config';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  protected readonly property = PROPERTY;
}
