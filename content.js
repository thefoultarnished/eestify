// content.js - Eestify

const dictionary = dictionaryData.words;
let settings = { 
  percentage: 20, enabled: true, difficulty: 0, categories: ['all'], 
  clickReveal: true, audioEnabled: true, grammarHints: true, darkModeSync: true,
  blacklist: []
};

// Check if current site is blacklisted
function isBlacklisted() {
  const host = window.location.hostname.replace('www.', '');
  return settings.blacklist.some(site => host.includes(site) || site.includes(host));
}

// Category mappings
const categoryRanges = {
  greetings: ['hello','goodbye','thank you','please','excuse me','yes','no','maybe','hi','welcome'],
  family: ['father','mother','son','daughter','brother','sister','parents','spouse','relative','child','family','husband','wife'],
  food: ['food','drink','breakfast','lunch','dinner','bread','milk','cheese','meat','fish','chicken','egg','potato','rice','fruit','vegetable','apple','banana','orange','coffee','tea','juice','beer','wine','sugar','salt','water'],
  numbers: ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','twenty','thirty','hundred','thousand','million','number','first','second','third'],
  colors: ['color','red','blue','yellow','green','orange','purple','brown','gray','pink','black','white'],
  verbs: ['be','have','do','go','come','see','know','think','say','get','make','take','want','give','use','find','tell','ask','work','feel','try','leave','call','need','become','keep','let','begin','seem','help','show','hear','play','run','move','live','believe','hold','bring','happen','write','sit','stand','lose','pay','meet','include','continue','set','learn','change','lead','understand','watch','follow','stop','create','speak','read','allow','add','spend','grow','open','walk','win','offer','remember','love','consider','appear','buy','wait','serve','die','send','expect','build','stay','fall','cut','reach','kill','remain'],
  nature: ['nature','forest','tree','flower','grass','river','lake','sea','mountain','stone','sand','sky','sun','moon','star','cloud','rain','snow','wind','weather','animal','dog','cat','bird','fish'],
  time: ['time','day','year','week','month','hour','minute','today','yesterday','tomorrow','morning','night','always','never','sometimes','now','later','soon']
};

// Grammar info for common words
const grammarInfo = {
  // Nouns with cases: nominative (nom), genitive (gen), partitive (part)
  'dog': { type: 'noun', cases: { nom: 'koer', gen: 'koera', part: 'koera' } },
  'cat': { type: 'noun', cases: { nom: 'kass', gen: 'kassi', part: 'kassi' } },
  'house': { type: 'noun', cases: { nom: 'maja', gen: 'maja', part: 'maja' } },
  'book': { type: 'noun', cases: { nom: 'raamat', gen: 'raamatu', part: 'raamatut' } },
  'water': { type: 'noun', cases: { nom: 'vesi', gen: 'vee', part: 'vett' } },
  'mother': { type: 'noun', cases: { nom: 'ema', gen: 'ema', part: 'ema' } },
  'father': { type: 'noun', cases: { nom: 'isa', gen: 'isa', part: 'isa' } },
  'child': { type: 'noun', cases: { nom: 'laps', gen: 'lapse', part: 'last' } },
  'friend': { type: 'noun', cases: { nom: 'sõber', gen: 'sõbra', part: 'sõpra' } },
  'home': { type: 'noun', cases: { nom: 'kodu', gen: 'kodu', part: 'kodu' } },
  // Verbs with conjugations
  'go': { type: 'verb', conj: { ma: 'lähen', sa: 'lähed', ta: 'läheb', me: 'läheme', te: 'lähete', nad: 'lähevad' } },
  'come': { type: 'verb', conj: { ma: 'tulen', sa: 'tuled', ta: 'tuleb', me: 'tuleme', te: 'tulete', nad: 'tulevad' } },
  'see': { type: 'verb', conj: { ma: 'näen', sa: 'näed', ta: 'näeb', me: 'näeme', te: 'näete', nad: 'näevad' } },
  'know': { type: 'verb', conj: { ma: 'tean', sa: 'tead', ta: 'teab', me: 'teame', te: 'teate', nad: 'teavad' } },
  'want': { type: 'verb', conj: { ma: 'tahan', sa: 'tahad', ta: 'tahab', me: 'tahame', te: 'tahate', nad: 'tahavad' } },
  'love': { type: 'verb', conj: { ma: 'armastan', sa: 'armastad', ta: 'armastab', me: 'armastame', te: 'armastate', nad: 'armastavad' } },
  'eat': { type: 'verb', conj: { ma: 'söön', sa: 'sööd', ta: 'sööb', me: 'sööme', te: 'sööte', nad: 'söövad' } },
  'drink': { type: 'verb', conj: { ma: 'joon', sa: 'jood', ta: 'joob', me: 'joome', te: 'joote', nad: 'joovad' } },
  'sleep': { type: 'verb', conj: { ma: 'magan', sa: 'magad', ta: 'magab', me: 'magame', te: 'magate', nad: 'magavad' } },
  'speak': { type: 'verb', conj: { ma: 'räägin', sa: 'räägid', ta: 'räägib', me: 'räägime', te: 'räägite', nad: 'räägivad' } },
  'live': { type: 'verb', conj: { ma: 'elan', sa: 'elad', ta: 'elab', me: 'elame', te: 'elate', nad: 'elavad' } },
  'work': { type: 'verb', conj: { ma: 'töötan', sa: 'töötad', ta: 'töötab', me: 'töötame', te: 'töötate', nad: 'töötavad' } },
};

