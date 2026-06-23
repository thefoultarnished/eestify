// popup.js - Eestify

const wordOfDayList = [
  { et: 'tere', en: 'hello', phonetic: '[ˈtere]', example: '"Tere, kuidas läheb?" - Hello, how are you?' },
  { et: 'aitäh', en: 'thank you', phonetic: '[ˈɑitæh]', example: '"Aitäh abi eest!" - Thank you for the help!' },
  { et: 'armastus', en: 'love', phonetic: '[ˈɑrmɑstus]', example: '"Armastus on ilus." - Love is beautiful.' },
  { et: 'sõber', en: 'friend', phonetic: '[ˈsøber]', example: '"Ta on minu sõber." - He is my friend.' },
  { et: 'kodu', en: 'home', phonetic: '[ˈkodu]', example: '"Ma lähen koju." - I am going home.' },
  { et: 'päike', en: 'sun', phonetic: '[ˈpæike]', example: '"Päike paistab." - The sun is shining.' },
  { et: 'raamat', en: 'book', phonetic: '[ˈrɑːmɑt]', example: '"See on hea raamat." - This is a good book.' },
  { et: 'õnnelik', en: 'happy', phonetic: '[ˈønnelik]', example: '"Ma olen õnnelik." - I am happy.' },
  { et: 'vesi', en: 'water', phonetic: '[ˈvesi]', example: '"Palun vett." - Water, please.' },
  { et: 'pere', en: 'family', phonetic: '[ˈpere]', example: '"Minu pere on suur." - My family is big.' },
];

const achievements = [
  { id: 'first_word', icon: '🎯', title: 'First Steps', desc: 'See your first translated word', check: s => s.seen >= 1 },
  { id: 'ten_words', icon: '📚', title: 'Getting Started', desc: 'See 10 translated words', check: s => s.seen >= 10 },
  { id: 'fifty_words', icon: '🌟', title: 'Word Explorer', desc: 'See 50 translated words', check: s => s.seen >= 50 },
  { id: 'hundred_words', icon: '💯', title: 'Century Club', desc: 'See 100 translated words', check: s => s.seen >= 100 },
  { id: 'first_quiz', icon: '❓', title: 'Quiz Starter', desc: 'Complete your first quiz', check: s => s.quizzes >= 1 },
  { id: 'ten_quizzes', icon: '🧠', title: 'Quiz Master', desc: 'Complete 10 quizzes', check: s => s.quizzes >= 10 },
  { id: 'streak_3', icon: '🔥', title: 'On Fire', desc: '3 day streak', check: s => s.streak >= 3 },
  { id: 'streak_7', icon: '⚡', title: 'Week Warrior', desc: '7 day streak', check: s => s.streak >= 7 },
  { id: 'first_fav', icon: '⭐', title: 'Collector', desc: 'Add first favorite word', check: (s, f) => f.length >= 1 },
  { id: 'mastered_5', icon: '🏆', title: 'Mastery Begins', desc: 'Master 5 words', check: s => s.mastered >= 5 },
];

const quizWords = [
  { et: 'koer', en: 'dog', hint: 'A pet that barks' },
  { et: 'kass', en: 'cat', hint: 'A pet that meows' },
  { et: 'maja', en: 'house', hint: 'Where you live' },
  { et: 'auto', en: 'car', hint: 'Vehicle with 4 wheels' },
  { et: 'raamat', en: 'book', hint: 'You read this' },
  { et: 'vesi', en: 'water', hint: 'H2O' },
  { et: 'leib', en: 'bread', hint: 'Baked food' },
  { et: 'piim', en: 'milk', hint: 'White drink from cows' },
  { et: 'õun', en: 'apple', hint: 'Red or green fruit' },
  { et: 'päev', en: 'day', hint: 'Opposite of night' },
  { et: 'öö', en: 'night', hint: 'When it is dark' },
  { et: 'ema', en: 'mother', hint: 'Female parent' },
  { et: 'isa', en: 'father', hint: 'Male parent' },
  { et: 'laps', en: 'child', hint: 'Young person' },
  { et: 'suur', en: 'big', hint: 'Opposite of small' },
  { et: 'väike', en: 'small', hint: 'Opposite of big' },
  { et: 'hea', en: 'good', hint: 'Opposite of bad' },
  { et: 'ilus', en: 'beautiful', hint: 'Pleasing to look at' },
  { et: 'kiire', en: 'fast', hint: 'Opposite of slow' },
  { et: 'aeglane', en: 'slow', hint: 'Not fast' },
];

let quizCorrect = 0, quizTotal = 0;

document.addEventListener('DOMContentLoaded', () => {
  // Tab switching
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
  });

  loadSettings();
  setupEventListeners();
  loadWordOfDay();
  loadQuiz();
  loadAchievements();
  loadBlacklist();
  loadCustomWords();
});

