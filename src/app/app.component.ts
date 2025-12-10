import { DOCUMENT, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, computed, effect, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TranslateDropdownComponent } from './translate-dropdown/translate-dropdown.component';
import { INDIAN_LANGUAGE_CODES } from './translate-dropdown/language-options';

type TranslateWindow = Window & typeof globalThis & {
  google?: Record<string, any> & {
    translate?: {
      TranslateElement: new (options: Record<string, unknown>, elementId: string) => void;
    };
  };
  googleTranslateElementInit?: () => void;
  __ngTranslatePromise?: Promise<void>;
  __ngTranslateInitialized?: boolean;
};

type Theme = 'dark' | 'light';

interface NavLink {
  label: string;
  href: string;
}

interface Project {
  title: string;
  description: string;
  stack: string[];
  status: string;
  impact: string;
  cta: string;
  link: string;
}

interface Experience {
  company: string;
  role: string;
  period: string;
  contributions: string[];
  location: string;
}

interface SkillCluster {
  title: string;
  depth: string;
  items: string[];
}

interface Lab {
  title: string;
  blurb: string;
  category: string;
  link: string;
}

interface Beacon {
  title: string;
  detail: string;
  accent: string;
}

interface ContactChannel {
  label: string;
  value: string;
  hint: string;
  link: string;
}

interface Article {
  title: string;
  summary: string;
  link: string;
  readTime: string;
}

interface ContactModel {
  name: string;
  email: string;
  topic: string;
  message: string;
}

interface ParticleSpec {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, NgClass, NgFor, NgIf, TranslateDropdownComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {
  private readonly documentRef = inject(DOCUMENT);
  private readonly iframeSelector = 'iframe[data-translate-sync]';
  private readonly languageStorageKey = 'app-root-language-code';
  private iframeObserver?: MutationObserver;

  readonly navLinks: NavLink[] = [
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Skills', href: '#skills' }
  ];

  readonly particles: ParticleSpec[] = this.generateParticles(48);

  readonly hero = {
    name: 'Mayank Pathak',
    title: 'Software Engineer · Angular + AI Automation',
    summary:
      'Designing Angular experiences where AI copilots accelerate delivery, underwriting flows feel cinematic, and developer productivity is measurable.',
    availability: 'Accepting Angular + AI collabs Q1 2026',
    location: 'Bengaluru · India',
    ethos: 'Engineering luminous software with storytelling UX, data clarity, and automation stitched together.',
    tags: ['Agentic Angular stacks', 'LLM dev tooling', 'Insurance intelligence', 'Experience ops']
  };

  readonly heroHighlights = [
    { label: 'Delivery acceleration', value: '35%', detail: 'One UI framework unifying Angular delivery' },
    { label: 'Manual effort reduced', value: '40%', detail: 'LLM dev agents translating specs into code' },
    { label: 'Faster underwriting', value: '30-40%', detail: 'Realtime verification + decision tooling' }
  ];

  readonly focusStatements = [
    'Angular platforms that feel alive and anticipatory',
    'LLM copilots co-owning specs, tests, and releases',
    'Insurance journeys that surface insights in-line',
    'DX automation rituals for multi-squad velocity'
  ];

  readonly signalBeacons: Beacon[] = [
    { title: 'Stack', detail: 'Angular · TypeScript · LLM Ops', accent: 'plasma' },
    { title: 'Superpower', detail: 'Agentic dev workflows & DX', accent: 'citrus' },
    { title: 'Edge', detail: 'Insurance intelligence UX', accent: 'violet' }
  ];

  private readonly focusIndex = signal(0);
  readonly currentFocus = computed(() => this.focusStatements[this.focusIndex()]);
  private focusTicker: number | null = null;
  readonly selectedLanguage = signal('EN');

