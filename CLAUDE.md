# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
bundle install   # Ruby/Jekyll
npm install      # Node/Cypress

# Local development server (localhost:4000 with live reload)
npm start

# Run E2E tests (requires server running)
npm test

# Build and deploy to production
npm run deploy
```

Cypress tests are in `cypress/e2e/` and run against `localhost:4000`.

## Architecture

This is a **Jekyll static site** (Ruby, `~4.3.4`) with embedded vanilla JS training apps and a PHP backend for form processing. It deploys to DreamHost via a `prod` git remote.

### Site structure
- **Markdown pages** (`.markdown`) → rendered by Jekyll using layouts from `_layouts/`
- **Reusable components** in `_includes/`: navigation, popups (discount, waitlist, time-preference), PayPal buttons
- **Workshops** (`workshops/pages/*.markdown`) use the `_layouts/workshop.html` layout, which includes sliding-scale pricing, PayPal integration, and popup forms
- PHP form handlers (`workshops/process_waitlist.php`, `workshops/process_time_preference.php`) send email to the site owner on submission

### Interactive JS apps

Three standalone training apps live as subdirectories:

| App | Path | Description |
|-----|------|-------------|
| Form Direction Quiz | `form-direction/` | Canvas quiz app; quiz data (subjects, dot positions) driven by `images.yaml` |
| Skill Training | `skill-training/` | Angle transfer exercise; `angleTransfer.js` implements the skill, `app.js` orchestrates |
| Skills Portal | `skills/` | Pre-built React app output; do not edit files in `skills/assets/` directly |

### Deployment
`npm run deploy` builds the site to `_build/` then rsyncs directly to `/home/dh_uasa28/learn.timdoseart.com/` on the DreamHost server. `_build/` is gitignored — it's purely local build output.