function loadSettings() {
  chrome.storage.sync.get(['percentage', 'enabled', 'difficulty', 'categories', 'audioEnabled', 'clickReveal', 'grammarHints', 'darkModeSync', 'favorites', 'stats', 'blacklist'], (data) => {
    document.getElementById('percentage').value = data.percentage || 20;
    document.getElementById('percentValue').textContent = data.percentage || 20;
    
    const enabled = data.enabled !== false;
    setToggle('toggle', enabled);
    
    document.getElementById('difficulty').value = data.difficulty || 0;
    
    if (data.categories && data.categories.length > 0) {
      document.querySelectorAll('.chip').forEach(chip => {
        chip.classList.toggle('active', data.categories.includes(chip.dataset.cat));
      });
    }
    
    setToggle('toggleAudio', data.audioEnabled !== false);
    setToggle('toggleClickReveal', data.clickReveal !== false);
    setToggle('toggleGrammar', data.grammarHints !== false);
    setToggle('toggleDarkMode', data.darkModeSync !== false);
    
    const stats = data.stats || { seen: 0, mastered: 0, streak: 0, quizzes: 0, lastDate: null };
    document.getElementById('statSeen').textContent = stats.seen;
    document.getElementById('statMastered').textContent = stats.mastered;
    document.getElementById('statStreak').textContent = stats.streak;
    document.getElementById('statQuizzes').textContent = stats.quizzes || 0;
    
    const favorites = data.favorites || [];
    renderFavorites(favorites);
  });
}

function setToggle(id, isOn) {
  const btn = document.getElementById(id);
  btn.classList.toggle('on', isOn);
  btn.classList.toggle('off', !isOn);
}

function setupEventListeners() {
  // Helper to reload active tab
  function reloadActiveTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.reload(tabs[0].id);
      }
    });
  }

  // Percentage slider - save on release (change event)
  const percentSlider = document.getElementById('percentage');
  percentSlider.addEventListener('input', (e) => {
    document.getElementById('percentValue').textContent = e.target.value;
  });
  percentSlider.addEventListener('change', (e) => {
    chrome.storage.sync.set({ percentage: parseInt(e.target.value) }, () => {
      showStatus('Density saved! Reloading...');
      setTimeout(reloadActiveTab, 300);
    });
  });

  // Main toggle
  document.getElementById('toggle').addEventListener('click', function() {
    const isOn = this.classList.toggle('on');
    this.classList.toggle('off', !isOn);
    chrome.storage.sync.set({ enabled: isOn }, () => {
      showStatus(isOn ? 'Enabled! Reloading...' : 'Disabled! Reloading...');
      setTimeout(reloadActiveTab, 300);
    });
  });

  // Difficulty
  document.getElementById('difficulty').addEventListener('change', (e) => {
    chrome.storage.sync.set({ difficulty: parseInt(e.target.value) }, () => {
      showStatus('Difficulty saved! Reloading...');
      setTimeout(reloadActiveTab, 300);
    });
  });

  // Categories
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      if (chip.dataset.cat === 'all') {
        document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      } else {
        document.querySelector('.chip[data-cat="all"]').classList.remove('active');
        chip.classList.toggle('active');
        if (!document.querySelector('.chip.active')) {
          document.querySelector('.chip[data-cat="all"]').classList.add('active');
        }
      }
      const active = Array.from(document.querySelectorAll('.chip.active')).map(c => c.dataset.cat);
      chrome.storage.sync.set({ categories: active }, () => {
        showStatus('Categories saved! Reloading...');
        setTimeout(reloadActiveTab, 300);
      });
    });
  });

  // Beginner mode
  document.getElementById('beginnerMode').addEventListener('click', () => {
    document.getElementById('percentage').value = 10;
    document.getElementById('percentValue').textContent = '10';
    document.getElementById('difficulty').value = 1;
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    document.querySelector('.chip[data-cat="all"]').classList.add('active');
    chrome.storage.sync.set({ percentage: 10, difficulty: 1, categories: ['all'] }, () => {
      showStatus('Beginner mode activated! Reloading...');
      setTimeout(reloadActiveTab, 300);
    });
  });

  // Feature toggles
  ['toggleAudio', 'toggleClickReveal', 'toggleGrammar', 'toggleDarkMode'].forEach(id => {
    document.getElementById(id).addEventListener('click', function() {
      const isOn = this.classList.toggle('on');
      this.classList.toggle('off', !isOn);
      const key = { toggleAudio: 'audioEnabled', toggleClickReveal: 'clickReveal', toggleGrammar: 'grammarHints', toggleDarkMode: 'darkModeSync' }[id];
      chrome.storage.sync.set({ [key]: isOn }, () => {
        setTimeout(reloadActiveTab, 300);
      });
    });
  });

  // Quiz
  document.getElementById('nextQuiz').addEventListener('click', loadQuiz);

  // Word of day audio
  document.getElementById('wotdAudio').addEventListener('click', () => {
    const word = document.getElementById('wotdEt').textContent;
    speakEstonian(word);
  });

  // Export/Import
  document.getElementById('exportData').addEventListener('click', exportData);
  document.getElementById('importData').addEventListener('click', () => document.getElementById('importFile').click());
  document.getElementById('importFile').addEventListener('change', importData);

  // Reset
  document.getElementById('resetStats').addEventListener('click', () => {
    if (confirm('Reset ALL progress? This cannot be undone.')) {
      chrome.storage.sync.set({ 
        stats: { seen: 0, mastered: 0, streak: 0, quizzes: 0, lastDate: null }, 
        favorites: [], 
        seenWords: {} 
      });
      location.reload();
    }
  });

  // Blacklist
  document.getElementById('addBlacklist').addEventListener('click', addToBlacklist);
  document.getElementById('blacklistInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addToBlacklist();
  });

  // Custom words
  document.getElementById('addCustomWord').addEventListener('click', addCustomWord);
  document.getElementById('customEt').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addCustomWord();
  });
}

