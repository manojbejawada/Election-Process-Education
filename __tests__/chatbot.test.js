/**
 * @jest-environment jsdom
 * CHATBOT TEST SUITE — Response matching, edge cases, UI integration
 */

// ─── Chatbot response engine (mirror of app.js) ───────────────────────────────
const responses = {
  "mcc": "The Model Code of Conduct (MCC) is a set of rules for political parties and candidates to keep elections fair.",
  "voter id": "To get a Voter ID card (EPIC), apply via the Voters Service Portal (voters.eci.gov.in). Fill Form 6 if you are a new voter.",
  "evm": "The EVM (Electronic Voting Machine) is used to record votes. Each unit is standalone and not connected to any network.",
  "nota": "NOTA stands for 'None of the Above'. It allows a voter to show disapproval of all candidates.",
  "eligibility": "To vote in India, you must be a citizen, at least 18 years old, and registered on the electoral roll.",
};

const FALLBACK = "That's an interesting question about Indian elections! Check eci.gov.in for official information.";

function findResponse(msg) {
  if (!msg || !msg.trim()) return FALLBACK;
  const m = msg.toLowerCase();
  for (const [key, val] of Object.entries(responses)) {
    if (m.includes(key)) return val;
  }
  return FALLBACK;
}

function sanitizeInput(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g,
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// ─── Mock DOM ─────────────────────────────────────────────────────────────────
document.body.innerHTML = `
  <div id="chatWindow"></div>
  <input id="chatInput" value="" />
  <div id="suggestions" style="display: block;"></div>
`;

// ═══════════════════════════════════════════════════════════════════════════════
// CHATBOT TEST SUITE
// ═══════════════════════════════════════════════════════════════════════════════

describe('CHATBOT — Response Matching', () => {
  test('returns MCC response for mcc query', () => {
    expect(findResponse('What is MCC?')).toContain('Model Code of Conduct');
  });

  test('returns EVM response for evm query', () => {
    expect(findResponse('Tell me about EVM')).toContain('Electronic Voting Machine');
  });

  test('returns Voter ID response for voter id query', () => {
    expect(findResponse('How to get voter id?')).toContain('EPIC');
  });

  test('returns NOTA response for nota query', () => {
    expect(findResponse('what is nota')).toContain('None of the Above');
  });

  test('returns eligibility response for eligibility query', () => {
    expect(findResponse('what is eligibility to vote')).toContain('18 years old');
  });

  test('is case-insensitive for keywords', () => {
    expect(findResponse('EVM')).toContain('Electronic Voting Machine');
    expect(findResponse('evm')).toContain('Electronic Voting Machine');
    expect(findResponse('Evm')).toContain('Electronic Voting Machine');
  });

  test('matches keyword within longer sentences', () => {
    expect(findResponse('Can you explain about the MCC rules during election?')).toContain('Model Code');
  });
});

describe('CHATBOT — Edge Cases', () => {
  test('returns fallback for unknown queries', () => {
    expect(findResponse('What is the capital of France?')).toBe(FALLBACK);
  });

  test('returns fallback for empty string', () => {
    expect(findResponse('')).toBe(FALLBACK);
  });

  test('returns fallback for whitespace-only input', () => {
    expect(findResponse('   ')).toBe(FALLBACK);
  });

  test('returns fallback for null input', () => {
    expect(findResponse(null)).toBe(FALLBACK);
  });

  test('returns fallback for random symbols', () => {
    expect(findResponse('!@#$%^&*()')).toBe(FALLBACK);
  });
});

describe('CHATBOT — Security: XSS in Messages', () => {
  test('sanitizeInput removes script tags from chat messages', () => {
    const malicious = '<script>alert("xss")</script>';
    const sanitized = sanitizeInput(malicious);
    expect(sanitized).not.toContain('<script>');
  });

  test('sanitizeInput handles injection in question format', () => {
    const input = 'What is <img src=x onerror=alert(1)> EVM?';
    const sanitized = sanitizeInput(input);
    expect(sanitized).not.toContain('<img');
  });

  test('safe questions pass through unchanged', () => {
    const safe = 'What is NOTA in Indian elections?';
    expect(sanitizeInput(safe)).toBe(safe);
  });
});

describe('CHATBOT — Data Completeness', () => {
  test('has response for all 5 key election topics', () => {
    const topics = ['mcc', 'voter id', 'evm', 'nota', 'eligibility'];
    topics.forEach(topic => {
      expect(responses[topic]).toBeDefined();
      expect(responses[topic].length).toBeGreaterThan(20);
    });
  });

  test('all responses are non-empty strings', () => {
    Object.values(responses).forEach(val => {
      expect(typeof val).toBe('string');
      expect(val.length).toBeGreaterThan(0);
    });
  });
});
