/**
 * @jest-environment jsdom
 * SECURITY TEST SUITE — XSS Prevention, Input Validation, Auth Guards
 */

// ─── Security: sanitizeInput ──────────────────────────────────────────────────
function sanitizeInput(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g,
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// ─── Auth Guard Logic ─────────────────────────────────────────────────────────
const PROTECTED_PAGES = ['profile', 'chat'];

function canAccessPage(pageId, isLoggedIn) {
  if (PROTECTED_PAGES.includes(pageId) && !isLoggedIn) return false;
  return true;
}

// ─── Email Validation ─────────────────────────────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── Password Strength ────────────────────────────────────────────────────────
function isStrongPassword(pass) {
  return pass && pass.length >= 8;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECURITY TEST SUITE
// ═══════════════════════════════════════════════════════════════════════════════

describe('SECURITY — XSS Prevention', () => {
  test('blocks <script> injection', () => {
    const input = '<script>alert("xss")</script>';
    expect(sanitizeInput(input)).not.toContain('<script>');
    expect(sanitizeInput(input)).not.toContain('</script>');
  });

  test('blocks img onerror attack', () => {
    const input = '<img src=x onerror=alert(1)>';
    expect(sanitizeInput(input)).not.toContain('<img');
    expect(sanitizeInput(input)).not.toContain('onerror');
  });

  test('escapes all dangerous characters', () => {
    expect(sanitizeInput('<')).toBe('&lt;');
    expect(sanitizeInput('>')).toBe('&gt;');
    expect(sanitizeInput('&')).toBe('&amp;');
    expect(sanitizeInput('"')).toBe('&quot;');
    expect(sanitizeInput("'")).toBe('&#39;');
  });

  test('handles empty and null inputs safely', () => {
    expect(sanitizeInput('')).toBe('');
    expect(sanitizeInput(null)).toBe('');
    expect(sanitizeInput(undefined)).toBe('');
  });

  test('preserves safe alphanumeric text', () => {
    expect(sanitizeInput('Hello World 123')).toBe('Hello World 123');
  });

  test('preserves unicode and multilingual text safely', () => {
    expect(sanitizeInput('हिंदी తెలుగు')).toBe('हिंदी తెలుగు');
  });
});

describe('SECURITY — Auth Guard', () => {
  test('blocks unauthenticated access to profile page', () => {
    expect(canAccessPage('profile', false)).toBe(false);
  });

  test('blocks unauthenticated access to chat page', () => {
    expect(canAccessPage('chat', false)).toBe(false);
  });

  test('allows authenticated access to profile page', () => {
    expect(canAccessPage('profile', true)).toBe(true);
  });

  test('allows unauthenticated access to public pages', () => {
    ['overview', 'timeline', 'howtovote', 'map', 'glossary', 'quiz'].forEach(page => {
      expect(canAccessPage(page, false)).toBe(true);
    });
  });
});

describe('SECURITY — Input Validation', () => {
  test('validates correct email format', () => {
    expect(isValidEmail('voter@example.in')).toBe(true);
    expect(isValidEmail('test.user@domain.co')).toBe(true);
  });

  test('rejects invalid email formats', () => {
    expect(isValidEmail('notanemail')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
    expect(isValidEmail('missing@')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });

  test('enforces minimum password length of 8', () => {
    expect(isStrongPassword('12345678')).toBe(true);
    expect(isStrongPassword('short')).toBe(false);
    expect(isStrongPassword('')).toBe(false);
    expect(isStrongPassword(null)).toBe(false);
  });
});
