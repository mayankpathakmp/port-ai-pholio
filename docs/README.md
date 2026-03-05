# Documentation

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Theming](#theming)
- [Deployment](#deployment)

## Architecture Overview

Port-AI-Pholio is built with **Angular 17** using standalone components and signals. The application is server-side rendered via **Angular Universal** with an Express server.

```
src/
├── app/
│   ├── app.component.ts        # Root component with all section data
│   ├── app.component.html      # Template for hero, projects, contact, etc.
│   ├── app.component.scss      # Section-specific layout and animations
│   ├── app.config.ts           # Browser application config
│   ├── app.config.server.ts    # SSR-specific config
│   ├── app.routes.ts           # Route definitions
│   └── translate-dropdown/     # Multi-language selector component
├── styles.scss                 # Global design tokens and CSS variables
├── main.ts                     # Browser bootstrap
└── main.server.ts              # Server bootstrap
server.ts                       # Express SSR entry point
```

## Theming

The app uses a CSS custom property-based theming system. Toggle between light and dark mode by setting `data-theme` on the document root element.

Design tokens are defined in `src/styles.scss` and consumed across all components. To customize:

1. Edit gradient, color, and typography tokens in `src/styles.scss`.
2. Section-specific styles are in `src/app/app.component.scss`.

## Deployment

### Prerequisites
- Node.js 18+
- npm 9+

### Build & Serve

```bash
# Install dependencies
npm install

# Build browser + server bundles
npm run build

# Serve the SSR application
npm run serve:ssr:portfolio
```

The production build outputs to `dist/portfolio/` with both `browser/` and `server/` directories.

### Docker

A Dockerfile is provided for containerized deployments:

```bash
docker build -t port-ai-pholio .
docker run -p 4000:4000 port-ai-pholio
```
