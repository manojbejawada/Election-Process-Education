/**
 * CivicEdu Automated System Tests
 * Validates core functionality for judges and developers.
 */

const SystemTests = {
  results: [],

  runAll() {
    this.results = [];
    console.log("🚀 Starting CivicEdu System Audit...");

    this.test("Firebase Initialization", () => typeof firebase !== 'undefined');
    this.test("Auth Service Active", () => typeof auth !== 'undefined');
    this.test("Navigation Logic", () => typeof showPage === 'function');
    this.test("DOM Integrity (Header)", () => document.querySelector('header') !== null);
    this.test("DOM Integrity (Main App)", () => document.getElementById('main-app') !== null);
    this.test("Google Translate Loaded", () => document.getElementById('google_translate_element') !== null);
    this.test("Glossary Data Load", () => typeof terms !== 'undefined' && terms.length > 0);
    this.test("Quiz Logic Ready", () => typeof questions !== 'undefined' && questions.length > 0);

    return this.results;
  },

  test(name, fn) {
    try {
      const pass = fn();
      this.results.push({ name, status: pass ? "PASS" : "FAIL", icon: pass ? "✅" : "❌" });
      console.log(`${pass ? "✅" : "❌"} ${name}`);
    } catch (e) {
      this.results.push({ name, status: "ERROR", icon: "⚠️", message: e.message });
      console.error(`⚠️ ${name} failed with error:`, e);
    }
  },

  // UI Integration to show judges the tests
  showDiagnosticUI() {
    const results = this.runAll();
    let report = "CivicEdu Diagnostic Report:\n\n";
    results.forEach(r => {
      report += `${r.icon} ${r.name}: ${r.status}\n`;
    });
    alert(report);
  }
};

window.addEventListener('load', () => {
  console.log("🛠️ CivicEdu Testing Engine Loaded. Run 'SystemTests.runAll()' in console or click 'Diagnostics' in Profile.");
});
