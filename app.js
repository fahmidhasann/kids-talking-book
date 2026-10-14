/**
 * ============================================================================
 * KIDS ALL IN ONE - MAIN CONTROLLER (app.js)
 * Kids Talking Book: bilingual (English + Bangla) learning app
 * Features:
 *  - 3D Wooden Billboard Coverflow Category Selector
 *  - Single Big Item Showcase (Ultra-large 3D photos, clean white cards)
 *  - Automatic Melodic Bilingual Audio (English first, then Bengali meaning)
 *  - 4-Card Polaroid Photo Quiz Game with sound & visual feedback
 *  - Paint & Draw Studio with colors, brush sizes, and stamps
 *  - Speaking Challenge & Memory Match Games
 *  - Web Audio API Sound Effects Synthesizer (Zero network lag)
 *  - Touch Swipe Gestures & Confetti Star Reward Engine
 * ============================================================================
 */

(function () {
  'use strict';

  // Global State
  const state = {
    allCategories: window.VOCABULARY_DATA || [],
    currentCategory: 'fruits',
    currentJumboIndex: 0,
    currentJumboItem: null,
    coverflowIndex: 0,
    stars: parseInt(localStorage.getItem('kids_all_in_one_stars') || '0', 10),
    soundEnabled: true,
    currentMode: 'home',

    // Quiz State
    quiz: {
      currentQuestion: null,
      correctCount: 0,
      wrongCount: 0,
      qIndex: 1,
      totalQuestions: 10,
      answered: false
    },

    // Paint State
    paint: {
      currentColor: '#FF4757',
      currentSize: 10,
      isEraser: false,
      activeStamp: null,
      history: []
    },

    // Speaking Practice State
    speaking: {
      currentIndex: 0,
      targetItem: null,
      isListening: false
    },

    // Memory Match State
    match: {
      cards: [],
      flippedCards: [],
      matchedPairs: 0,
      moves: 0,
      lockBoard: false
    },

    // Voice Settings (Sweet, slow, child-like melodic tone)
    settings: {
      rate: 0.72,
      pitch: 1.38,
      voiceEn: null,
      voiceBn: null
    }
  };

  // Category Catalog for 3D Wooden Carousel
  const CATEGORY_CATALOG = [
    { id: 'fruits', title: 'Fruits', titleBn: 'ফলমূল', icon: '🍎', image: 'images/apple.png', count: 14 },
    { id: 'animals', title: 'Animals', titleBn: 'পশুপাখি', icon: '🦁', image: 'images/lion.png', count: 7 },
    { id: 'birds', title: 'Birds', titleBn: 'পাখি', icon: '🦜', image: 'images/swan.png', count: 5 },
    { id: 'flowers', title: 'Flowers', titleBn: 'সুন্দর ফুল', icon: '🌸', image: 'images/rose.png', count: 4 },
    { id: 'vehicles', title: 'Vehicles', titleBn: 'যানবাহন', icon: '🚗', image: 'images/car.png', count: 6 },
    { id: 'household', title: 'My Home', titleBn: 'আমার ঘর', icon: '🛋️', image: 'images/bed.png', count: 9 },
    { id: 'body_parts', title: 'Body Parts', titleBn: 'শরীরের অঙ্গ', icon: '🧍', image: 'images/face.png', count: 44 },
    { id: 'nature', title: 'Nature', titleBn: 'সুন্দর প্রকৃতি', icon: '🌊', image: 'images/mountain.png', count: 8 },
    { id: 'insects', title: 'Insects', titleBn: 'পোকামাকড়', icon: '🦋', image: 'images/butterfly.png', count: 5 },
    { id: 'quiz', title: 'Quiz Game', titleBn: 'মজার কুইজ', icon: '🎯', image: 'images/grapes.png', count: 'খেলা', isMode: 'quiz' },
    { id: 'paint', title: 'Paint & Draw', titleBn: 'ছবি আঁকা', icon: '🎨', image: 'images/peach.png', count: 'ড্রয়িং', isMode: 'paint' }
  ];

  // DOM Elements Cache
  const DOM = {
    starCount: document.getElementById('star-count'),
    btnSoundToggle: document.getElementById('btn-sound-toggle'),
    soundIcon: document.getElementById('sound-icon'),
    btnSettings: document.getElementById('btn-settings'),
    settingsModal: document.getElementById('settings-modal'),
    btnSettingsClose: document.getElementById('btn-settings-close'),

    // Mascot
    mascotCharacter: document.getElementById('mascot-character'),
    mascotMessage: document.getElementById('mascot-message'),

    // Navigation Tabs & Panels
    modeTabs: document.querySelectorAll('.mode-tab'),
    viewPanels: document.querySelectorAll('.view-panel'),

    // 1. Home / 3D Wooden Billboard
    categoryIndexBadge: document.getElementById('category-index-badge'),
    coverflowStage: document.getElementById('coverflow-stage'),
    btnCoverflowPrev: document.getElementById('btn-coverflow-prev'),
    btnCoverflowNext: document.getElementById('btn-coverflow-next'),
    btnOpenActiveCategory: document.getElementById('btn-open-active-category'),
    btnToggleAllCats: document.getElementById('btn-toggle-all-cats'),
    txtToggleCats: document.getElementById('txt-toggle-cats'),
    kidCategoryGrid: document.getElementById('kid-category-grid'),

    // 2. Big Item Showcase
    btnBackHome: document.getElementById('btn-back-home'),
    btnFullscreenToggle: document.getElementById('btn-fullscreen-toggle'),
    jumboCatBadge: document.getElementById('jumbo-cat-badge'),
    jumboCounter: document.getElementById('jumbo-counter'),
    btnJumboStarCheer: document.getElementById('btn-jumbo-star-cheer'),
    btnJumboPrev: document.getElementById('btn-jumbo-prev'),
    btnJumboNext: document.getElementById('btn-jumbo-next'),
    itemWhiteCard: document.getElementById('item-white-card'),
    itemImgContainer: document.getElementById('item-img-container'),
    jumboImg: document.getElementById('jumbo-img'),
    jumboWord: document.getElementById('jumbo-word'),
    btnJumboReplay: document.getElementById('btn-jumbo-replay'),
    jumboMeaning: document.getElementById('jumbo-meaning'),
    jumboPron: document.getElementById('jumbo-pron'),
    jumboSpellingPill: document.getElementById('jumbo-spelling-pill'),
    jumboSentence: document.getElementById('jumbo-sentence'),
    btnJumboSentence: document.getElementById('btn-jumbo-sentence'),
    btnJumboBilingual: document.getElementById('btn-jumbo-bilingual'),
    btnJumboSpell: document.getElementById('btn-jumbo-spell'),
    btnJumboMic: document.getElementById('btn-jumbo-mic'),
    jumboMicFeedback: document.getElementById('jumbo-mic-feedback'),

    // 3. Quiz (4-Card Polaroid)
    quizCounter: document.getElementById('quiz-counter'),
    quizScoreCorrect: document.getElementById('quiz-score-correct'),
    quizScoreWrong: document.getElementById('quiz-score-wrong'),
    btnQuizListen: document.getElementById('btn-quiz-listen'),
    quizQuestionText: document.getElementById('quiz-question-text'),
    quizHint: document.getElementById('quiz-hint'),
    quizOptions: document.getElementById('quiz-options'),
    quizFeedback: document.getElementById('quiz-feedback'),

    // 4. Paint Studio
    paintCanvas: document.getElementById('paint-canvas'),
    paintColorsBar: document.getElementById('paint-colors-bar'),
    paintStampsBar: document.getElementById('paint-stamps-bar'),
    btnPaintUndo: document.getElementById('btn-paint-undo'),
    btnPaintClear: document.getElementById('btn-paint-clear'),
    btnPaintSave: document.getElementById('btn-paint-save'),
    btnPaintEraser: document.getElementById('btn-paint-eraser'),

    // 5. Speaking Practice
    speakTargetImg: document.getElementById('speak-target-img'),
    speakTargetWord: document.getElementById('speak-target-word'),
    speakTargetPron: document.getElementById('speak-target-pron'),
    speakTargetMeaning: document.getElementById('speak-target-meaning'),
    btnSpeakListen: document.getElementById('btn-speak-listen'),
    btnMicListen: document.getElementById('btn-mic-listen'),
    btnSpeakNext: document.getElementById('btn-speak-next'),
    speechStatus: document.getElementById('speech-status'),
    speechResultBox: document.getElementById('speech-result-box'),

    // 6. Memory Match
    matchGrid: document.getElementById('match-grid'),
    matchMoves: document.getElementById('match-moves'),
    matchPairs: document.getElementById('match-pairs'),
    btnMatchRestart: document.getElementById('btn-match-restart'),

    // Settings
    settingRate: document.getElementById('setting-rate'),
    settingPitch: document.getElementById('setting-pitch'),
    settingVoiceEn: document.getElementById('setting-voice-en'),
    settingVoiceBn: document.getElementById('setting-voice-bn'),
    btnTestVoice: document.getElementById('btn-test-voice'),

    // Confetti
    confettiCanvas: document.getElementById('confetti-canvas'),

    // PWA
    pwaBanner: document.getElementById('pwa-install-banner'),
    btnPwaInstall: document.getElementById('btn-pwa-install'),
    btnPwaDismiss: document.getElementById('btn-pwa-dismiss')
  };

  /* ==========================================================================
     AUDIO SYNTHESIZER (WEB AUDIO API)
     Instant sound effects without network delays
     ========================================================================== */
  const SoundFX = {
    ctx: null,

    init() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      } catch (e) {
        console.warn('Web Audio API not supported', e);
      }
    },

    resume() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    },

    playPop() {
      if (!state.soundEnabled || !this.ctx) return;
      this.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    },

    playSparkle() {
      if (!state.soundEnabled || !this.ctx) return;
      this.resume();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.07);
        gain.gain.setValueAtTime(0.22, this.ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.07 + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.07);
        osc.stop(this.ctx.currentTime + idx * 0.07 + 0.22);
      });
    },

    playFanfare() {
      if (!state.soundEnabled || !this.ctx) return;
      this.resume();
      const chord = [523.25, 659.25, 783.99, 1046.50];
      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.25, this.ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.1 + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.1);
        osc.stop(this.ctx.currentTime + idx * 0.1 + 0.5);
      });
    },

    playBoing() {
      if (!state.soundEnabled || !this.ctx) return;
      this.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    },

    playCheer() {
      if (!state.soundEnabled) return;
      try {
        const cheerSounds = ['sound_super.mp3', 'sound_nice.mp3', 'sound_very_good.mp3', 'sound_win_puzzle.mp3'];
        const chosen = cheerSounds[Math.floor(Math.random() * cheerSounds.length)];
        const audio = new Audio(`sounds/${chosen}`);
        audio.volume = 0.85;
        audio.play().catch(() => this.playFanfare());
      } catch (e) {
        this.playFanfare();
      }
    },

    playCorrect() {
      if (!state.soundEnabled) return;
      try {
        const audio = new Audio('sounds/sound_correct_answer.mp3');
        audio.volume = 0.85;
        audio.play().catch(() => this.playSparkle());
      } catch (e) {
        this.playSparkle();
      }
    }
  };

  /* ==========================================================================
     TALKING SPEECH ENGINE (BILINGUAL CHILD VOICE)
     "And kotha bolar sathe sathe english er sathe jno bangla tao bole"
     ========================================================================== */
  const SpeechEngine = {
    synth: window.speechSynthesis,
    voices: [],
    currentAudio: null,
    speakSessionId: 0,

    init() {
      if (!this.synth) return;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    },

    loadVoices() {
      this.voices = this.synth.getVoices();
      this.populateVoiceSelects();
    },

    populateVoiceSelects() {
      if (!DOM.settingVoiceEn || !DOM.settingVoiceBn) return;
      DOM.settingVoiceEn.innerHTML = '';
      DOM.settingVoiceBn.innerHTML = '';

      this.voices.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v.name;
        opt.textContent = `${v.name} (${v.lang})`;
        if (v.lang.startsWith('en')) DOM.settingVoiceEn.appendChild(opt);
        if (v.lang.startsWith('bn')) DOM.settingVoiceBn.appendChild(opt);
      });
    },

    setSpeakingVisual(active) {
      if (DOM.jumboImg) DOM.jumboImg.classList.toggle('is-speaking-glow', active);
      const caption = document.getElementById('btn-jumbo-replay');
      if (caption) caption.classList.toggle('caption-speaking', active);
    },

    stopAll() {
      this.speakSessionId++;
      if (this.currentAudio) {
        try {
          this.currentAudio.pause();
          this.currentAudio.currentTime = 0;
        } catch (e) {}
        this.currentAudio = null;
      }
      if (this.synth) {
        try { this.synth.cancel(); } catch (e) {}
      }
      if (window.AndroidNativeTTS && typeof window.AndroidNativeTTS.stop === 'function') {
        try { window.AndroidNativeTTS.stop(); } catch (e) {}
      }
      this.setSpeakingVisual(false);
    },

    playAudioFile(src, sessionId) {
      return new Promise((resolve) => {
        if (!state.soundEnabled || sessionId !== this.speakSessionId) return resolve(false);

        const audio = new Audio(src);
        this.currentAudio = audio;
        audio.volume = 1.0;

        audio.onplay = () => {
          this.setSpeakingVisual(true);
        };

        audio.onended = () => {
          this.setSpeakingVisual(false);
          resolve(true);
        };

        audio.onerror = () => {
          this.setSpeakingVisual(false);
          resolve(false);
        };

        audio.play().catch(() => {
          this.setSpeakingVisual(false);
          resolve(false);
        });
      });
    },

    speak(text, options = {}) {
      if (!state.soundEnabled) return Promise.resolve();

      if (window.AndroidNativeTTS && typeof window.AndroidNativeTTS.speak === 'function') {
        try {
          const lang = options.lang || 'en-US';
          const rate = options.rate !== undefined ? options.rate : 0.56;
          const pitch = options.pitch !== undefined ? options.pitch : 1.52;
          this.setSpeakingVisual(true);
          window.AndroidNativeTTS.speak(text, lang, rate, pitch);
          setTimeout(() => this.setSpeakingVisual(false), 1200);
          return Promise.resolve();
        } catch (err) {}
      }

      if (!this.synth) return Promise.resolve();
      this.synth.cancel();

      return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = options.rate !== undefined ? options.rate : 0.55;
        utterance.pitch = options.pitch !== undefined ? options.pitch : 1.55;
        utterance.lang = options.lang || 'en-US';
        utterance.onstart = () => this.setSpeakingVisual(true);
        utterance.onend = () => { this.setSpeakingVisual(false); resolve(); };
        utterance.onerror = () => { this.setSpeakingVisual(false); resolve(); };
        this.synth.speak(utterance);
      });
    },

    // Studio-Quality Slow Baby-Girl Bilingual Pronunciation (Infobells Bangla + AnaNeural style)
    async speakBilingual(word, meaning, audioId = null) {
      if (!state.soundEnabled) return;
      this.stopAll();
      const mySession = this.speakSessionId;

      // Resolve audio file ID automatically if not passed
      let resolvedId = audioId;
      if (!resolvedId) {
        const allItems = state.allCategories.flatMap(c => c.items);
        const foundItem = allItems.find(i => i.word.toLowerCase() === String(word).toLowerCase());
        if (foundItem) {
          resolvedId = foundItem.id;
        } else {
          const foundCat = CATEGORY_CATALOG.find(c => c.title.toLowerCase() === String(word).toLowerCase());
          if (foundCat) resolvedId = `cat_${foundCat.id}`;
        }
      }

      if (resolvedId) {
        // 1. Play Studio Slow Baby-Girl English MP3
        const playedEn = await this.playAudioFile(`sounds/en/${resolvedId}.mp3`, mySession);
        if (mySession !== this.speakSessionId) return;

        if (playedEn) {
          // Soft musical sparkle chime between English and Bengali
          SoundFX.playSparkle();

          // Generous 700ms pause so child clearly absorbs the English word first
          await new Promise(r => setTimeout(r, 700));
          if (mySession !== this.speakSessionId) return;

          // 2. Play Studio Slow Baby-Girl Bengali MP3 (Infobells Bangla tone)
          await this.playAudioFile(`sounds/bn/${resolvedId}.mp3`, mySession);
          return;
        }
      }

      // Fallback if dynamic text
      await this.speak(word, { lang: 'en-US', rate: 0.55, pitch: 1.52 });
      if (mySession !== this.speakSessionId) return;
      SoundFX.playSparkle();
      await new Promise(r => setTimeout(r, 700));
      if (mySession !== this.speakSessionId) return;
      await this.speak(meaning, { lang: 'bn-BD', rate: 0.52, pitch: 1.58 });
    },

    async spellOut(word, meaning = null) {
      if (!state.soundEnabled) return;
      const hasNative = !!(window.AndroidNativeTTS && typeof window.AndroidNativeTTS.speak === 'function');
      if (!hasNative && !this.synth) return;
      const letters = word.toUpperCase().split('');
      for (const char of letters) {
        if (/[A-Z]/.test(char)) {
          await this.speak(char, { lang: 'en-US', rate: 0.75 });
          // Native TTS returns immediately, so wait for each letter to finish
          await new Promise(r => setTimeout(r, hasNative ? 750 : 110));
        }
      }
      await new Promise(r => setTimeout(r, 200));
      if (meaning) {
        await this.speakBilingual(word, meaning);
      } else {
        await this.speak(word, { lang: 'en-US', rate: 0.55 });
      }
    }
  };

  /* ==========================================================================
     SPEECH RECOGNITION (VOICE PRACTICE FOR KIDS)
     ========================================================================== */
  const SpeechRecognizer = {
    recognition: null,
    isSupported: false,

    init() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
        this.isSupported = true;
      }
    },

    startListening(targetWord, onResultCallback, onEndCallback) {
      if (!this.isSupported) {
        alert('আপনার ব্রাউজার বা ডিভাইসে মাইক্রোফোন সাপোর্ট নেই।');
        if (onEndCallback) onEndCallback();
        return;
      }

      this.recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript.trim().toLowerCase();
        const target = targetWord.toLowerCase().trim();
        const isMatch = spoken === target || spoken.includes(target) || target.includes(spoken);
        onResultCallback(spoken, isMatch);
      };

      this.recognition.onerror = () => {
        if (DOM.speechStatus) DOM.speechStatus.textContent = 'কিছু শোনা যায়নি, আবার চেষ্টা করো!';
      };

      this.recognition.onend = () => {
        state.speaking.isListening = false;
        if (DOM.btnMicListen) DOM.btnMicListen.classList.remove('is-recording');
        if (onEndCallback) onEndCallback();
      };

      try {
        this.recognition.start();
      } catch (err) {
        console.warn('Recognition already started', err);
      }
    }
  };

  /* ==========================================================================
     CONFETTI REWARD ENGINE
     ========================================================================== */
  const Confetti = {
    canvas: DOM.confettiCanvas,
    ctx: null,
    particles: [],
    animationId: null,

    init() {
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());
    },

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },

    fire(count = 60) {
      this.resize();
      const colors = ['#FF4757', '#FFA502', '#2ED573', '#1E90FF', '#9B59B6', '#FED330'];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: window.innerWidth / 2 + (Math.random() - 0.5) * 180,
          y: window.innerHeight / 2,
          r: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 14,
          vy: (Math.random() - 0.7) * 16,
          tilt: Math.random() * 10,
          tiltSpeed: Math.random() * 0.1 + 0.05,
          alpha: 1
        });
      }
      if (!this.animationId) this.animate();
    },

    animate() {
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.tilt += p.tiltSpeed;
        p.alpha -= 0.009;

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();

        if (p.alpha <= 0 || p.y > this.canvas.height) {
          this.particles.splice(idx, 1);
        }
      });

      if (this.particles.length > 0) {
        this.animationId = requestAnimationFrame(() => this.animate());
      } else {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    }
  };

  /* ==========================================================================
     HELPERS & UTILITIES
     ========================================================================== */
  function toBengaliDigits(num) {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, d => bnDigits[parseInt(d, 10)]);
  }

  function updateStars(increment = 1) {
    state.stars += increment;
    localStorage.setItem('kids_all_in_one_stars', state.stars);
    if (DOM.starCount) DOM.starCount.textContent = toBengaliDigits(state.stars);
  }

  function setMascotMessage(msg) {
    if (DOM.mascotMessage) DOM.mascotMessage.textContent = msg;
  }

  function getCurrentItems() {
    const cat = state.allCategories.find(c => c.id === state.currentCategory);
    return (cat && cat.items) ? cat.items : [];
  }

  /* ==========================================================================
     1. 3D WOODEN BILLBOARD COVERFLOW CONTROLLER (Exact Screenshot 2)
     ========================================================================== */
  function renderCoverflow(speakActive = false) {
    if (!DOM.coverflowStage) return;
    DOM.coverflowStage.innerHTML = '';

    const len = CATEGORY_CATALOG.length;
    if (DOM.categoryIndexBadge) {
      DOM.categoryIndexBadge.textContent = `${state.coverflowIndex + 1} / ${len}`;
    }

    CATEGORY_CATALOG.forEach((cat, idx) => {
      // Calculate relative circular distance
      let diff = idx - state.coverflowIndex;
      if (diff > len / 2) diff -= len;
      if (diff < -len / 2) diff += len;

      let positionClass = 'hidden';
      if (diff === 0) positionClass = 'center';
      else if (diff === -1) positionClass = 'left';
      else if (diff === 1) positionClass = 'right';

      const card = document.createElement('div');
      card.className = `coverflow-card ${positionClass}`;
      card.dataset.index = idx;
      card.dataset.catId = cat.id;

      card.innerHTML = `
        <div class="coverflow-img-wrap">
          <img src="${cat.image}" alt="${cat.title}" decoding="async">
        </div>
        <div class="coverflow-label-group">
          <h3 class="coverflow-title-en">${cat.title}</h3>
          <span class="coverflow-title-bn">${cat.titleBn}</span>
        </div>
      `;

      card.addEventListener('click', (e) => {
        e.stopPropagation();
        if (diff === 0) {
          // Center card tapped -> Open category
          openActiveCategory();
        } else if (diff === -1) {
          coverflowPrev();
        } else if (diff === 1) {
          coverflowNext();
        } else {
          state.coverflowIndex = idx;
          renderCoverflow(true);
          SoundFX.playPop();
        }
      });

      DOM.coverflowStage.appendChild(card);
    });

    if (speakActive) {
      const active = CATEGORY_CATALOG[state.coverflowIndex];
      if (active) {
        SpeechEngine.speakBilingual(active.title, active.titleBn);
      }
    }
  }

  function coverflowPrev() {
    SoundFX.playPop();
    const len = CATEGORY_CATALOG.length;
    state.coverflowIndex = (state.coverflowIndex - 1 + len) % len;
    renderCoverflow(true);
  }

  function coverflowNext() {
    SoundFX.playPop();
    const len = CATEGORY_CATALOG.length;
    state.coverflowIndex = (state.coverflowIndex + 1) % len;
    renderCoverflow(true);
  }

  function openActiveCategory() {
    const active = CATEGORY_CATALOG[state.coverflowIndex];
    if (!active) return;

    SoundFX.playSparkle();
    SoundFX.playPop();

    if (active.isMode) {
      switchMode(active.isMode);
    } else {
      selectCategory(active.id);
      switchMode('cards');
    }
  }

  // Mobile Touch Swipe on Wooden Billboard
  function setupCoverflowSwipe() {
    const stage = document.querySelector('.wooden-billboard');
    if (!stage) return;

    let startX = 0;
    let endX = 0;

    stage.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    stage.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = endX - startX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) coverflowPrev();
        else coverflowNext();
      }
    }, { passive: true });
  }

  // Render Full Category Grid (Toggleable Option)
  function renderKidCategoryGrid() {
    if (!DOM.kidCategoryGrid) return;
    DOM.kidCategoryGrid.innerHTML = '';

    CATEGORY_CATALOG.forEach(cat => {
      const card = document.createElement('div');
      card.className = 'kid-portal-card';
      card.dataset.catId = cat.id;

      card.innerHTML = `
        <img src="${cat.image}" alt="${cat.title}" loading="lazy" class="kid-portal-img">
        <h3 class="kid-portal-bangla">${cat.titleBn}</h3>
        <span class="kid-portal-english">${cat.title}</span>
      `;

      card.addEventListener('click', () => {
        SoundFX.playPop();
        if (cat.isMode) {
          switchMode(cat.isMode);
        } else {
          selectCategory(cat.id);
          switchMode('cards');
        }
      });

      DOM.kidCategoryGrid.appendChild(card);
    });
  }

  /* ==========================================================================
     2. SINGLE BIG ITEM SHOWCASE (Screenshot 0)
     ========================================================================== */
  function selectCategory(catId) {
    state.currentCategory = catId;
    state.currentJumboIndex = 0;
    const items = getCurrentItems();
    if (items.length > 0) {
      updateJumboStage(items[0], true);
    }
  }

  function updateJumboStage(item, autoSpeak = true) {
    if (!item) return;
    state.currentJumboItem = item;

    const items = getCurrentItems();
    const idx = items.findIndex(i => i.id === item.id);
    state.currentJumboIndex = idx >= 0 ? idx : 0;

    let catName = 'ফলমূল';
    let catIcon = '🍎';
    const cat = state.allCategories.find(c => c.id === state.currentCategory);
    if (cat) {
      catName = `${cat.titleBn} (${cat.title})`;
      catIcon = cat.icon || '🍎';
    }

    if (DOM.jumboCatBadge) {
      DOM.jumboCatBadge.textContent = `${catIcon} ${catName}`;
    }
    if (DOM.jumboCounter) {
      DOM.jumboCounter.textContent = `${toBengaliDigits(state.currentJumboIndex + 1)} / ${toBengaliDigits(items.length)}`;
    }
    if (DOM.jumboImg) {
      DOM.jumboImg.src = item.image;
      DOM.jumboImg.alt = `${item.word} 3D`;
      DOM.jumboImg.classList.remove('bounce-pop');
      void DOM.jumboImg.offsetWidth;
      DOM.jumboImg.classList.add('bounce-pop');
    }
    if (DOM.jumboWord) {
      DOM.jumboWord.textContent = item.word;
    }
    if (DOM.jumboSpellingPill) {
      DOM.jumboSpellingPill.textContent = item.word.toUpperCase().split('').join(' • ');
    }
    if (DOM.jumboPron) {
      DOM.jumboPron.textContent = `(উচ্চারণ: ${item.pron})`;
    }
    if (DOM.jumboMeaning) {
      DOM.jumboMeaning.textContent = item.meaning;
    }
    if (DOM.jumboSentence) {
      DOM.jumboSentence.textContent = item.sentence || `Look at this ${item.word}!`;
    }

    if (DOM.jumboMicFeedback) {
      DOM.jumboMicFeedback.style.display = 'none';
      DOM.jumboMicFeedback.textContent = '';
    }

    // AUTOMATIC BILINGUAL PRONUNCIATION (English first, then Bengali)
    if (autoSpeak) {
      SpeechEngine.speakBilingual(item.word, item.meaning);
      setMascotMessage(`${item.word} — অর্থ: ${item.meaning}! 🎈`);
    }
  }

  function handleJumboPrev() {
    const items = getCurrentItems();
    if (!items.length) return;
    SoundFX.playPop();
    state.currentJumboIndex = (state.currentJumboIndex - 1 + items.length) % items.length;
    updateJumboStage(items[state.currentJumboIndex], true);
  }

  function handleJumboNext() {
    const items = getCurrentItems();
    if (!items.length) return;
    SoundFX.playPop();
    state.currentJumboIndex = (state.currentJumboIndex + 1) % items.length;
    updateJumboStage(items[state.currentJumboIndex], true);
  }

  // Mobile Touch Swipe on Big White Card
  function setupJumboSwipe() {
    const card = DOM.itemWhiteCard;
    if (!card) return;

    let startX = 0;
    let endX = 0;

    card.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    card.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = endX - startX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) handleJumboPrev();
        else handleJumboNext();
      }
    }, { passive: true });
  }

  /* ==========================================================================
     3. QUIZ: 4-CARD PHOTO FINDER (Exact Screenshot 4 with Taped Corners)
     ========================================================================== */
  function startQuizQuestion() {
    const allItems = state.allCategories.flatMap(c => c.items);
    if (allItems.length < 4) return;

    // Pick 1 correct item and 3 distractors
    const shuffled = [...allItems].sort(() => 0.5 - Math.random());
    const correct = shuffled[0];
    const options = shuffled.slice(0, 4).sort(() => 0.5 - Math.random());

    state.quiz.currentQuestion = { correct, options };
    state.quiz.answered = false;

    if (DOM.quizCounter) {
      DOM.quizCounter.textContent = `${state.quiz.qIndex} / ${state.quiz.totalQuestions}`;
    }
    if (DOM.quizQuestionText) {
      DOM.quizQuestionText.textContent = `Find: "${correct.word}" (${correct.meaning})`;
    }
    if (DOM.quizFeedback) {
      DOM.quizFeedback.textContent = '';
    }

    // Render 4 Taped Wooden Photo Cards (Exact Screenshot 4)
    if (DOM.quizOptions) {
      DOM.quizOptions.innerHTML = '';
      options.forEach(opt => {
        const card = document.createElement('div');
        card.className = 'quiz-photo-card';
        card.innerHTML = `
          <span class="tape-corner tl"></span>
          <span class="tape-corner tr"></span>
          <span class="tape-corner bl"></span>
          <span class="tape-corner br"></span>
          <img src="${opt.image}" alt="${opt.word}" loading="lazy">
        `;

        card.addEventListener('click', () => handleQuizAnswer(opt, card));
        DOM.quizOptions.appendChild(card);
      });
    }

    // Voice announcement (English + Bengali)
    SpeechEngine.speakBilingual(correct.word, `${correct.meaning} কোনটি?`);
  }

  function handleQuizAnswer(selected, cardEl) {
    if (state.quiz.answered) return;
    state.quiz.answered = true;

    const correct = state.quiz.currentQuestion.correct;
    if (selected.id === correct.id) {
      // Correct!
      cardEl.classList.add('correct-pick');
      state.quiz.correctCount++;
      updateStars(2);
      Confetti.fire(55);
      SoundFX.playCorrect();
      SoundFX.playCheer();

      if (DOM.quizScoreCorrect) DOM.quizScoreCorrect.textContent = state.quiz.correctCount;
      if (DOM.quizFeedback) {
        DOM.quizFeedback.innerHTML = `<span style="color:#2B8A1E;">🎉 সঠিক! ${correct.word} — ${correct.meaning}!</span>`;
      }
      SpeechEngine.speakBilingual(correct.word, correct.meaning);

      setTimeout(() => {
        state.quiz.qIndex = (state.quiz.qIndex % state.quiz.totalQuestions) + 1;
        startQuizQuestion();
      }, 1700);
    } else {
      // Wrong
      cardEl.classList.add('wrong-pick');
      state.quiz.wrongCount++;
      SoundFX.playBoing();

      if (DOM.quizScoreWrong) DOM.quizScoreWrong.textContent = state.quiz.wrongCount;
      if (DOM.quizFeedback) {
        DOM.quizFeedback.innerHTML = `<span style="color:#EA2027;">সঠিক উত্তর: ${correct.word} (${correct.meaning})</span>`;
      }

      setTimeout(() => {
        startQuizQuestion();
      }, 1700);
    }
  }

  /* ==========================================================================
     4. PAINT & DRAW STUDIO
     ========================================================================== */
  function initPaintStudio() {
    const canvas = DOM.paintCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Fill white background initially
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    savePaintState();

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Palette Colors
    const colors = [
      '#FF4757', '#FFA502', '#FED330', '#2ED573', '#1DD1A1',
      '#00D2D3', '#54A0FF', '#5F27CD', '#FF9FF3', '#795548',
      '#2C3A47', '#FFFFFF'
    ];

    if (DOM.paintColorsBar) {
      DOM.paintColorsBar.innerHTML = '';
      colors.forEach((col, idx) => {
        const swatch = document.createElement('div');
        swatch.className = `paint-color-swatch ${idx === 0 ? 'active' : ''}`;
        swatch.style.backgroundColor = col;
        swatch.addEventListener('click', () => {
          state.paint.currentColor = col;
          state.paint.isEraser = false;
          state.paint.activeStamp = null;
          document.querySelectorAll('.paint-color-swatch').forEach(s => s.classList.remove('active'));
          swatch.classList.add('active');
          if (DOM.btnPaintEraser) DOM.btnPaintEraser.classList.remove('active');
          document.querySelectorAll('.stamp-chip').forEach(st => st.classList.remove('active'));
          SoundFX.playPop();
        });
        DOM.paintColorsBar.appendChild(swatch);
      });
    }

    // Brush Size buttons
    document.querySelectorAll('.brush-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.paint.currentSize = parseInt(btn.dataset.size, 10);
        document.querySelectorAll('.brush-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        SoundFX.playPop();
      });
    });

    // Eraser Button
    if (DOM.btnPaintEraser) {
      DOM.btnPaintEraser.addEventListener('click', () => {
        state.paint.isEraser = !state.paint.isEraser;
        DOM.btnPaintEraser.classList.toggle('active', state.paint.isEraser);
        state.paint.activeStamp = null;
        document.querySelectorAll('.stamp-chip').forEach(st => st.classList.remove('active'));
        SoundFX.playPop();
      });
    }

    // Stamp Buttons
    document.querySelectorAll('.stamp-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const stamp = btn.dataset.stamp;
        if (state.paint.activeStamp === stamp) {
          state.paint.activeStamp = null;
          btn.classList.remove('active');
        } else {
          state.paint.activeStamp = stamp;
          document.querySelectorAll('.stamp-chip').forEach(s => s.classList.remove('active'));
          btn.classList.add('active');
        }
        SoundFX.playPop();
      });
    });

    // Save canvas state for undo
    function savePaintState() {
      state.paint.history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
      if (state.paint.history.length > 15) state.paint.history.shift();
    }

    // Undo
    if (DOM.btnPaintUndo) {
      DOM.btnPaintUndo.addEventListener('click', () => {
        if (state.paint.history.length > 1) {
          state.paint.history.pop();
          const prev = state.paint.history[state.paint.history.length - 1];
          ctx.putImageData(prev, 0, 0);
          SoundFX.playPop();
        }
      });
    }

    // Clear
    if (DOM.btnPaintClear) {
      DOM.btnPaintClear.addEventListener('click', () => {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        savePaintState();
        SoundFX.playPop();
      });
    }

    // Save/Download drawing
    if (DOM.btnPaintSave) {
      DOM.btnPaintSave.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = `kids_drawing_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        SoundFX.playCheer();
        Confetti.fire(45);
        updateStars(3);
      });
    }

    function getCoords(e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    }

    function startDraw(e) {
      isDrawing = true;
      const coords = getCoords(e);
      lastX = coords.x;
      lastY = coords.y;

      // If stamp active, stamp emoji and finish
      if (state.paint.activeStamp) {
        ctx.font = '48px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(state.paint.activeStamp, coords.x, coords.y);
        savePaintState();
        SoundFX.playSparkle();
        isDrawing = false;
      }
    }

    function draw(e) {
      if (!isDrawing || state.paint.activeStamp) return;
      e.preventDefault();
      const coords = getCoords(e);

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(coords.x, coords.y);
      ctx.strokeStyle = state.paint.isEraser ? '#FFFFFF' : state.paint.currentColor;
      ctx.lineWidth = state.paint.isEraser ? state.paint.currentSize * 2.5 : state.paint.currentSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      lastX = coords.x;
      lastY = coords.y;
    }

    function stopDraw() {
      if (isDrawing) {
        isDrawing = false;
        savePaintState();
      }
    }

    // Pointer / Mouse / Touch events
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mouseleave', stopDraw);

    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDraw);
  }

  /* ==========================================================================
     5. SPEAKING PRACTICE & MEMORY MATCH CONTROLLERS
     ========================================================================== */
  function loadSpeakingTarget() {
    const items = getCurrentItems();
    if (!items.length) return;
    const item = items[state.speaking.currentIndex % items.length];
    state.speaking.targetItem = item;

    if (DOM.speakTargetImg) DOM.speakTargetImg.src = item.image;
    if (DOM.speakTargetWord) DOM.speakTargetWord.textContent = item.word;
    if (DOM.speakTargetPron) DOM.speakTargetPron.textContent = `উচ্চারণ: ${item.pron}`;
    if (DOM.speakTargetMeaning) DOM.speakTargetMeaning.textContent = `অর্থ: ${item.meaning}`;
    if (DOM.speechResultBox) DOM.speechResultBox.innerHTML = '';
    if (DOM.speechStatus) DOM.speechStatus.textContent = 'মাইক বাটনে চাপ দিয়ে ইংরেজিতে বলো!';

    SpeechEngine.speakBilingual(item.word, item.meaning);
  }

  function setupMemoryMatch() {
    const items = getCurrentItems();
    if (items.length < 6) return;

    const chosen = [...items].sort(() => 0.5 - Math.random()).slice(0, 6);
    const deck = [...chosen, ...chosen].sort(() => 0.5 - Math.random());

    state.match.cards = deck;
    state.match.flippedCards = [];
    state.match.matchedPairs = 0;
    state.match.moves = 0;
    state.match.lockBoard = false;

    if (DOM.matchMoves) DOM.matchMoves.textContent = '0';
    if (DOM.matchPairs) DOM.matchPairs.textContent = '0 / 6';
    if (!DOM.matchGrid) return;
    DOM.matchGrid.innerHTML = '';

    deck.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'match-card';
      card.dataset.index = idx;
      card.dataset.id = item.id;
      card.innerHTML = `<span style="font-size: 28px;">❓</span>`;

      card.addEventListener('click', () => {
        if (state.match.lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) return;

        SoundFX.playPop();
        card.classList.add('flipped');
        card.innerHTML = `<img src="${item.image}" alt="${item.word}">`;
        state.match.flippedCards.push({ card, item });

        if (state.match.flippedCards.length === 2) {
          state.match.moves++;
          if (DOM.matchMoves) DOM.matchMoves.textContent = state.match.moves;
          checkMatch();
        }
      });

      DOM.matchGrid.appendChild(card);
    });
  }

  function checkMatch() {
    state.match.lockBoard = true;
    const [c1, c2] = state.match.flippedCards;

    if (c1.item.id === c2.item.id) {
      c1.card.classList.add('matched');
      c2.card.classList.add('matched');
      state.match.matchedPairs++;
      if (DOM.matchPairs) DOM.matchPairs.textContent = `${state.match.matchedPairs} / 6`;

      SoundFX.playCorrect();
      updateStars(1);
      SpeechEngine.speakBilingual(c1.item.word, c1.item.meaning);

      state.match.flippedCards = [];
      state.match.lockBoard = false;

      if (state.match.matchedPairs === 6) {
        SoundFX.playCheer();
        Confetti.fire(65);
        updateStars(5);
        setMascotMessage('দারুণ! তুমি সব জোড়া মিলিয়ে ফেলেছ! 🏆 +৫ স্টার!');
      }
    } else {
      SoundFX.playBoing();
      setTimeout(() => {
        c1.card.classList.remove('flipped');
        c2.card.classList.remove('flipped');
        c1.card.innerHTML = `<span style="font-size: 28px;">❓</span>`;
        c2.card.innerHTML = `<span style="font-size: 28px;">❓</span>`;
        state.match.flippedCards = [];
        state.match.lockBoard = false;
      }, 900);
    }
  }

  /* ==========================================================================
     UNIFIED MODE SWITCHER
     ========================================================================== */
  function switchMode(mode) {
    state.currentMode = mode;

    DOM.modeTabs.forEach(t => {
      t.classList.toggle('active', t.dataset.mode === mode);
    });

    DOM.viewPanels.forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`view-${mode}`);
    if (target) target.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (mode === 'quiz') startQuizQuestion();
    if (mode === 'speak') loadSpeakingTarget();
    if (mode === 'match') setupMemoryMatch();
    if (mode === 'home') renderCoverflow();
  }

  /* ==========================================================================
     EVENT LISTENERS INITIALIZATION
     ========================================================================== */
  function initEventListeners() {
    // Sound Toggle
    if (DOM.btnSoundToggle) {
      DOM.btnSoundToggle.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        if (DOM.soundIcon) DOM.soundIcon.textContent = state.soundEnabled ? '🔊' : '🔇';
        if (!state.soundEnabled && window.speechSynthesis) window.speechSynthesis.cancel();
      });
    }

    // Settings Modal
    if (DOM.btnSettings) {
      DOM.btnSettings.addEventListener('click', () => {
        if (DOM.settingsModal) DOM.settingsModal.classList.add('active');
      });
    }
    if (DOM.btnSettingsClose) {
      DOM.btnSettingsClose.addEventListener('click', () => {
        if (DOM.settingsModal) DOM.settingsModal.classList.remove('active');
      });
    }

    // Mode Tabs Click
    DOM.modeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        SoundFX.playPop();
        switchMode(tab.dataset.mode);
      });
    });

    // Subview Back Buttons -> Back to Home
    document.querySelectorAll('.btn-subview-home, #btn-back-home').forEach(btn => {
      btn.addEventListener('click', () => {
        SoundFX.playPop();
        switchMode('home');
      });
    });

    // Fullscreen Toggle Button (Bigger screen & rotation helper)
    if (DOM.btnFullscreenToggle) {
      DOM.btnFullscreenToggle.addEventListener('click', () => {
        SoundFX.playPop();
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
          } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          }
        }
      });
    }

    // 3D Coverflow Arrows
    if (DOM.btnCoverflowPrev) DOM.btnCoverflowPrev.addEventListener('click', coverflowPrev);
    if (DOM.btnCoverflowNext) DOM.btnCoverflowNext.addEventListener('click', coverflowNext);
    if (DOM.btnOpenActiveCategory) DOM.btnOpenActiveCategory.addEventListener('click', openActiveCategory);

    // Toggle All Categories Grid
    if (DOM.btnToggleAllCats) {
      DOM.btnToggleAllCats.addEventListener('click', () => {
        SoundFX.playPop();
        const isHidden = DOM.kidCategoryGrid.style.display === 'none';
        DOM.kidCategoryGrid.style.display = isHidden ? 'grid' : 'none';
        if (DOM.txtToggleCats) {
          DOM.txtToggleCats.textContent = isHidden ? '🔼 গ্রিড বন্ধ করো' : '🗂️ সব বিষয় একসাথে দেখো';
        }
      });
    }

    // Big Item Showcase Arrows
    if (DOM.btnJumboPrev) DOM.btnJumboPrev.addEventListener('click', handleJumboPrev);
    if (DOM.btnJumboNext) DOM.btnJumboNext.addEventListener('click', handleJumboNext);

    // Tapping Image or Replay -> Bilingual Speak
    if (DOM.itemImgContainer) {
      DOM.itemImgContainer.addEventListener('click', () => {
        if (state.currentJumboItem) {
          SoundFX.playPop();
          if (DOM.jumboImg) {
            DOM.jumboImg.classList.remove('bounce-pop');
            void DOM.jumboImg.offsetWidth;
            DOM.jumboImg.classList.add('bounce-pop');
          }
          SpeechEngine.speakBilingual(state.currentJumboItem.word, state.currentJumboItem.meaning);
        }
      });
    }

    if (DOM.btnJumboReplay) {
      DOM.btnJumboReplay.addEventListener('click', () => {
        if (state.currentJumboItem) {
          SoundFX.playPop();
          SpeechEngine.speakBilingual(state.currentJumboItem.word, state.currentJumboItem.meaning);
        }
      });
    }

    if (DOM.btnJumboBilingual) {
      DOM.btnJumboBilingual.addEventListener('click', () => {
        if (state.currentJumboItem) {
          SoundFX.playPop();
          SpeechEngine.speakBilingual(state.currentJumboItem.word, state.currentJumboItem.meaning);
        }
      });
    }

    if (DOM.btnJumboSpell) {
      DOM.btnJumboSpell.addEventListener('click', () => {
        if (state.currentJumboItem) {
          SoundFX.playPop();
          SpeechEngine.spellOut(state.currentJumboItem.word, state.currentJumboItem.meaning);
        }
      });
    }

    if (DOM.btnJumboSentence) {
      DOM.btnJumboSentence.addEventListener('click', () => {
        if (state.currentJumboItem && state.currentJumboItem.sentence) {
          SoundFX.playPop();
          SpeechEngine.speak(state.currentJumboItem.sentence);
        }
      });
    }

    // Smiling Star Button -> Opens 4-Card Quiz Mode
    if (DOM.btnJumboStarCheer) {
      DOM.btnJumboStarCheer.addEventListener('click', () => {
        SoundFX.playSparkle();
        Confetti.fire(40);
        switchMode('quiz');
      });
    }

    // Keyboard Arrow Keys
    window.addEventListener('keydown', (e) => {
      if (state.currentMode === 'home') {
        if (e.key === 'ArrowLeft') coverflowPrev();
        if (e.key === 'ArrowRight') coverflowNext();
        if (e.key === 'Enter') openActiveCategory();
      } else if (state.currentMode === 'cards') {
        if (e.key === 'ArrowLeft') handleJumboPrev();
        if (e.key === 'ArrowRight') handleJumboNext();
        if (e.key === 'Escape') switchMode('home');
      }
    });

    // PWA Install Prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (DOM.pwaBanner) DOM.pwaBanner.style.display = 'flex';
    });

    if (DOM.btnPwaInstall) {
      DOM.btnPwaInstall.addEventListener('click', () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then(() => {
            deferredPrompt = null;
            if (DOM.pwaBanner) DOM.pwaBanner.style.display = 'none';
          });
        }
      });
    }
    if (DOM.btnPwaDismiss) {
      DOM.btnPwaDismiss.addEventListener('click', () => {
        if (DOM.pwaBanner) DOM.pwaBanner.style.display = 'none';
      });
    }
  }

  /* ==========================================================================
     APPLICATION INITIALIZATION
     ========================================================================== */
  function initApp() {
    SoundFX.init();
    SpeechEngine.init();
    SpeechRecognizer.init();
    Confetti.init();

    if (DOM.starCount) DOM.starCount.textContent = toBengaliDigits(state.stars);

    renderCoverflow();
    renderKidCategoryGrid();
    setupCoverflowSwipe();
    setupJumboSwipe();
    initPaintStudio();
    initEventListeners();

    // Default to 'fruits' in background so cards view is primed
    selectCategory('fruits');
  }

  // Launch on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
