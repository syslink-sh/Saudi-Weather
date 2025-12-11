# Contributing

Thank you for your interest in contributing to Rainy! This guide will help you get started.

## Code of Conduct

Be respectful and inclusive. We welcome contributors of all backgrounds and experience levels.

## Getting Started

### 1. Fork the Repository

Click the **Fork** button at [github.com/syslink-sh/rainy](https://github.com/syslink-sh/rainy)

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR-USERNAME/rainy.git
cd rainy
```

### 3. Set Up Development Environment

```bash
npm install
npm run dev
```

### 4. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring

## Making Changes

### Code Style

- Use 4 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Use meaningful variable names
- Comment complex logic

### File Organization

```
public/          # Frontend changes
├── css/         # Styles
├── js/          # JavaScript
└── icons/       # PWA icons

server/          # Backend changes
├── controllers/ # API logic
└── routes/      # Route definitions

docs/            # Documentation
```

### Testing Your Changes

1. Run the development server:
   ```bash
   npm run dev
   ```

2. Test in browser at `http://localhost:3005`

3. Test on mobile (use network IP or ngrok)

4. Check browser console for errors

5. Test PWA features:
   - Install prompt
   - Offline mode
   - Add to home screen

## Submitting Changes

### 1. Commit Your Changes

```bash
git add .
git commit -m "Add brief description of changes"
```

Commit message guidelines:
- Start with a verb (Add, Fix, Update, Remove)
- Keep first line under 50 characters
- Add details in body if needed

Good examples:
- `Add hourly precipitation probability`
- `Fix search results not closing on click outside`
- `Update radar layer colors for better visibility`

### 2. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 3. Create Pull Request

1. Go to your fork on GitHub
2. Click **Compare & pull request**
3. Fill out the PR template:
   - Describe what you changed
   - Explain why you made the change
   - Note any breaking changes
   - Add screenshots for UI changes

### 4. Wait for Review

- Maintainers will review your PR
- Address any requested changes
- Once approved, your PR will be merged

## Types of Contributions

### Bug Fixes

1. Check [existing issues](https://github.com/syslink-sh/rainy/issues)
2. Comment on the issue to claim it
3. Reference the issue in your PR: `Fixes #123`

### New Features

1. Open an issue first to discuss the feature
2. Wait for approval before starting work
3. Keep PRs focused on one feature

### Documentation

- Fix typos and errors
- Add missing information
- Improve clarity
- Add examples

### Design/UI

- Follow existing design patterns
- Test on multiple screen sizes
- Consider accessibility
- Keep it simple and clean

## Development Tips

### Hot Reload

The dev server auto-reloads on changes:

```bash
npm run dev
```

### Browser DevTools

- Use Network tab to debug API calls
- Use Application tab for Service Worker
- Use Lighthouse for PWA audit

### Testing Geolocation

Chrome DevTools allows location spoofing:

1. Open DevTools (F12)
2. Click three dots menu → More tools → Sensors
3. Override location

### Testing Offline Mode

1. Open DevTools
2. Go to Network tab
3. Check "Offline" checkbox

### API Debugging

Test API endpoints directly:

```bash
# Health check
curl http://localhost:3005/api/health

# Weather
curl "http://localhost:3005/api/weather?lat=40.7128&lon=-74.0060"

# Search
curl "http://localhost:3005/api/search?q=london"
```

## Project Roadmap

Planned features (contributions welcome!):

- [ ] Weather alerts and notifications
- [ ] Multiple saved locations
- [ ] Weather widgets
- [ ] Unit preference (Celsius/Fahrenheit)
- [ ] Dark mode toggle
- [ ] Language localization

## Getting Help

- Open an [issue](https://github.com/syslink-sh/rainy/issues) for questions
- Check existing issues and PRs
- Read the documentation

## Recognition

Contributors are recognized in:
- The Contributors section on GitHub
- The README.md file

Thank you for contributing! 🌦️
