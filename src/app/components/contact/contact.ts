import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HAS_CONTACT, PROPERTY } from '../../property.config';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.html',
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  protected readonly property = PROPERTY;
  protected readonly hasContact = HAS_CONTACT;
  protected readonly contact = PROPERTY.contact;

  protected readonly telHref = this.contact.phone
    ? `tel:${this.contact.phone}`
    : null;

  protected readonly whatsappHref = this.contact.whatsapp
    ? `https://wa.me/${this.contact.whatsapp}?text=${encodeURIComponent(PROPERTY.whatsappMessage)}`
    : null;

  protected readonly telegramHref = this.contact.telegram
    ? `https://t.me/${this.contact.telegram}`
    : null;
}
