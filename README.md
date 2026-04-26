# CivicEdu — Indian Election Education Platform

A comprehensive, interactive web application that educates Indian voters about the election process, built with Google Services and web best practices.

---

## 🗳️ Features

- **Election Timeline** — Full Lok Sabha election lifecycle
- **Voter's Guide** — Step-by-step polling day instructions
- **Constituency Map** — Google Maps integration with booth locations
- **Candidates** — Vijayawada 2024 candidate profiles
- **Election Glossary** — 15+ key terms with search
- **Civics Quiz** — 5-question interactive knowledge test
- **AI Assistant** — Keyword-based election chatbot
- **Google Services Showcase** — Live integrations dashboard

---

## 🔵 Google Services Integrated

| Service | Purpose |
|---|---|
| Google Translate | Full site translation: English, Hindi, Telugu |
| Google Maps | Live Vijayawada polling booth map |
| Google Charts | Voter demographics & phase-wise turnout charts |
| Google Calendar | Indian election dates & Add-to-Calendar |
| YouTube | Election awareness video embeds |
| Firebase Auth | Secure voter sign-in & session management |
| Google Analytics | Engagement tracking for civic education |
| Google Fonts | Premium accessible typography |

---

## 🛡️ Security

- **XSS Prevention** — `sanitizeInput()` applied to ALL user inputs
- **Auth Guard** — Protected routes redirect unauthenticated users
- **Content Security Policy** — CSP meta tag restricts script sources
- **Input Validation** — Email format & password length checks
- **try/catch guards** — Safe localStorage JSON parsing

---

## ✅ Testing

This project uses **Jest** for automated testing with **4 test suites** covering 55+ test cases.

### Run All Tests
```bash
npm install
npm test
```

### Individual Suites
```bash
npm run test:security     # XSS, Auth Guard, Input Validation (17 tests)
npm run test:navigation   # SPA routing, page switching, redirects (15 tests)
npm run test:chatbot      # Response matching, edge cases, security (19 tests)
npm run test:app          # Glossary, Quiz, Data Integrity (22 tests)
```

### Coverage Report
```bash
npm test -- --coverage
```

Coverage targets: **70% functions, 70% lines**

---

## ⚡ Efficiency

- **Progressive Web App (PWA)** — `manifest.json` + `sw.js` Service Worker
- **Offline Caching** — HTML, CSS, JS cached via Service Worker
- **DNS Prefetch** — Resource hints for Google CDN domains
- **SPA Architecture** — Zero page reloads via CSS class toggling
- **Lazy Loading** — Maps iframe loads lazily

---

## ♿ Accessibility

- `aria-label` on all interactive elements
- `role="button"` + `tabindex="0"` on clickable cards
- `role="main"` and `role="contentinfo"` on semantic sections
- Keyboard navigation via `onkeydown` Enter handlers
- WCAG AA compliant color contrast ratios
- Google Translate for multilingual access

---

## 🚀 Deployment (Google Cloud Run)

```bash
# Build container
docker build -t civicedu .

# Run locally
docker run -p 8080:8080 civicedu

# Deploy to Cloud Run
gcloud run deploy civicedu \
  --source . \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated
```

---

## 📁 Project Structure

```
civicedu/
├── index.html          # Semantic SPA shell
├── styles.css          # Design system with CSS variables
├── app.js              # Application logic & state management
├── tests.js            # Client-side diagnostic tests
├── sw.js               # Service Worker for offline caching
├── manifest.json       # PWA manifest
├── Dockerfile          # GCP Cloud Run container config
├── __tests__/
│   ├── app.test.js         # Glossary, Quiz, Data Integrity
│   ├── security.test.js    # XSS, Auth, Validation
│   ├── navigation.test.js  # SPA routing & auth guards
│   └── chatbot.test.js     # Chatbot responses & edge cases
└── .github/
    └── workflows/
        └── main.yml    # CI/CD pipeline (GitHub Actions)
```

---

*CivicEdu — Empowering Informed Indian Voters. Desh Ka Garv. 🇮🇳*
