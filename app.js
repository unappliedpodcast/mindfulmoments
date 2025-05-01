const prompts = [{"id": "abc123", "text": "What are you grateful for today?", "premium": false}, {"id": "def456", "text": "Reflect on a moment of peace you experienced.", "premium": true}, {"id": "ghi789", "text": "What\u2019s a small win you had this week?", "premium": false}, {"id": "jkl012", "text": "Describe a time you felt truly present.", "premium": true}, {"id": "mno345", "text": "What\u2019s something you\u2019re looking forward to?", "premium": false}, {"id": "pqr678", "text": "How did you show kindness today?", "premium": true}, {"id": "stu901", "text": "What\u2019s a challenge you overcame recently?", "premium": false}, {"id": "vwx234", "text": "Write about a place that feels calming to you.", "premium": true}, {"id": "yza567", "text": "What\u2019s a goal you\u2019re working toward?", "premium": false}, {"id": "bcd890", "text": "Reflect on a happy memory from this month.", "premium": true}, {"id": "efg123", "text": "What\u2019s one thing you learned today?", "premium": false}, {"id": "hij456", "text": "Describe a moment you felt proud of yourself.", "premium": true}, {"id": "klm789", "text": "What\u2019s a habit you\u2019re trying to build?", "premium": false}, {"id": "nop012", "text": "Reflect on a time you helped someone.", "premium": true}, {"id": "qrs345", "text": "What\u2019s a simple joy you experienced today?", "premium": false}, {"id": "tuv678", "text": "Write about a dream you have for the future.", "premium": true}, {"id": "wxy901", "text": "What\u2019s something you appreciate about yourself?", "premium": false}, {"id": "zab234", "text": "Describe a moment you felt connected to nature.", "premium": true}, {"id": "cde567", "text": "What\u2019s a lesson you\u2019ve learned this week?", "premium": false}, {"id": "fgh890", "text": "Reflect on a moment of gratitude.", "premium": true}];

const homeScreen = document.getElementById('home-screen');
const historyScreen = document.getElementById('history-screen');
const premiumScreen = document.getElementById('premium-screen');

const promptEl = document.getElementById('prompt');
const entryEl = document.getElementById('entry');
const moodEl = document.getElementById('mood');
const historyBtn = document.getElementById('history-btn');
const premiumBtn = document.getElementById('premium-btn');
const saveBtn = document.getElementById('save-btn');
const historyList = document.getElementById('history-list');
const premiumList = document.getElementById('premium-prompts');

const premiumUnlocked = localStorage.getItem('premiumUnlocked') === 'true';

// show today's prompt
function showPrompt() {
  const today = new Date().toISOString().slice(0,10);
  // pick first prompt with matching date or cycle by modulo
  let idx = prompts.findIndex(p => p.date === today);
  if (idx === -1) { idx = (new Date().getDate()) % prompts.length; }
  const p = prompts[idx];
  if(p.premium && !premiumUnlocked) {
    promptEl.textContent = "Donate to unlock today’s premium prompt!";
  } else {
    promptEl.textContent = p.text;
  }
}

// save entry
saveBtn.addEventListener('click', () => {
  const entryText = entryEl.value.trim();
  if(!entryText) return alert('Please write something first!');
  const mood = moodEl.value;
  const entry = {
    text: entryText,
    mood,
    date: new Date().toLocaleDateString()
  };
  const entries = JSON.parse(localStorage.getItem('entries') || '[]');
  entries.unshift(entry);
  localStorage.setItem('entries', JSON.stringify(entries));
  entryEl.value = '';
  alert('Saved!');
});

// show history
function loadHistory() {
  historyList.innerHTML = '';
  const entries = JSON.parse(localStorage.getItem('entries') || '[]');
  entries.forEach(e => {
    const li = document.createElement('li');
    li.className = 'entry';
    li.textContent = `${e.date} – ${e.text}  ( ${e.mood} )`;
    historyList.appendChild(li);
  });
}

// show premium prompts
function loadPremium() {
  premiumList.innerHTML = '';
  const unlocked = localStorage.getItem('premiumUnlocked') === 'true';
  if(!unlocked) {
    const msg = document.createElement('p');
    msg.textContent = "Donate on Ko‑fi, then return and click the button below to unlock.";
    premiumList.appendChild(msg);

    const unlockBtn = document.createElement('button');
    unlockBtn.textContent = "I donated – unlock now";
    unlockBtn.addEventListener('click', () => {
      localStorage.setItem('premiumUnlocked', 'true');
      loadPremium();
    });
    premiumList.appendChild(unlockBtn);
    return;
  }
  prompts.filter(p => p.premium).forEach(p => {
    const li = document.createElement('li');
    li.className = 'entry';
    li.textContent = p.text;
    premiumList.appendChild(li);
  });
}

// navigation
historyBtn.addEventListener('click', () => {
  loadHistory();
  homeScreen.classList.add('hidden');
  historyScreen.classList.remove('hidden');
});

premiumBtn.addEventListener('click', () => {
  loadPremium();
  homeScreen.classList.add('hidden');
  premiumScreen.classList.remove('hidden');
});

document.querySelectorAll('.back-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    historyScreen.classList.add('hidden');
    premiumScreen.classList.add('hidden');
    homeScreen.classList.remove('hidden');
  });
});

// Service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js');
  });
}

showPrompt();