// Example sentences
const exampleSentences = {
  'hello': 'Tere, kuidas läheb? (Hello, how are you?)',
  'thank you': 'Aitäh abi eest! (Thank you for help!)',
  'yes': 'Jah, ma tulen. (Yes, I am coming.)',
  'no': 'Ei, aitäh. (No, thank you.)',
  'dog': 'Koer jookseb. (The dog runs.)',
  'cat': 'Kass magab. (The cat sleeps.)',
  'water': 'Palun vett. (Water, please.)',
  'book': 'See on hea raamat. (This is a good book.)',
  'love': 'Ma armastan sind. (I love you.)',
  'friend': 'Ta on minu sõber. (He is my friend.)',
  'home': 'Ma lähen koju. (I am going home.)',
  'sun': 'Päike paistab. (The sun is shining.)',
  'good': 'See on väga hea. (This is very good.)',
  'big': 'See on suur maja. (This is a big house.)',
  'small': 'Väike koer. (Small dog.)',
};

let translationMap, allWordsRegex;
let seenWords = new Map();

function getFilteredDictionary() {
  let filtered = dictionary;
  if (settings.difficulty > 0) {
    filtered = filtered.filter(w => w.diff <= settings.difficulty);
  }
  if (!settings.categories.includes('all')) {
    const allowedWords = new Set();
    settings.categories.forEach(cat => {
      if (categoryRanges[cat]) {
        categoryRanges[cat].forEach(w => allowedWords.add(w.toLowerCase()));
      }
    });
    filtered = filtered.filter(w => allowedWords.has(w.en.toLowerCase()));
  }
  return filtered;
}

function buildTranslationData(customWords = []) {
  const filtered = getFilteredDictionary();
  // Combine built-in dictionary with custom words
  const allWords = [...filtered, ...customWords];
  translationMap = new Map(allWords.map(word => [word.en.toLowerCase(), { et: word.et, diff: word.diff || 1 }]));
  if (translationMap.size > 0) {
    const escaped = Array.from(translationMap.keys()).map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    allWordsRegex = new RegExp('\\b(' + escaped.join('|') + ')\\b', 'gi');
  } else {
    allWordsRegex = null;
  }
}

function getGrammarHint(word) {
  if (!settings.grammarHints) return '';
  const info = grammarInfo[word.toLowerCase()];
  if (!info) return '';
  
  if (info.type === 'noun') {
    return ` [Noun: ${info.cases.nom}/${info.cases.gen}/${info.cases.part}]`;
  } else if (info.type === 'verb') {
    return ` [Verb: ma ${info.conj.ma}, sa ${info.conj.sa}]`;
  }
  return '';
}

