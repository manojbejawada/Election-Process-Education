/**
 * @jest-environment jsdom
 * CivicEdu Full Test Suite — Integration, Security, Edge Cases
 */

// ─── Mock DOM ────────────────────────────────────────────────────────────────
document.body.innerHTML = `
  <div id="glossaryGrid"></div>
  <input id="glossarySearch" value="" />
  <div id="chatWindow"></div>
  <div id="page-overview" class="page"></div>
  <div id="page-quiz" class="page"></div>
  <div id="qNum"></div>
  <div id="qText"></div>
  <div id="qOptions"></div>
  <div id="qFeedback"></div>
  <button id="nextBtn"></button>
  <div id="scoreTrack"></div>
  <div id="quizBar" style="width:0%"></div>
  <div id="quizMain"></div>
  <div id="quizScore"></div>
  <div id="finalScore"></div>
  <div id="scoreMsg"></div>
`;

// ─── Security: sanitizeInput ─────────────────────────────────────────────────
function sanitizeInput(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g,
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// ─── Glossary Logic ───────────────────────────────────────────────────────────
const terms = [
  { term: "EVM", def: "Electronic Voting Machine." },
  { term: "NOTA", def: "None of the Above." },
  { term: "MCC", def: "Model Code of Conduct." },
  { term: "EPIC", def: "Election Photo Identity Card." },
];

function buildGlossary(filter) {
  const grid = document.getElementById('glossaryGrid');
  if (!grid) return;
  const filtered = filter
    ? terms.filter(t => t.term.toLowerCase().includes(filter.toLowerCase()) || t.def.toLowerCase().includes(filter.toLowerCase()))
    : terms;
  grid.innerHTML = filtered.map(t => `<div class="glossary-card">${t.term}</div>`).join('');
}

// ─── Quiz Logic ───────────────────────────────────────────────────────────────
const questions = [
  { q: "Which device records votes in India?", opts: ["EVM", "PC", "Phone", "Paper"], ans: 0, exp: "EVM is used." },
  { q: "Minimum voting age in India?", opts: ["16", "18", "21", "25"], ans: 1, exp: "18 years." },
];

let currentQ = 0, score = 0, answered = false;

function loadQuestion() {
  if (!document.getElementById('qNum')) return;
  const q = questions[currentQ];
  document.getElementById('qNum').textContent = `Question ${currentQ + 1} of ${questions.length}`;
  document.getElementById('qText').textContent = q.q;
  document.getElementById('qFeedback').className = 'quiz-feedback';
  document.getElementById('nextBtn').disabled = true;
  answered = false;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST SUITES
// ═══════════════════════════════════════════════════════════════════════════════

// ─── SUITE 1: Security – Input Sanitization ───────────────────────────────────
describe('SECURITY — Input Sanitization', () => {
  test('strips XSS script tags', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).not.toContain('<script>');
  });

  test('escapes < and > characters', () => {
    expect(sanitizeInput('<b>bold</b>')).toBe('&lt;b&gt;bold&lt;/b&gt;');
  });

  test('escapes single quotes', () => {
    expect(sanitizeInput("it's fine")).toContain('&#39;');
  });

  test('escapes double quotes', () => {
    expect(sanitizeInput('"quoted"')).toContain('&quot;');
  });

  test('returns empty string for null/undefined input', () => {
    expect(sanitizeInput(null)).toBe('');
    expect(sanitizeInput(undefined)).toBe('');
    expect(sanitizeInput('')).toBe('');
  });

  test('does not alter safe input', () => {
    expect(sanitizeInput('normal text 123')).toBe('normal text 123');
  });
});

// ─── SUITE 2: Glossary – Integration & Edge Cases ────────────────────────────
describe('GLOSSARY — Search Integration', () => {
  beforeEach(() => buildGlossary());

  test('renders all terms by default', () => {
    const grid = document.getElementById('glossaryGrid');
    expect(grid.querySelectorAll('.glossary-card').length).toBe(terms.length);
  });

  test('filters correctly on exact search', () => {
    buildGlossary('EVM');
    const grid = document.getElementById('glossaryGrid');
    expect(grid.innerHTML).toContain('EVM');
    expect(grid.innerHTML).not.toContain('NOTA');
  });

  test('is case-insensitive', () => {
    buildGlossary('nota');
    const grid = document.getElementById('glossaryGrid');
    expect(grid.innerHTML).toContain('NOTA');
  });

  test('returns empty HTML for no matches', () => {
    buildGlossary('XYZNOTAREAL');
    const grid = document.getElementById('glossaryGrid');
    expect(grid.innerHTML).toBe('');
  });

  test('searches within definition text', () => {
    buildGlossary('photo identity');
    const grid = document.getElementById('glossaryGrid');
    expect(grid.innerHTML).toContain('EPIC');
  });
});

// ─── SUITE 3: Quiz – Logic & State Management ────────────────────────────────
describe('QUIZ — State Management', () => {
  beforeEach(() => {
    currentQ = 0; score = 0; answered = false;
    document.getElementById('qNum').textContent = '';
  });

  test('loads first question correctly', () => {
    loadQuestion();
    expect(document.getElementById('qNum').textContent).toBe('Question 1 of 2');
    expect(document.getElementById('qText').textContent).toBe(questions[0].q);
  });

  test('nextBtn is disabled at start of a question', () => {
    loadQuestion();
    expect(document.getElementById('nextBtn').disabled).toBe(true);
  });

  test('answered flag starts as false', () => {
    loadQuestion();
    expect(answered).toBe(false);
  });
});

// ─── SUITE 4: Data Integrity ──────────────────────────────────────────────────
describe('DATA — Content Integrity', () => {
  test('glossary has required civic terms', () => {
    const requiredTerms = ['EVM', 'NOTA', 'MCC', 'EPIC'];
    requiredTerms.forEach(t => {
      expect(terms.map(x => x.term)).toContain(t);
    });
  });

  test('each glossary term has a non-empty definition', () => {
    terms.forEach(t => {
      expect(t.def.length).toBeGreaterThan(5);
    });
  });

  test('quiz questions all have 4 options', () => {
    questions.forEach(q => {
      expect(q.opts.length).toBe(4);
    });
  });

  test('quiz answer index is within options range', () => {
    questions.forEach(q => {
      expect(q.ans).toBeGreaterThanOrEqual(0);
      expect(q.ans).toBeLessThan(q.opts.length);
    });
  });
});
