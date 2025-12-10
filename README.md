# Mayank Pathak · Portfolio

An Angular 17 + SSR experience crafted to showcase Mayank Pathak—an AI-driven Angular developer. The site blends data-rich storytelling, interactive grids, and a contact workflow powered by Angular signals and theming.

## Highlights
- **AI-native narrative:** hero panel, metrics, and projects are data driven for quick personalization.
- **Command-inspired UI:** marquee focus rail, glass panels, hover micro-interactions, and responsive grid choreography.
- **Theme system:** toggles light/dark by updating `data-theme` on the document root; all sections consume shared CSS tokens.
- **Contact workflow:** form builds a `mailto:` payload so inquiries route directly to the featured inbox.
- **SSR ready:** generated with Angular Universal; `npm run build` outputs browser + server bundles and `npm run serve:ssr:portfolio` hosts them.

## Getting Started
1. Install dependencies
	```bash
	npm install
	```
2. Run the dev server with hot reload
	```bash
	npm start
	```
	Visit `http://localhost:4200`.
3. Build for production + SSR
	```bash
	npm run build
	```
4. Serve the built SSR bundle
	```bash
	npm run serve:ssr:portfolio
	```

## Scripts
| Command | Purpose |
| --- | --- |
| `npm start` | Run `ng serve` in development configuration. |
| `npm run build` | Create optimized browser + server bundles with prerendering enabled. |
| `npm run watch` | Build in watch mode for component prototyping. |
| `npm run test` | Execute Karma unit tests. |
| `npm run serve:ssr:portfolio` | Serve the SSR output via Express. |

## Customizing Content
- Update hero data, project cards, experience timeline, and skills inside `src/app/app.component.ts`.
- Global design tokens live in `src/styles.scss`; update gradients, typography, or spacing there.
- Section-specific layout and animations live in `src/app/app.component.scss`.

## Tech Stack
- Angular 17 standalone components + signals
- Angular Universal (SSR)
- SCSS design system with CSS variables + fluid typography

## Deployment Notes
- Target Node 18+ (current tooling was generated with Angular CLI 17).
- Run `npm run build` before deploying to ensure the `dist/portfolio` directory contains both browser and server bundles.