function getExample(word) {
  return exampleSentences[word.toLowerCase()] || '';
}

function speakEstonian(text) {
  if (!settings.audioEnabled) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'et-EE';
  utterance.rate = 0.8;
  speechSynthesis.speak(utterance);
}

// Batch updates to avoid hitting write limits
let pendingUpdates = {};
let saveTimeout = null;

function savePendingUpdates() {
  if (Object.keys(pendingUpdates).length === 0) return;
  
  chrome.storage.sync.get(['seenWords', 'stats'], (data) => {
    const stored = data.seenWords || {};
    const stats = data.stats || { seen: 0, mastered: 0, streak: 0, quizzes: 0, lastDate: null };
    
    // Apply all pending updates
    Object.entries(pendingUpdates).forEach(([word, count]) => {
      const currentCount = stored[word] || 0;
      stored[word] = currentCount + count;
      stats.seen += count;
      if (stored[word] >= 5 && currentCount < 5) stats.mastered++;
    });
    
    // Update streak
    const today = new Date().toDateString();
    if (stats.lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      stats.streak = (stats.lastDate === yesterday) ? stats.streak + 1 : 1;
      stats.lastDate = today;
    }
    
    chrome.storage.sync.set({ seenWords: stored, stats });
    pendingUpdates = {};
  });
}

function updateSeenWord(word) {
  const current = seenWords.get(word) || 0;
  seenWords.set(word, current + 1);
  
  // Queue for batch save
  pendingUpdates[word] = (pendingUpdates[word] || 0) + 1;
  
  // Debounce save
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(savePendingUpdates, 5000);
}

function shouldReplaceWord(word) {
  const baseChance = settings.percentage / 100;
  const timesSeen = seenWords.get(word.toLowerCase()) || 0;
  const modifier = timesSeen < 3 ? 1.5 : timesSeen > 10 ? 0.5 : 1;
  return Math.random() < baseChance * modifier;
}