  readonly projects: Project[] = [
    {
      title: 'One UI Framework & AI Dev Agent',
      description:
        'Standardized UI/UX across GoDigit by generating reusable Angular components and JSON-bound models while an AI agent parsed BRDs into quality code.',
      stack: ['Angular', 'TypeScript', 'LLMs', 'Camunda', 'Docker'],
      status: 'GoDigit Life · 2024',
      impact: 'Boosted development speed 35% and reduced manual delivery effort by 40%.',
      cta: 'Explore system map',
      link: 'https://www.linkedin.com/in/mayankpathakmp'
    },
    {
      title: 'Underwriting Intelligence Platform',
      description:
        'Data-driven intelligence layer that analyzes historical policy data, captures renewal signals, and drives accurate quoting strategies.',
      stack: ['Angular', 'TypeScript', 'Python', 'SQL', 'AI automation'],
      status: 'GoDigit Life · 2024',
      impact: 'Delivered actionable insights and sped up quoting accuracy for underwriting teams.',
      cta: 'See decision flow',
      link: '#contact'
    },
    {
      title: 'IBM Quantum Circuit Composer Simulator',
      description:
        'Open-source, browser-based simulator with a drag-and-drop circuit editor that outputs Qiskit code and visualizes results via FastAPI + Chart.js.',
      stack: ['React', 'TypeScript', 'Python', 'FastAPI', 'Docker'],
      status: 'Open source · 2025',
      impact: 'Made quantum computing experiments accessible for students and hobbyists.',
      cta: 'Launch demo',
      link: 'https://github.com/mayankpathak10299'
    }
  ];

  readonly experiences: Experience[] = [
    {
      company: 'Digit Life Insurance',
      role: 'Software Engineer',
      period: 'Jul 2024 → Present',
      location: 'Bengaluru',
      contributions: [
        'Architected the One UI framework so squads can scaffold reusable, data-bound Angular components in minutes.',
        'Embedded an AI-powered development agent that converts Business Requirement Documents into production-ready code.',
        'Accelerated release cadence and improved quality by rolling out standardized components across the enterprise.'
      ]
    },
    {
      company: 'Digit Life Insurance',
      role: 'Trainee Developer',
      period: 'Jun 2023 → Jun 2024',
      location: 'Bengaluru',
      contributions: [
        'Digitized the life insurance underwriting journey by launching core modules that reduced paperwork and processing time 30%.',
        'Built SPA tooling for document submission, medical coordination, and real-time KYC validation.',
        'Integrated AI-driven face detection and audio mismatch checks to strengthen Proposal PIVC verification.'
      ]
    }
  ];

  readonly skills: SkillCluster[] = [
    {
      title: 'Languages & Paradigms',
      depth: 'Core stack',
      items: ['Java', 'Python', 'JavaScript', 'TypeScript', 'Object-oriented design']
    },
    {
      title: 'Frontend Systems',
      depth: 'Frameworks & UX',
      items: ['Angular architecture', 'React interfaces', 'HTML/CSS/Sass', 'Responsive design systems']
    },
    {
      title: 'Automation & Intelligence',
      depth: 'AI-driven delivery',
      items: ['LLM + agent design', 'Camunda orchestration', 'Underwriting automation', 'Data visualization']
    },
    {
      title: 'Tools & Operations',
      depth: 'Collaboration & ops',
      items: ['Git & GitHub', 'Docker & DBeaver', 'Postman & API testing', 'Agile rituals']
    }
  ];

  readonly labs: Lab[] = [
    {
      title: 'AgentOps Control Tower',
      blurb: 'Self-hosted portal where Angular dashboards orchestrate AI agents to turn product specs into code, tests, and release notes.',
      category: 'Dev Productivity',
      link: '#'
    },
    {
      title: 'RiskSense Decision Hub',
      blurb: 'Simulation studio blending historical policy data with LLM explainers to stress-test underwriting strategies before launch.',
      category: 'Intelligent Analytics',
      link: '#'
    },
    {
      title: 'Identity Guardian Toolkit',
      blurb: 'Modular verification widgets (face, voice, document) that plug into any Angular SPA to secure onboarding journeys.',
      category: 'Trust & Safety',
      link: '#'
    }
  ];

  readonly articles: Article[] = [
    {
      title: 'Microsoft Certified: Azure Fundamentals (AZ-900)',
      summary: 'Validated knowledge of core cloud services, workloads, and governance.',
      link: 'https://learn.microsoft.com/en-us/certifications/exams/az-900/',
      readTime: 'Issued 2021'
    },
    {
      title: 'HackerRank Certified: React & JavaScript',
      summary: 'Assessed UI engineering patterns, component logic, and JS fundamentals.',
      link: 'https://www.hackerrank.com/certifications',
      readTime: 'Issued 2022'
    },
    {
      title: 'Coursera: HTML, CSS, and JavaScript for Web Developers',
      summary: 'Completed Johns Hopkins course focused on modern responsive web foundations.',
      link: 'https://www.coursera.org/learn/html-css-javascript-for-web-developers',
      readTime: 'Issued 2020'
    }
  ];

