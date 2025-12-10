import { DOCUMENT, NgFor, NgIf } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
  inject,
  signal
} from '@angular/core';
import {
  INDIAN_LANGUAGE_CODES,
  INDIAN_LANGUAGE_OPTIONS,
  LanguageOption
} from './language-options';

type TranslateWindow = Window & typeof globalThis & {
  google?: Record<string, any> & {
    translate?: {
      TranslateElement: new (options: Record<string, unknown>, elementId: string) => void;
    };
  };
  googleTranslateElementInit?: () => void;
  __ngTranslatePromise?: Promise<void>;
};

@Component({
  selector: 'app-translate-dropdown',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './translate-dropdown.component.html',
  styleUrl: './translate-dropdown.component.scss'
})
export class TranslateDropdownComponent implements OnInit {
  private static readonly STORAGE_KEY = 'preferred-language-code';
  private readonly documentRef = inject(DOCUMENT);
  private readonly host = inject(ElementRef<HTMLElement>);

  @ViewChildren('optionButton')
  private optionButtons!: QueryList<ElementRef<HTMLButtonElement>>;

  @Output() readonly languageChange = new EventEmitter<string>();

  readonly languages: LanguageOption[] = INDIAN_LANGUAGE_OPTIONS;

  readonly menuOpen = signal(false);
  readonly activeCode = signal(this.getStoredLanguage());
  private readonly languageCodes = INDIAN_LANGUAGE_CODES;
  readonly focusedIndex = signal(
    this.languages.findIndex((lang) => lang.code === this.activeCode()) || 0
  );
  private translateElementInitialized = false;

  ngOnInit(): void {
    this.ensureHiddenTranslateElement();
    this.bootstrapGoogleTranslate().then(() => {
      this.applyGoogleLanguage(this.activeCode());
    });
  }

  toggleMenu(event?: Event): void {
    event?.stopPropagation();
    this.menuOpen.update((open) => !open);

    if (this.menuOpen()) {
      queueMicrotask(() => this.focusOption(this.focusedIndex()));
    }
  }

  selectLanguage(code: string): void {
    this.menuOpen.set(false);
    this.applyGoogleLanguage(code);
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!this.menuOpen()) {
        this.toggleMenu(event);
      }
      this.focusOption(this.focusedIndex());
    }

    if (event.key === 'Escape') {
      this.menuOpen.set(false);
    }
  }

  onMenuKeydown(event: KeyboardEvent): void {
    if (!this.menuOpen()) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.moveFocus(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.moveFocus(-1);
        break;
      case 'Home':
        event.preventDefault();
        this.focusOption(0);
        break;
      case 'End':
        event.preventDefault();
        this.focusOption(this.languages.length - 1);
        break;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const current = this.languages[this.focusedIndex()];
        if (current) {
          this.selectLanguage(current.code);
        }
        break;
      }
      case 'Escape':
        this.menuOpen.set(false);
        break;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.menuOpen()) {
      return;
    }
    const target = event.target as Node;
    if (!this.host.nativeElement.contains(target)) {
      this.menuOpen.set(false);
    }
  }

  private moveFocus(delta: number): void {
    const nextIndex = (this.focusedIndex() + delta + this.languages.length) % this.languages.length;
    this.focusOption(nextIndex);
  }

  private focusOption(index: number): void {
    this.focusedIndex.set(index);
    const option = this.optionButtons?.get(index)?.nativeElement;
    option?.focus();
  }

  private applyGoogleLanguage(code: string): void {
    const normalized = (code || 'EN').toUpperCase();
    this.activeCode.set(normalized);
    this.focusedIndex.set(this.languages.findIndex((lang) => lang.code === normalized));
    this.persistLanguage(normalized);

    this.bootstrapGoogleTranslate()
      .then(() => this.waitForTranslateCombo())
      .then((combo) => {
        if (!combo) {
          return;
        }
        combo.value = normalized.toLowerCase();
        combo.dispatchEvent(new Event('change'));
        this.languageChange.emit(normalized);
      });
  }

  private getStoredLanguage(): string {
    if (typeof window === 'undefined') {
      return 'EN';
    }
    const stored = window.localStorage.getItem(TranslateDropdownComponent.STORAGE_KEY);
    return (stored ?? 'EN').toUpperCase();
  }

  private persistLanguage(code: string): void {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(TranslateDropdownComponent.STORAGE_KEY, code);
  }

  private ensureHiddenTranslateElement(): void {
    if (this.documentRef.getElementById('google_translate_element')) {
      return;
    }
    const hiddenHost = this.documentRef.createElement('div');
    hiddenHost.id = 'google_translate_element';
    hiddenHost.style.position = 'absolute';
    hiddenHost.style.left = '-9999px';
    hiddenHost.style.top = '0';
    hiddenHost.setAttribute('aria-hidden', 'true');
    this.documentRef.body.appendChild(hiddenHost);
  }

  private bootstrapGoogleTranslate(): Promise<void> {
    if (typeof window === 'undefined') {
      return Promise.resolve();
    }

    const win = window as TranslateWindow;

    if (win.__ngTranslatePromise) {
      return win.__ngTranslatePromise;
    }

    if (win.google?.translate?.TranslateElement) {
      this.createTranslateElement();
      win.__ngTranslatePromise = Promise.resolve();
      return win.__ngTranslatePromise;
    }

    win.__ngTranslatePromise = new Promise<void>((resolve) => {
      win.googleTranslateElementInit = () => {
        this.createTranslateElement();
        resolve();
      };

      const script = this.documentRef.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.defer = true;
      script.onerror = () => resolve();

      this.documentRef.head.appendChild(script);
    });

    return win.__ngTranslatePromise;
  }

  private createTranslateElement(): void {
    const win = window as TranslateWindow;

    if (!win.google?.translate?.TranslateElement) {
      return;
    }

    if (this.translateElementInitialized) {
      return;
    }

    new win.google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        includedLanguages: this.languageCodes,
        autoDisplay: false
      },
      'google_translate_element'
    );
    this.translateElementInitialized = true;
  }

  private waitForTranslateCombo(): Promise<HTMLSelectElement | null> {
    if (typeof window === 'undefined') {
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 200;

      const attempt = () => {
        const combo = this.documentRef.querySelector('.goog-te-combo') as HTMLSelectElement | null;
        if (combo) {
          resolve(combo);
          return;
        }
        attempts += 1;
        if (attempts > maxAttempts) {
          resolve(null);
          return;
        }
        window.setTimeout(attempt, 50);
      };
      attempt();
    });
  }
}