function isDarkMode() {
  if (!settings.darkModeSync) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches || 
         document.body.style.backgroundColor?.match(/^(#[0-3]|rgb\([0-9]{1,2},)/) ||
         document.documentElement.classList.contains('dark');
}

function replaceWords() {
  if (!allWordsRegex || isBlacklisted()) return;
  
  const darkMode = isDarkMode();
  
  const walker = document.createTreeWalker(
    document.body, NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        const parent = node.parentElement;
        if (!parent || !parent.isConnected) return NodeFilter.FILTER_REJECT;
        const tagName = parent.tagName.toLowerCase();
        if (['script','style','noscript','iframe','code','pre','textarea','input'].includes(tagName)) return NodeFilter.FILTER_REJECT;
        if (parent.closest('.estonian-word')) return NodeFilter.FILTER_REJECT;
        if (node.textContent.trim().length === 0) return NodeFilter.FILTER_REJECT;
        allWordsRegex.lastIndex = 0;
        if (!allWordsRegex.test(node.textContent)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(textNode => {
    if (!textNode.isConnected) return;
    const fragment = document.createDocumentFragment();
    let lastIndex = 0, match;
    allWordsRegex.lastIndex = 0;

    while ((match = allWordsRegex.exec(textNode.textContent)) !== null) {
      const originalWord = match[0];
      if (!shouldReplaceWord(originalWord)) continue;

      fragment.appendChild(document.createTextNode(textNode.textContent.slice(lastIndex, match.index)));

      const wordData = translationMap.get(originalWord.toLowerCase());
      const grammarHint = getGrammarHint(originalWord);
      const example = getExample(originalWord);

      const span = document.createElement('span');
      span.textContent = wordData.et;
      span.className = 'estonian-word';
      span.setAttribute('data-original', originalWord);
      span.setAttribute('data-estonian', wordData.et);
      span.setAttribute('data-grammar', grammarHint);
      span.setAttribute('data-example', example);
      span.setAttribute('data-showing', 'estonian');
      
      const colors = { 1: '#10b981', 2: '#3b82f6', 3: '#8b5cf6', 4: '#f59e0b', 5: '#ef4444' };
      const bgColor = colors[wordData.diff] || '#10b981';
      
      span.style.cssText = `
        background-color: ${bgColor}; color: #fff; padding: 1px 5px; border-radius: 4px;
        font-weight: 500; cursor: pointer; display: inline; margin: 0 1px;
        ${darkMode ? 'filter: brightness(0.9);' : ''}
      `;
      
      fragment.appendChild(span);
      lastIndex = allWordsRegex.lastIndex;
      updateSeenWord(originalWord.toLowerCase());
    }

    if (lastIndex > 0) {
      fragment.appendChild(document.createTextNode(textNode.textContent.slice(lastIndex)));
      textNode.parentNode.replaceChild(fragment, textNode);
    }
  });
}

// Styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .estonian-word { position: relative; transition: all 0.15s; }
  .estonian-word:hover { filter: brightness(1.15); }
  .estonian-word[data-showing="english"] { background-color: #6b7280 !important; }
  #eestify-tooltip {
    position: fixed; z-index: 2147483647; 
    background: #1f2937; color: #fff; padding: 10px 14px; border-radius: 8px;
    font-size: 13px; font-family: system-ui, sans-serif; max-width: 300px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.5); pointer-events: none;
    line-height: 1.5; opacity: 0; transition: opacity 0.15s;
  }
  #eestify-tooltip.visible { opacity: 1; }
  #eestify-tooltip .tt-word { font-weight: 600; font-size: 15px; margin-bottom: 4px; }
  #eestify-tooltip .tt-grammar { color: #5DADE2; font-size: 11px; }
  #eestify-tooltip .tt-example { color: #9CA3AF; font-size: 11px; margin-top: 6px; font-style: italic; }
`;
document.head.appendChild(styleSheet);

// Create tooltip element
const tooltip = document.createElement('div');
tooltip.id = 'eestify-tooltip';
document.body.appendChild(tooltip);

// Tooltip show/hide
document.body.addEventListener('mouseover', (e) => {
  const span = e.target.closest('.estonian-word');
  if (!span) return;
  
  const original = span.getAttribute('data-original');
  const grammar = span.getAttribute('data-grammar') || '';
  const example = span.getAttribute('data-example') || '';
  
  tooltip.innerHTML = `
    <div class="tt-word">${original}</div>
    ${grammar ? `<div class="tt-grammar">${grammar}</div>` : ''}
    ${example ? `<div class="tt-example">${example}</div>` : ''}
  `;
  
  const rect = span.getBoundingClientRect();
  let top = rect.top - tooltip.offsetHeight - 8;
  let left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2;
  
  // Keep on screen
  if (top < 5) top = rect.bottom + 8;
  if (left < 5) left = 5;
  if (left + tooltip.offsetWidth > window.innerWidth - 5) left = window.innerWidth - tooltip.offsetWidth - 5;
  
  tooltip.style.top = top + 'px';
  tooltip.style.left = left + 'px';
  tooltip.classList.add('visible');
});

document.body.addEventListener('mouseout', (e) => {
  const span = e.target.closest('.estonian-word');
  if (span) tooltip.classList.remove('visible');
});

// Click to toggle
document.body.addEventListener('click', (e) => {
  const span = e.target.closest('.estonian-word');
  if (!span || !settings.clickReveal) return;
  
  const showing = span.getAttribute('data-showing');
  if (showing === 'estonian') {
    span.textContent = span.getAttribute('data-original');
    span.setAttribute('data-showing', 'english');
  } else {
    span.textContent = span.getAttribute('data-estonian');
    span.setAttribute('data-showing', 'estonian');
  }
});

// Right-click for audio
document.body.addEventListener('contextmenu', (e) => {
  const span = e.target.closest('.estonian-word');
  if (span && settings.audioEnabled) {
    e.preventDefault();
    speakEstonian(span.getAttribute('data-estonian'));
  }
});

// Double-click to favorite OR translate new word with free API
document.body.addEventListener('dblclick', async (e) => {
  const span = e.target.closest('.estonian-word');
  if (span) {
    e.preventDefault();
    const et = span.getAttribute('data-estonian');
    const en = span.getAttribute('data-original');
    chrome.storage.sync.get(['favorites'], (data) => {
      const favorites = data.favorites || [];
      if (!favorites.find(f => f.et === et)) {
        favorites.push({ et, en });
        chrome.storage.sync.set({ favorites });
        span.style.boxShadow = '0 0 12px gold';
        setTimeout(() => span.style.boxShadow = '', 600);
      }
    });
    return;
  }

  // Translate selected text with free Lingva API
  if (!settings.enabled) return;
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  if (!selectedText || selectedText.includes(' ') || selectedText.length > 30) return;

  const range = selection.getRangeAt(0);
  if (range.startContainer.nodeType !== Node.TEXT_NODE) return;

  try {
    const tempSpan = document.createElement('span');
    tempSpan.textContent = selectedText;
    tempSpan.style.cssText = 'background:#10b981;color:#fff;padding:1px 5px;border-radius:4px;opacity:0.7;';
    range.deleteContents();
    range.insertNode(tempSpan);
    selection.removeAllRanges();
    
    // Use free Lingva Translate API
    const resp = await fetch(`https://lingva.ml/api/v1/en/et/${encodeURIComponent(selectedText)}`);
    const data = await resp.json();
    const translated = data.translation || selectedText;
    
    const finalSpan = document.createElement('span');
    finalSpan.textContent = translated;
    finalSpan.className = 'estonian-word';
    finalSpan.setAttribute('data-original', selectedText);
    finalSpan.setAttribute('data-estonian', translated);
    finalSpan.setAttribute('data-grammar', getGrammarHint(selectedText));
    finalSpan.setAttribute('data-example', '');
    finalSpan.setAttribute('data-showing', 'estonian');
    finalSpan.style.cssText = 'background:#10b981;color:#fff;padding:1px 5px;border-radius:4px;font-weight:500;cursor:pointer;';
    
    tempSpan.replaceWith(finalSpan);
  } catch (err) {
    console.error('Translation error:', err);
  }
});