function loadWordOfDay() {
  const today = new Date().getDate();
  const wotd = wordOfDayList[today % wordOfDayList.length];
  document.getElementById('wotdEt').textContent = wotd.et;
  document.getElementById('wotdEn').textContent = wotd.en;
  document.getElementById('wotdPhonetic').textContent = wotd.phonetic;
  document.getElementById('wotdExample').textContent = wotd.example;
}

function loadQuiz() {
  const word = quizWords[Math.floor(Math.random() * quizWords.length)];
  document.getElementById('quizWord').textContent = word.et;
  document.getElementById('quizHint').textContent = `Hint: ${word.hint}`;
  document.getElementById('quizResult').textContent = '';
  
  const wrongAnswers = quizWords.filter(w => w.en !== word.en)
    .sort(() => Math.random() - 0.5).slice(0, 3).map(w => w.en);
  const options = [...wrongAnswers, word.en].sort(() => Math.random() - 0.5);
  
  const container = document.getElementById('quizOptions');
  container.innerHTML = options.map(opt => `<div class="quiz-opt" data-answer="${opt}">${opt}</div>`).join('');
  
  container.querySelectorAll('.quiz-opt').forEach(btn => {
    btn.addEventListener('click', function() {
      quizTotal++;
      document.getElementById('quizTotal').textContent = quizTotal;
      container.querySelectorAll('.quiz-opt').forEach(b => b.style.pointerEvents = 'none');
      
      if (this.dataset.answer === word.en) {
        this.classList.add('correct');
        quizCorrect++;
        document.getElementById('quizCorrect').textContent = quizCorrect;
        document.getElementById('quizResult').textContent = '✓ Correct!';
        document.getElementById('quizResult').style.color = '#10b981';
      } else {
        this.classList.add('wrong');
        container.querySelector(`[data-answer="${word.en}"]`).classList.add('correct');
        document.getElementById('quizResult').textContent = '✗ Wrong';
        document.getElementById('quizResult').style.color = '#ef4444';
      }
      
      // Update quiz count
      chrome.storage.sync.get(['stats'], (data) => {
        const stats = data.stats || { seen: 0, mastered: 0, streak: 0, quizzes: 0, lastDate: null };
        stats.quizzes = (stats.quizzes || 0) + 1;
        chrome.storage.sync.set({ stats });
        document.getElementById('statQuizzes').textContent = stats.quizzes;
        loadAchievements();
      });
    });
  });
}

function loadAchievements() {
  chrome.storage.sync.get(['stats', 'favorites'], (data) => {
    const stats = data.stats || { seen: 0, mastered: 0, streak: 0, quizzes: 0 };
    const favorites = data.favorites || [];
    
    const container = document.getElementById('achievementsList');
    container.innerHTML = achievements.map(a => {
      const unlocked = a.check(stats, favorites);
      return `
        <div class="achievement ${unlocked ? '' : 'locked'}">
          <div class="achievement-icon">${a.icon}</div>
          <div class="achievement-info">
            <div class="achievement-title">${a.title}</div>
            <div class="achievement-desc">${a.desc}</div>
          </div>
          <div>${unlocked ? '✓' : '🔒'}</div>
        </div>
      `;
    }).join('');
  });
}

function loadBlacklist() {
  chrome.storage.sync.get(['blacklist'], (data) => {
    renderBlacklist(data.blacklist || []);
  });
}

