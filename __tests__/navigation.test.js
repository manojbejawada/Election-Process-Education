/**
 * @jest-environment jsdom
 * NAVIGATION & SPA TEST SUITE — Route handling, page transitions, auth redirects
 */

// ─── Mock DOM for SPA navigation ─────────────────────────────────────────────
document.body.innerHTML = `
  <nav id="main-nav">
    <button>Overview</button>
    <button>Timeline</button>
    <button>How to Vote</button>
    <button>Map</button>
    <button>Candidates</button>
    <button>Profile</button>
    <button>Glossary</button>
    <button>Quiz</button>
    <button>Chat</button>
    <button>Google Services</button>
  </nav>
  <div class="page active" id="page-overview"></div>
  <div class="page" id="page-timeline"></div>
  <div class="page" id="page-howtovote"></div>
  <div class="page" id="page-map"></div>
  <div class="page" id="page-candidates"></div>
  <div class="page" id="page-profile"></div>
  <div class="page" id="page-glossary"></div>
  <div class="page" id="page-quiz"></div>
  <div class="page" id="page-chat"></div>
  <div class="page" id="page-gservices"></div>
  <div class="page" id="page-auth"></div>
  <div id="login-text">Login</div>
  <div id="auth-login-side"></div>
  <div id="auth-register-side"></div>
`;

// ─── Minimal SPA implementation for testing ───────────────────────────────────
const PROTECTED = ['profile', 'chat'];
const NAV_MAP = { overview:0, timeline:1, howtovote:2, map:3, candidates:4, profile:5, glossary:6, quiz:7, chat:8, gservices:9, auth:-1 };

function showPage(id, isLoggedIn = false) {
  if (PROTECTED.includes(id) && !isLoggedIn) return 'redirect:auth';

  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
  });

  const target = document.getElementById('page-' + id);
  if (!target) return 'not-found';
  target.style.display = 'block';
  target.classList.add('active');

  document.querySelectorAll('#main-nav button').forEach(b => b.classList.remove('active'));
  if (NAV_MAP[id] >= 0) document.querySelectorAll('#main-nav button')[NAV_MAP[id]].classList.add('active');

  return 'ok';
}

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION TEST SUITE
// ═══════════════════════════════════════════════════════════════════════════════

describe('NAVIGATION — Page Routing', () => {
  test('overview page renders correctly', () => {
    showPage('overview');
    expect(document.getElementById('page-overview').classList.contains('active')).toBe(true);
  });

  test('timeline page renders correctly', () => {
    showPage('timeline');
    expect(document.getElementById('page-timeline').classList.contains('active')).toBe(true);
  });

  test('switching pages hides previous page', () => {
    showPage('overview');
    showPage('glossary');
    expect(document.getElementById('page-overview').classList.contains('active')).toBe(false);
    expect(document.getElementById('page-glossary').classList.contains('active')).toBe(true);
  });

  test('all 10 main pages are present in DOM', () => {
    const pages = ['overview','timeline','howtovote','map','candidates','profile','glossary','quiz','chat','gservices'];
    pages.forEach(id => {
      expect(document.getElementById('page-' + id)).not.toBeNull();
    });
  });

  test('nav button becomes active on page change', () => {
    showPage('glossary');
    const btns = document.querySelectorAll('#main-nav button');
    expect(btns[6].classList.contains('active')).toBe(true);
  });

  test('returns not-found for unknown page id', () => {
    expect(showPage('nonexistent')).toBe('not-found');
  });
});

describe('NAVIGATION — Auth Guard Redirects', () => {
  test('redirects to auth when accessing profile without login', () => {
    expect(showPage('profile', false)).toBe('redirect:auth');
  });

  test('redirects to auth when accessing chat without login', () => {
    expect(showPage('chat', false)).toBe('redirect:auth');
  });

  test('allows profile access when logged in', () => {
    expect(showPage('profile', true)).toBe('ok');
  });

  test('allows chat access when logged in', () => {
    expect(showPage('chat', true)).toBe('ok');
  });

  test('overview is always accessible without login', () => {
    expect(showPage('overview', false)).toBe('ok');
  });

  test('quiz is always accessible without login', () => {
    expect(showPage('quiz', false)).toBe('ok');
  });

  test('auth page is accessible directly', () => {
    expect(showPage('auth', false)).not.toBe('not-found');
  });
});

describe('NAVIGATION — NavMap Integrity', () => {
  test('navMap has correct index for all pages', () => {
    expect(NAV_MAP.overview).toBe(0);
    expect(NAV_MAP.timeline).toBe(1);
    expect(NAV_MAP.glossary).toBe(6);
    expect(NAV_MAP.quiz).toBe(7);
    expect(NAV_MAP.gservices).toBe(9);
    expect(NAV_MAP.auth).toBe(-1);
  });
});