// Keyboard shortcut: Alt+E to toggle
document.addEventListener('keydown', (e) => {
  if (e.altKey && e.key.toLowerCase() === 'e') {
    chrome.storage.sync.get(['enabled'], (data) => {
      const newState = !data.enabled;
      chrome.storage.sync.set({ enabled: newState });
      // Show visual feedback
      const msg = document.createElement('div');
      msg.textContent = `Eestify ${newState ? 'ON' : 'OFF'}`;
      msg.style.cssText = 'position:fixed;top:20px;right:20px;background:#1f2937;color:#fff;padding:12px 20px;border-radius:8px;z-index:999999;font-family:sans-serif;';
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 1500);
      if (newState) location.reload();
    });
  }
});

// Initialize
chrome.storage.sync.get(['percentage','enabled','difficulty','categories','clickReveal','audioEnabled','grammarHints','darkModeSync','seenWords','blacklist','customWords'], (data) => {
  settings = { ...settings, ...data };
  settings.percentage = data.percentage || 20;
  settings.enabled = data.enabled !== false;
  settings.difficulty = data.difficulty || 0;
  settings.categories = data.categories || ['all'];
  settings.blacklist = data.blacklist || [];
  
  if (data.seenWords) {
    Object.entries(data.seenWords).forEach(([word, count]) => seenWords.set(word, count));
  }
  
  // Build translation data with custom words included
  buildTranslationData(data.customWords || []);
  
  if (settings.enabled && !isBlacklisted()) {
    if (document.readyState === 'complete') {
      replaceWords();
    } else {
      window.addEventListener('load', replaceWords, { once: true });
    }
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && (changes.percentage || changes.enabled || changes.difficulty || changes.categories || changes.blacklist || changes.customWords)) {
    location.reload();
  }
});