function addToBlacklist() {
  const input = document.getElementById('blacklistInput');
  const site = input.value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
  if (!site) return;
  
  chrome.storage.sync.get(['blacklist'], (data) => {
    const blacklist = data.blacklist || [];
    if (!blacklist.includes(site)) {
      blacklist.push(site);
      chrome.storage.sync.set({ blacklist });
      renderBlacklist(blacklist);
    }
    input.value = '';
  });
}

function renderBlacklist(blacklist) {
  const container = document.getElementById('blacklistItems');
  if (!blacklist.length) {
    container.innerHTML = '<p style="font-size:10px;color:var(--text-secondary);text-align:center;">No sites blacklisted</p>';
    return;
  }
  container.innerHTML = blacklist.map((site, i) => `
    <div class="blacklist-item">
      <span>${site}</span>
      <button class="fav-remove" data-idx="${i}">✕</button>
    </div>
  `).join('');
  
  container.querySelectorAll('.fav-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      chrome.storage.sync.get(['blacklist'], (data) => {
        const bl = data.blacklist || [];
        bl.splice(parseInt(btn.dataset.idx), 1);
        chrome.storage.sync.set({ blacklist: bl });
        renderBlacklist(bl);
      });
    });
  });
}

function renderFavorites(favorites) {
  const container = document.getElementById('favList');
  if (!favorites.length) {
    container.innerHTML = '<p style="text-align:center;color:var(--text-secondary);font-size:11px;">No favorites yet</p>';
    return;
  }
  container.innerHTML = favorites.map((fav, i) => `
    <div class="fav-item">
      <span>${fav.et} - ${fav.en}</span>
      <button class="fav-remove" data-idx="${i}">✕</button>
    </div>
  `).join('');
  
  container.querySelectorAll('.fav-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      chrome.storage.sync.get(['favorites'], (data) => {
        const favs = data.favorites || [];
        favs.splice(parseInt(btn.dataset.idx), 1);
        chrome.storage.sync.set({ favorites: favs });
        renderFavorites(favs);
      });
    });
  });
}

function exportData() {
  chrome.storage.sync.get(null, (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eestify-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showStatus('Data exported!');
  });
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      chrome.storage.sync.set(data, () => {
        showStatus('Data imported! Refreshing...');
        setTimeout(() => location.reload(), 1000);
      });
    } catch (err) {
      showStatus('Invalid file format');
    }
  };
  reader.readAsText(file);
}

function speakEstonian(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'et-EE';
  utterance.rate = 0.8;
  speechSynthesis.speak(utterance);
}

function showStatus(msg) {
  const el = document.getElementById('status');
  if (!el) {
    const status = document.createElement('div');
    status.id = 'status';
    status.className = 'show';
    status.textContent = msg;
    document.querySelector('.container').appendChild(status);
    setTimeout(() => status.remove(), 2000);
  } else {
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2000);
  }
}

// Custom Words Functions
function loadCustomWords() {
  chrome.storage.sync.get(['customWords'], (data) => {
    renderCustomWords(data.customWords || []);
  });
}

function addCustomWord() {
  const enInput = document.getElementById('customEn');
  const etInput = document.getElementById('customEt');
  const en = enInput.value.trim().toLowerCase();
  const et = etInput.value.trim();
  
  if (!en || !et) {
    showStatus('Enter both English and Estonian words');
    return;
  }
  
  chrome.storage.sync.get(['customWords'], (data) => {
    const customWords = data.customWords || [];
    
    // Check if word already exists
    if (customWords.find(w => w.en.toLowerCase() === en)) {
      showStatus('Word already exists');
      return;
    }
    
    customWords.push({ en, et, diff: 1 });
    chrome.storage.sync.set({ customWords }, () => {
      renderCustomWords(customWords);
      enInput.value = '';
      etInput.value = '';
      showStatus(`Added: ${en} → ${et}`);
      
      // Reload active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) chrome.tabs.reload(tabs[0].id);
      });
    });
  });
}

function renderCustomWords(customWords) {
  const container = document.getElementById('customWordsList');
  if (!customWords.length) {
    container.innerHTML = '';
    return;
  }
  
  container.innerHTML = customWords.map((word, i) => `
    <div class="fav-item">
      <span>${word.en} → ${word.et}</span>
      <button class="fav-remove" data-idx="${i}">✕</button>
    </div>
  `).join('');
  
  container.querySelectorAll('.fav-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      chrome.storage.sync.get(['customWords'], (data) => {
        const words = data.customWords || [];
        words.splice(parseInt(btn.dataset.idx), 1);
        chrome.storage.sync.set({ customWords: words }, () => {
          renderCustomWords(words);
          showStatus('Word removed');
          // Reload active tab
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) chrome.tabs.reload(tabs[0].id);
          });
        });
      });
    });
  });
}