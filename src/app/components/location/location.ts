import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { inject } from '@angular/core';
import { PROPERTY } from '../../property.config';
import { RevealDirective } from '../../shared/reveal.directive';

@Component({
  selector: 'app-location',
  templateUrl: './location.html',
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Location {
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly property = PROPERTY;

  protected readonly details = [
    { label: 'Մարզ', value: PROPERTY.location.province },
    { label: 'Համայնք', value: PROPERTY.location.municipality },
    { label: 'Բնակավայր', value: PROPERTY.location.village + ' գյուղ' },
    { label: 'Հասցե', value: PROPERTY.location.street },
  ];

  protected readonly hasVerifiedMap = PROPERTY.location.mapEmbedUrl !== null;

  protected readonly embedUrl = computed<SafeResourceUrl | null>(() => {
    const url = PROPERTY.location.mapEmbedUrl;
    return url === null ? null : this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  /**
   * Falls back to an address search rather than a coordinate pin: no exact
   * coordinates have been verified for this plot, so a pin would assert a
   * precision the data does not support.
   */
  protected readonly mapLink =
    PROPERTY.location.mapLinkUrl ??
    'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent(PROPERTY.location.full);
}
