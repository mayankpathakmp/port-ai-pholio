# Contributing to Port-AI-Pholio

Thanks for your interest in contributing! Here's how to get started.

## Getting Started

1. **Fork** the repository and clone your fork locally.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Visit `http://localhost:4200` to see the app.

## Development Workflow

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/my-change
   ```
2. Make your changes and ensure they follow existing code conventions.
3. Run unit tests:
   ```bash
   npm run test
   ```
4. Build to verify there are no compilation errors:
   ```bash
   npm run build
   ```
5. Commit with a clear, descriptive message.
6. Push your branch and open a Pull Request against `main`.

## Code Style

- Use Angular standalone components and signals where applicable.
- Follow the existing SCSS design system with CSS custom properties.
- Keep components focused and single-responsibility.
- Use meaningful variable and function names.

## Reporting Issues

- Use GitHub Issues to report bugs or suggest features.
- Include steps to reproduce, expected behavior, and screenshots if applicable.

## Pull Request Guidelines

- Keep PRs focused on a single change.
- Reference related issues in the PR description.
- Ensure all tests pass before requesting a review.
- Update documentation if your change affects usage or setup.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
