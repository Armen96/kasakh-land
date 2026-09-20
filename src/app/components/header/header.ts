import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  signal,
} from '@angular/core';
import { HAS_CONTACT, PROPERTY } from '../../property.config';

interface NavLink {
  readonly fragment: string;
  readonly label: string;
}

/**
 * Class strings are computed here rather than written as `[class.x]` bindings:
 * Tailwind utilities containing `/` or `[]` are not valid binding keys.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected readonly property = PROPERTY;
  protected readonly hasContact = HAS_CONTACT;

  protected readonly links: readonly NavLink[] = [
    { fragment: 'hero', label: 'Գլխավոր' },
    { fragment: 'about', label: 'Հողամասի մասին' },
    { fragment: 'gallery', label: 'Լուսանկարներ' },
    { fragment: 'plan', label: 'Հատակագիծ' },
    { fragment: 'concepts', label: 'Տարբերակներ' },
    { fragment: 'location', label: 'Տեղադրություն' },
    { fragment: 'contact', label: 'Կապ' },
  ];

  /** Switches the bar from transparent-over-hero to its solid state. */
  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);

  /** True while the bar sits transparently over the hero photograph. */
  private readonly onDark = computed(() => !this.scrolled() && !this.menuOpen());

  protected readonly barClass = computed(() =>
    this.scrolled() || this.menuOpen()
      ? 'bg-ivory/95 backdrop-blur-md shadow-[0_1px_0_rgba(28,28,26,0.08)]'
      : 'bg-transparent',
  );

  protected readonly brandClass = computed(() =>
    this.onDark() ? 'text-ivory' : 'text-charcoal',
  );

  protected readonly linkClass = computed(() =>
    this.scrolled()
      ? 'text-charcoal-soft hover:text-charcoal'
      : 'text-ivory/85 hover:text-ivory',
  );

  protected readonly ctaClass = computed(() =>
    this.scrolled()
      ? 'bg-forest text-ivory hover:bg-forest-deep'
      : 'bg-ivory text-forest hover:bg-white',
  );

  protected readonly lineColor = computed(() =>
    this.onDark() ? 'bg-ivory' : 'bg-charcoal',
  );

  protected readonly menuPanelClass = computed(() =>
    this.menuOpen() ? 'max-h-[28rem] opacity-100' : 'max-h-0 opacity-0',
  );

  @HostListener('window:scroll')
  protected onScroll(): void {
    this.scrolled.set(window.scrollY > 24);
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.closeMenu();
  }
}