  readonly contactChannels: ContactChannel[] = [
    {
      label: 'Email',
      value: 'mayankpathakmvp@gmail.com',
      hint: 'Best for Angular + AI engagements',
      link: 'mailto:mayankpathakmvp@gmail.com'
    },
    {
      label: 'Phone',
      value: '+91 70521 10998',
      hint: 'Available 10:00–19:00 IST',
      link: 'tel:+917052110998'
    },
    {
      label: 'LinkedIn',
      value: 'linkedin.com/in/mayankpathakmp',
      hint: 'Signals, writing, and hiring',
      link: 'https://www.linkedin.com/in/mayankpathakmp'
    },
    {
      label: 'GitHub',
      value: 'github.com/mayankpathak10299',
      hint: 'Projects, experiments, and open source',
      link: 'https://github.com/mayankpathak10299'
    }
  ];

  theme = signal<Theme>('dark');

  private readonly baselineExperience = new Date('2023-06-01');

  readonly experienceYears = computed(() => {
    const ms = Date.now() - this.baselineExperience.getTime();
    const years = Math.floor(ms / (1000 * 60 * 60 * 24 * 365));
    return Math.max(1, years);
  });

  contactModel: ContactModel = {
    name: '',
    email: '',
    topic: '',
    message: ''
  };

  constructor() {
    // Update the global color-scheme token whenever the theme changes.
    effect(() => {
      const mode = this.theme();
      this.documentRef.documentElement.setAttribute('data-theme', mode);
    });

    if (typeof window !== 'undefined') {
      this.focusTicker = window.setInterval(() => {
        this.focusIndex.update((idx) => (idx + 1) % this.focusStatements.length);
      }, 3500);
      this.restoreLanguagePreference();
      this.observeTranslateTargets();
    }
  }

  ngOnDestroy(): void {
    if (this.focusTicker) {
      window.clearInterval(this.focusTicker);
      this.focusTicker = null;
    }
    this.iframeObserver?.disconnect();
  }

  toggleTheme(): void {
    this.theme.update((mode) => (mode === 'dark' ? 'light' : 'dark'));
  }

  handleLanguageChange(code: string): void {
    const normalized = (code || 'EN').toUpperCase();
    this.selectedLanguage.set(normalized);
    this.persistLanguagePreference(normalized);
    this.syncIframeLanguage(normalized);
  }

