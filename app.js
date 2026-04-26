// NAVIGATION FIX WITH SECURITY GUARD
function showPage(id) {
  // SECURITY GUARD: Protect sensitive pages
  const protectedPages = ['profile', 'chat'];
  const user = localStorage.getItem('civicUser');

  if (protectedPages.includes(id) && !user) {
    alert('Security Notice: Please sign in to access this protected section.');
    showPage('auth');
    toggleAuthMode('login');
    return;
  }

  // Hide all pages
  const pages = document.querySelectorAll('.page');
  pages.forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none'; // Force hide
  });

  // Show target page
  const target = document.getElementById('page-' + id);
  if (target) {
    target.style.display = 'block'; // Force show
    setTimeout(() => target.classList.add('active'), 10);
  }

  // Update Nav Buttons
  const navButtons = document.querySelectorAll('#main-nav button');
  navButtons.forEach(btn => btn.classList.remove('active'));

  // Find button by text or index mapping
  const navMap = { overview: 0, timeline: 1, howtovote: 2, map: 3, candidates: 4, profile: 5, glossary: 6, quiz: 7, chat: 8, auth: -1 };
  if (navMap[id] !== undefined && navMap[id] >= 0) {
    navButtons[navMap[id]].classList.add('active');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setChip(el) {
  document.querySelectorAll('.topic-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

// GLOSSARY DATA
const terms = [
  { term: "EVM", def: "Electronic Voting Machine. A standalone battery-operated device used to record votes. It consists of a Control Unit and a Balloting Unit." },
  { term: "VVPAT", def: "Voter Verifiable Paper Audit Trail. A machine attached to the EVM that prints a slip showing the candidate's name and symbol for 7 seconds to confirm your vote." },
  { term: "MCC", def: "Model Code of Conduct. Guidelines for political parties and candidates during elections to ensure free and fair polls, effective from the date of announcement." },
  { term: "NOTA", def: "'None of the Above' option on the EVM, allowing a voter to officially record their rejection of all candidates in the fray." },
  { term: "EPIC", def: "Election Photo Identity Card. Commonly known as the Voter ID card, issued by the ECI to registered voters." },
  { term: "Voter Slip", def: "A non-ID document issued by the ECI that contains your voter list number and booth details, distributed before the poll." },
  { term: "Lok Sabha", def: "The House of the People (Lower House) of India's Parliament. Members are directly elected by the public every 5 years." },
  { term: "Assembly", def: "Vidhan Sabha. The state-level legislative body. Elections happen every 5 years unless dissolved earlier." },
  { term: "Constituency", def: "A specific geographical area represented by a single elected member in the Parliament or Assembly." },
  { term: "Strongroom", def: "A highly secured, monitored room where EVMs are kept from the time of polling until the counting day." },
  { term: "Exit Poll", def: "A poll taken immediately after voters leave the polling station, conducted by private agencies to predict the result." },
  { term: "Booth Capture", def: "An illegal act where thugs take control of a polling station to cast fraudulent votes. Modern EVMs and security have made this rare." },
  { term: "Manifesto", def: "A public declaration of policies and aims issued by a political party before an election." },
  { term: "Bye-election", def: "An election held to fill a vacancy that arises during the term of a legislative body (due to death or resignation)." },
  { term: "Chief Election Commissioner", def: "The head of the Election Commission of India, responsible for overseeing national and state elections." },
];

function buildGlossary(filter) {
  const grid = document.getElementById('glossaryGrid');
  if (!grid) return;
  const filtered = filter ? terms.filter(t => t.term.toLowerCase().includes(filter.toLowerCase()) || t.def.toLowerCase().includes(filter.toLowerCase())) : terms;
  grid.innerHTML = filtered.map(t => `<div class="glossary-card"><div class="glossary-term">${t.term}</div><div class="glossary-def">${t.def}</div></div>`).join('');
  if (!filtered.length) grid.innerHTML = '<div style="color:var(--ink-3);font-size:0.9rem;">No terms found.</div>';
}
function filterGlossary() { buildGlossary(document.getElementById('glossarySearch').value); }
buildGlossary();

// QUIZ DATA
const questions = [
  { q: "Which device is used to record votes in India?", opts: ["Barcode Scanner", "EVM", "Paper Ballot Only", "Touchscreen PC"], ans: 1, exp: "EVMs (Electronic Voting Machines) have been used in all Lok Sabha and Assembly elections in India for years." },
  { q: "What is the duration of a Lok Sabha term?", opts: ["4 Years", "5 Years", "6 Years", "Unlimited"], ans: 1, exp: "The term of the Lok Sabha is 5 years from the date of its first meeting." },
  { q: "Who appoints the Chief Election Commissioner of India?", opts: ["The Prime Minister", "The Chief Justice", "The President of India", "The Parliament"], ans: 2, exp: "The President of India appoints the Chief Election Commissioner and other Election Commissioners." },
  { q: "Which finger is marked with indelible ink after voting?", opts: ["Right Thumb", "Left Index Finger", "Right Index Finger", "Left Ring Finger"], ans: 1, exp: "As per rule, the left index finger is marked to prevent duplicate voting." },
  { q: "What is the minimum age to contest Lok Sabha elections?", opts: ["18 Years", "21 Years", "25 Years", "35 Years"], ans: 2, exp: "While the voting age is 18, you must be at least 25 years old to stand as a candidate for Lok Sabha or Vidhan Sabha." }
];

let currentQ = 0, score = 0, answered = false;
function loadQuestion() {
  const qNum = document.getElementById('qNum');
  if (!qNum) return;
  const q = questions[currentQ];
  qNum.textContent = `Question ${currentQ + 1} of ${questions.length}`;
  document.getElementById('qText').textContent = q.q;
  document.getElementById('quizBar').style.width = ((currentQ / questions.length) * 100) + '%';
  document.getElementById('qFeedback').className = 'quiz-feedback';
  document.getElementById('nextBtn').disabled = true;
  answered = false;
  const letters = ['A', 'B', 'C', 'D'];
  document.getElementById('qOptions').innerHTML = q.opts.map((o, i) =>
    `<button class="quiz-opt" onclick="selectOpt(this,${i})" data-idx="${i}">
      <span class="quiz-opt-letter">${letters[i]}</span>${o}
    </button>`
  ).join('');
}
function selectOpt(btn, idx) {
  if (answered) return;
  answered = true;
  const q = questions[currentQ];
  const opts = document.querySelectorAll('.quiz-opt');
  opts.forEach(o => o.disabled = true);
  const fb = document.getElementById('qFeedback');
  if (idx === q.ans) {
    score++;
    btn.classList.add('correct');
    fb.textContent = '✅ Correct! ' + q.exp;
    fb.className = 'quiz-feedback correct show';
  } else {
    btn.classList.add('wrong');
    opts[q.ans].classList.add('correct');
    fb.textContent = '❌ Not quite. ' + q.exp;
    fb.className = 'quiz-feedback wrong show';
  }
  document.getElementById('scoreTrack').textContent = `Score: ${score}/${currentQ + 1}`;
  document.getElementById('nextBtn').disabled = false;
  document.getElementById('nextBtn').textContent = currentQ < questions.length - 1 ? 'Next Question →' : 'See Results →';
}
function nextQuestion() {
  currentQ++;
  if (currentQ >= questions.length) {
    showResults(); return;
  }
  loadQuestion();
}
function showResults() {
  document.getElementById('quizMain').style.display = 'none';
  const scoreEl = document.getElementById('quizScore');
  scoreEl.className = 'quiz-score show';
  document.getElementById('finalScore').textContent = score;
  document.getElementById('quizBar').style.width = '100%';
  const pct = score / questions.length;
  if (pct >= 0.8) { document.getElementById('scoreMsg').textContent = '🏆 National Expert!'; }
  else { document.getElementById('scoreMsg').textContent = '📚 Keep Learning!'; }
}
function resetQuiz() {
  currentQ = 0; score = 0;
  document.getElementById('quizMain').style.display = 'block';
  document.getElementById('quizScore').className = 'quiz-score';
  document.getElementById('scoreTrack').textContent = '';
  loadQuestion();
}

// CHAT DATA
const responses = {
  "mcc": "The Model Code of Conduct (MCC) is a set of rules for political parties and candidates to keep elections fair. It bans the use of government funds for campaigning, prevents the announcement of new schemes during polls, and restricts inflammatory speeches.",
  "voter id": "To get a Voter ID card (EPIC), you can apply online via the Voters Service Portal (voters.eci.gov.in). You'll need to fill Form 6 if you are a new voter. You must be 18 years old.",
  "evm": "The EVM (Electronic Voting Machine) is used to record votes. Each unit is standalone and not connected to any network. The VVPAT (Voter Verifiable Paper Audit Trail) prints a slip to show you that your vote was cast for the correct candidate.",
  "nota": "NOTA stands for 'None of the Above'. It allows a voter to show their disapproval of all candidates on the ballot. However, even if NOTA gets the most votes, the candidate with the next highest votes is declared the winner.",
  "eligibility": "To vote in India, you must be a citizen of India, at least 18 years old, and your name must be in the electoral roll of the constituency where you live.",
};

function findResponse(msg) {
  const m = msg.toLowerCase();
  for (const [key, val] of Object.entries(responses)) {
    if (m.includes(key)) return val;
  }
  return "That's an interesting question about Indian elections! I'd recommend checking the official Election Commission of India (ECI) website at eci.gov.in for the most detailed and legal definitions. You can also explore the Timeline and Glossary sections of this app!";
}
function addMsg(text, isUser) {
  const win = document.getElementById('chatWindow');
  const msg = document.createElement('div');
  msg.className = 'msg' + (isUser ? ' user' : '');
  msg.innerHTML = `<div class="msg-avatar">${isUser ? '👤' : '🗳️'}</div><div class="msg-bubble">${text}</div>`;
  win.appendChild(msg);
  win.scrollTop = win.scrollHeight;
}
function addTyping() {
  const win = document.getElementById('chatWindow');
  const div = document.createElement('div');
  div.className = 'msg'; div.id = 'typing';
  div.innerHTML = `<div class="msg-avatar">🗳️</div><div class="msg-bubble"><div class="typing"><span></span><span></span><span></span></div></div>`;
  win.appendChild(div);
  win.scrollTop = win.scrollHeight;
}
function removeTyping() {
  const t = document.getElementById('typing');
  if (t) t.remove();
}
function sendChat() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  addMsg(msg, true);
  input.value = '';
  addTyping();
  setTimeout(() => {
    removeTyping();
    addMsg(findResponse(msg), false);
  }, 1000);
}
function sendSuggestion(btn) {
  document.getElementById('chatInput').value = btn.textContent;
  sendChat();
  document.getElementById('suggestions').style.display = 'none';
}

// PROFILE & LANGUAGE LOGIC
function toggleVoterType(btn, type) {
  const parent = btn.parentElement;
  parent.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function setLanguage(lang) {
  const translateCombo = document.querySelector('.goog-te-combo');
  if (translateCombo) {
    translateCombo.value = lang;
    translateCombo.dispatchEvent(new Event('change'));
  }
  // Update active state in UI
  document.querySelectorAll('.lang-option').forEach(opt => opt.classList.remove('active'));
  if (event && event.currentTarget) {
    const clicked = event.currentTarget;
    clicked.classList.add('active');
  }
}

function updateProfile() {
  const age = document.getElementById('userAge').value;
  alert('Profile updated! Age: ' + age);
}

function saveAccount() {
  const name = document.getElementById('userName').value;
  const email = document.getElementById('userEmail').value;
  alert('Account saved successfully for: ' + name + ' (' + email + ')');
}

function checkAuth() {
  const userStr = localStorage.getItem('civicUser');
  const loginText = document.getElementById('login-text');
  const nameField = document.getElementById('userName');
  const emailField = document.getElementById('userEmail');

  if (userStr) {
    const user = JSON.parse(userStr);
    // Update Header
    if (loginText) loginText.textContent = user.name.split(' ')[0];
    // Update Profile Page Fields
    if (nameField) nameField.value = user.name;
    if (emailField) emailField.value = user.email;
  } else {
    if (loginText) loginText.textContent = 'Login';
    if (nameField) nameField.value = '';
    if (emailField) emailField.value = '';
  }
  showPage('overview');
}

function toggleAuth() {
  const user = localStorage.getItem('civicUser');
  if (user) {
    showPage('profile');
  } else {
    showPage('auth');
    // Default to login mode if they already have an account link
    toggleAuthMode('login');
  }
}

function toggleAuthMode(mode) {
  if (mode === 'login') {
    document.getElementById('auth-register-side').style.display = 'none';
    document.getElementById('auth-login-side').style.display = 'block';
  } else {
    document.getElementById('auth-register-side').style.display = 'block';
    document.getElementById('auth-login-side').style.display = 'none';
  }
}

function signIn() {
  const email = document.getElementById('loginEmail').value;
  const pass = document.getElementById('loginPass').value;

  if (!email || !pass) {
    alert('Please enter your email and password.');
    return;
  }

  auth.signInWithEmailAndPassword(email, pass)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = { 
        name: user.displayName || 'Voter', 
        email: user.email 
      };
      localStorage.setItem('civicUser', JSON.stringify(userData));
      alert('Welcome back, ' + userData.name + '!');
      checkAuth();
    })
    .catch((error) => {
      alert('Login Error: ' + error.message);
    });
}

function createAccount() {
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const pass = document.getElementById('regPass').value;

  if (!name || !email || !pass) {
    alert('Please fill in all fields to create your account.');
    return;
  }

  // REAL FIREBASE AUTH
  auth.createUserWithEmailAndPassword(email, pass)
    .then((userCredential) => {
      // Save user name to profile
      return userCredential.user.updateProfile({ displayName: name });
    })
    .then(() => {
      const userData = { name, email, createdAt: new Date() };
      localStorage.setItem('civicUser', JSON.stringify(userData));
      
      // Sync to Profile Page fields
      if (document.getElementById('userName')) document.getElementById('userName').value = name;
      if (document.getElementById('userEmail')) document.getElementById('userEmail').value = email;

      alert('Welcome to CivicEdu, ' + name + '! Your account is now active on Firebase.');
      checkAuth();
    })
    .catch((error) => {
      alert('Firebase Error: ' + error.message);
    });
}

function logout() {
  localStorage.removeItem('civicUser');
  if (typeof auth !== 'undefined') {
    auth.signOut().then(() => {
      location.reload();
    });
  } else {
    location.reload();
  }
}

// Real-time Auth Observer to keep Profile visible
if (typeof auth !== 'undefined') {
  auth.onAuthStateChanged((user) => {
    if (user) {
      const userData = { 
        name: user.displayName || 'Voter', 
        email: user.email 
      };
      localStorage.setItem('civicUser', JSON.stringify(userData));
      // Update profile fields immediately
      const nameField = document.getElementById('userName');
      const emailField = document.getElementById('userEmail');
      const loginText = document.getElementById('login-text');
      if (nameField) nameField.value = userData.name;
      if (emailField) emailField.value = userData.email;
      if (loginText) loginText.textContent = userData.name.split(' ')[0];
    }
  });
}

// Initial loads
window.addEventListener('load', () => {
  checkAuth();
  buildGlossary();
  loadQuestion();
});
