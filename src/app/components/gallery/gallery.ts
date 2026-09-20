import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  signal,
  viewChild,
} from '@angular/core';
import { GalleryImage, PROPERTY } from '../../property.config';
import { RevealDirective } from '../../shared/reveal.directive';

/** Horizontal travel, in px, that counts as a swipe rather than a tap. */
const SWIPE_THRESHOLD = 48;

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.html',
  imports: [RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Gallery {
  protected readonly images = PROPERTY.gallery;
  protected readonly featured = PROPERTY.gallery[0];
  protected readonly rest = PROPERTY.gallery.slice(1);

  /** Index of the open lightbox slide, or null when closed. */
  protected readonly openIndex = signal<number | null>(null);
  protected readonly isOpen = computed(() => this.openIndex() !== null);
  protected readonly current = computed<GalleryImage | null>(() => {
    const index = this.openIndex();
    return index === null ? null : this.images[index];
  });

  private readonly dialog = viewChild<ElementRef<HTMLElement>>('dialog');
  private lastFocused: HTMLElement | null = null;
  private touchStartX = 0;

  protected open(index: number): void {
    this.lastFocused = document.activeElement as HTMLElement | null;
    this.openIndex.set(index);
    document.body.style.overflow = 'hidden';
    // Wait for the dialog to render before moving focus into it.
    queueMicrotask(() => this.dialog()?.nativeElement.focus());
  }

  protected close(): void {
    this.openIndex.set(null);
    document.body.style.overflow = '';
    this.lastFocused?.focus();
    this.lastFocused = null;
  }

  protected next(): void {
    this.openIndex.update((index) =>
      index === null ? null : (index + 1) % this.images.length,
    );
  }

  protected previous(): void {
    this.openIndex.update((index) =>
      index === null ? null : (index - 1 + this.images.length) % this.images.length,
    );
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (!this.isOpen()) {
      return;
    }

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.next();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.previous();
        break;
    }
  }

  protected onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].clientX;
  }

  protected onTouchEnd(event: TouchEvent): void {
    const delta = event.changedTouches[0].clientX - this.touchStartX;

    if (Math.abs(delta) < SWIPE_THRESHOLD) {
      return;
    }

    if (delta < 0) {
      this.next();
    } else {
      this.previous();
    }
  }
}