  scrollToContact(): void {
    const element = this.documentRef.getElementById('contact');
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  sendMessage(form: NgForm): void {
    const payload = this.contactModel;
    if (!payload.email || !payload.message) {
      return;
    }

    const subject = encodeURIComponent(payload.topic || 'Portfolio inquiry');
    const body = encodeURIComponent(`${payload.message}\n\n— ${payload.name || 'Anonymous'} (${payload.email})`);
    const target = `mailto:${this.contactChannels[0].value}?subject=${subject}&body=${body}`;

    if (typeof window !== 'undefined') {
      window.location.href = target;
    }

    form.resetForm();
  }

  trackByLabel = (_: number, item: { label: string }) => item.label;
  trackByTitle = (_: number, item: { title: string }) => item.title;
  trackByCompany = (_: number, item: Experience) => item.company;
  trackByParticle = (_: number, item: ParticleSpec) => item.id;

  private restoreLanguagePreference(): void {
    if (typeof window === 'undefined') {
      return;
    }
    const cached = window.localStorage.getItem(this.languageStorageKey);
    if (cached) {
      this.selectedLanguage.set(cached);
      const schedule = typeof queueMicrotask === 'function' ? queueMicrotask : (cb: () => void) => Promise.resolve().then(cb);
      schedule(() => this.syncIframeLanguage(cached));
    }
  }

  private persistLanguagePreference(code: string): void {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(this.languageStorageKey, code);
  }

  private generateParticles(count: number): ParticleSpec[] {
    return Array.from({ length: count }, (_, index) => {
      const seed = index + 1;
      return {
        id: index,
        x: ((seed * 37) % 1000) / 10,
        y: ((seed * 59) % 1000) / 10,
        size: 3 + ((seed * 17) % 6),
        delay: ((seed * 13) % 30) * 0.15,
        duration: 10 + ((seed * 29) % 12),
        drift: ((seed * 19) % 40) - 20
      } as ParticleSpec;
    });
  }

  private observeTranslateTargets(): void {
    if (typeof MutationObserver === 'undefined') {
      return;
    }

    if (!this.documentRef?.body) {
      return;
    }

    this.iframeObserver = new MutationObserver(() => {
      this.syncIframeLanguage(this.selectedLanguage());
    });

    this.iframeObserver.observe(this.documentRef.body, { childList: true, subtree: true });
  }

  private syncIframeLanguage(code: string): void {
    const frames = Array.from(
      this.documentRef.querySelectorAll<HTMLIFrameElement>(this.iframeSelector)
    );

    frames.forEach((frame) => this.applyLanguageToIframe(frame, code));
  }

  private applyLanguageToIframe(frame: HTMLIFrameElement, code: string): void {
    const normalized = (code || 'EN').toUpperCase();

    const run = () => {
      try {
        const iframeDoc = frame.contentDocument;
        const iframeWin = frame.contentWindow as TranslateWindow | null;

        if (!iframeDoc || !iframeWin) {
          return;
        }

        this.ensureHiddenTranslateHost(iframeDoc);
        this.ensureIframeScript(iframeWin, iframeDoc)
          .then(() => this.waitForIframeCombo(iframeDoc))
          .then((combo) => {
            if (!combo) {
              return;
            }
            combo.value = normalized.toLowerCase();
            combo.dispatchEvent(new Event('change'));
          })
          .catch(() => undefined);
      } catch {
        // Ignore cross-origin frames
      }
    };

    if (frame.contentDocument?.readyState === 'complete') {
      run();
    }

    if (frame.dataset['translateSyncBound'] !== 'true') {
      frame.addEventListener('load', () => run());
      frame.dataset['translateSyncBound'] = 'true';
    }
  }

  private ensureHiddenTranslateHost(doc: Document): void {
    if (doc.getElementById('google_translate_element')) {
      return;
    }
    const holder = doc.createElement('div');
    holder.id = 'google_translate_element';
    holder.style.position = 'absolute';
    holder.style.left = '-9999px';
    holder.style.top = '0';
    holder.setAttribute('aria-hidden', 'true');
    doc.body.appendChild(holder);
  }

  private ensureIframeScript(targetWindow: TranslateWindow, targetDocument: Document): Promise<void> {
    if (targetWindow.__ngTranslatePromise) {
      return targetWindow.__ngTranslatePromise;
    }

    if (targetWindow.google?.translate?.TranslateElement) {
      this.instantiateIframeTranslate(targetWindow);
      targetWindow.__ngTranslatePromise = Promise.resolve();
      return targetWindow.__ngTranslatePromise;
    }

    targetWindow.__ngTranslatePromise = new Promise<void>((resolve) => {
      targetWindow.googleTranslateElementInit = () => {
        this.instantiateIframeTranslate(targetWindow);
        resolve();
      };

      const script = targetDocument.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.defer = true;
      script.onerror = () => resolve();
      targetDocument.head.appendChild(script);
    });

    return targetWindow.__ngTranslatePromise;
  }

  private instantiateIframeTranslate(targetWindow: TranslateWindow): void {
    if (targetWindow.__ngTranslateInitialized || !targetWindow.google?.translate?.TranslateElement) {
      return;
    }

    new targetWindow.google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        includedLanguages: INDIAN_LANGUAGE_CODES,
        autoDisplay: false
      },
      'google_translate_element'
    );

    targetWindow.__ngTranslateInitialized = true;
  }

  private waitForIframeCombo(doc: Document): Promise<HTMLSelectElement | null> {
    if (typeof window === 'undefined') {
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 200;

      const attempt = () => {
        const combo = doc.querySelector('.goog-te-combo') as HTMLSelectElement | null;
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
