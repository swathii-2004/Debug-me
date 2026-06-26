// Priority Word List (User's words + 11 fun physical tech actions - 36 words total)
const PRIORITY_WORDS = [
  "Printer", "Webcam", "Speaker", "Pendrive", "Wi-Fi",
  "Emoji", "Download", "Upload", "Browser", "Password",
  "Touchscreen", "Drone", "Chatbot", "QR Code", "Virus",
  "Spam", "Glitch", "Freeze", "Bluetooth", "Firewall",
  "Cloud", "Bug", "Reboot", "Loading", "Mute",
  "Hacking", "VR Headset", "Robot Dance", "Zoom Meeting", "Losing Wi-Fi",
  "Tangled Wires", "Swipe Left", "Photoshop", "Face Recognition", "ASMR Keyboard",
  "Cookie Clicker"
];



// Backup Technical Word Pool (15 words)
const BACKUP_TECH_WORDS = [
  "Algorithm", "Database", "Encryption", "Bandwidth", "Firmware",
  "Cryptography", "Mainframe", "Cybersecurity", "Microprocessor", "Compiler",
  "Repository", "Asynchronous", "Telemetry", "Kubernetes", "Virtualization"
];

// Simplified Team Names
const DEFAULT_TEAM_NAMES = [
  "Team 1", "Team 2", "Team 3", "Team 4", "Team 5",
  "Team 6", "Team 7", "Team 8", "Team 9", "Team 10"
];

// Dynamic Color Mapping parameters
const TEAM_HEX_COLORS = [
  '#39ff14', '#00f0ff', '#ff0055', '#ffb700', '#b026ff',
  '#00a8ff', '#ff5f00', '#ff00ff', '#00ffcc', '#dfff11'
];
const GLOW_CLASSES = [
  'glowing-green', 'glowing-cyan', 'glowing-pink', 'glowing-yellow', 'glowing-purple',
  'glowing-ice', 'glowing-orange', 'glowing-magenta', 'glowing-turquoise', 'glowing-lime'
];
const SHADOW_STYLES = [
  '0 0 10px rgba(57, 255, 20, 0.35)',
  '0 0 10px rgba(0, 240, 255, 0.35)',
  '0 0 10px rgba(255, 0, 85, 0.35)',
  '0 0 10px rgba(255, 183, 0, 0.35)',
  '0 0 10px rgba(176, 38, 255, 0.35)',
  '0 0 10px rgba(0, 168, 255, 0.35)',
  '0 0 10px rgba(255, 95, 0, 0.35)',
  '0 0 10px rgba(255, 0, 255, 0.35)',
  '0 0 10px rgba(0, 255, 204, 0.35)',
  '0 0 10px rgba(223, 255, 17, 0.35)'
];

// Audio Engine for Dynamic Synthesized Sound Effects
class AudioEngine {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playSuccess() {
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    // Tech success arpeggio: C5 -> E5 -> G5 -> C6
    const notes = [523.25, 659.25, 783.99, 1046.50];
    const duration = 0.08;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration * notes.length);

    notes.forEach((freq, index) => {
      osc.frequency.setValueAtTime(freq, now + index * duration);
    });

    osc.start(now);
    osc.stop(now + duration * notes.length + 0.1);
  }

  playBuzzer() {
    this.init();
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';

    osc1.frequency.setValueAtTime(95, now);
    osc2.frequency.setValueAtTime(97, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.75);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gain.gain.setValueAtTime(0.3, now + 0.55);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.8);
    osc2.stop(now + 0.8);
  }
}

// Confetti Particle System using HTML5 Canvas
class ConfettiEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.active = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  spawn(count, x, y, options = {}) {
    const defaultColors = ['#00f0ff', '#39ff14', '#ff0055', '#ffea00', '#ffffff'];
    const colors = options.themeColor ? [options.themeColor, '#ffffff', '#ffea00'] : defaultColors;
    const originX = x !== undefined ? x : this.canvas.width / 2;
    const originY = y !== undefined ? y : this.canvas.height + 20;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: originX,
        y: originY,
        vx: (Math.random() - 0.5) * (options.spreadX || 16),
        vy: -Math.random() * (options.speedY || 22) - 6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.25,
        color: colors[Math.floor(Math.random() * colors.length)],
        width: Math.random() * 8 + 6,
        height: Math.random() * 12 + 8,
        opacity: 1,
        gravity: 0.32,
        friction: 0.985
      });
    }

    if (!this.active) {
      this.active = true;
      this.loop();
    }
  }

  loop() {
    if (this.particles.length === 0) {
      this.active = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.vx *= p.friction;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
      this.ctx.restore();

      if (p.y > this.canvas.height + 20 || p.x < -20 || p.x > this.canvas.width + 20) {
        this.particles.splice(i, 1);
      }
    }

    requestAnimationFrame(() => this.loop());
  }
}

// Game Controller
class Game {
  constructor() {
    // Setup View State
    this.teamsCount = 3;
    this.teams = [];
    this.activeTeamIndex = 0;
    this.isTieBreakerMode = false;
    this.originalTeams = [];

    // Timer & Game loop state
    this.timerSeconds = 60;
    this.timerInterval = null;
    this.isWordRevealed = false;
    this.isTimerRunning = false;
    this.activeWordString = "";

    // Engines
    this.sounds = new AudioEngine();
    this.confetti = new ConfettiEngine(document.getElementById('confetti-canvas'));

    // Cache DOM elements
    this.dom = {
      // Home Screen
      homeSection: document.getElementById('home-section'),
      btnGoToSetup: document.getElementById('btn-go-to-setup'),
      btnViewRules: document.getElementById('btn-view-rules'),

      // Rules Screen
      rulesSection: document.getElementById('rules-section'),
      btnRulesBack: document.getElementById('btn-rules-back'),

      // Setup Screen
      setupSection: document.getElementById('setup-section'),
      teamsSegmented: document.getElementById('teams-segmented'),
      teamInputsList: document.getElementById('team-inputs-list'),
      btnStartGame: document.getElementById('btn-start-game'),

      // Scoreboard / Header
      wordCounterWrapper: document.getElementById('word-counter-wrapper'),
      remainingCount: document.getElementById('remaining-count'),
      scoreboardSection: document.getElementById('scoreboard-section'),
      scoreboardGrid: document.getElementById('scoreboard-grid'),

      // Gameplay
      gamePlaySection: document.getElementById('game-play-section'),
      turnBanner: document.getElementById('turn-banner'),
      currentPlayingTeam: document.getElementById('current-playing-team'),
      timerText: document.getElementById('timer-text'),
      timerProgress: document.getElementById('timer-progress'),
      timerContainer: document.getElementById('timer-container'),
      
      // Card Panel (3D)
      wordCard: document.getElementById('word-card'),
      cardInner: document.getElementById('card-inner'),
      backStateEmpty: document.getElementById('back-state-empty'),
      backStateDrawn: document.getElementById('back-state-drawn'),
      activeWord: document.getElementById('active-word'),
      btnToggleReveal: document.getElementById('btn-toggle-reveal'),
      toggleRevealText: document.getElementById('toggle-reveal-text'),

      // Buttons
      btnGetWord: document.getElementById('btn-get-word'),
      playControlsGroup: document.getElementById('play-controls-group'),
      btnStart: document.getElementById('btn-start'),
      scoringControls: document.getElementById('scoring-controls'),
      btnSkip: document.getElementById('btn-skip'),
      btnCorrect: document.getElementById('btn-correct'),

      // Winner Section
      winnerSection: document.getElementById('winner-section'),
      winnerAnnouncement: document.getElementById('winner-announcement'),
      leaderboardTable: document.getElementById('leaderboard-table'),
      btnRestart: document.getElementById('btn-restart-game'),
      btnTiebreaker: document.getElementById('btn-tiebreaker'),

      // Footer
      appFooter: document.getElementById('app-footer'),
      btnReset: document.getElementById('btn-reset')
    };

    this.initEventListeners();
    this.renderSetupInputs();
  }

  initEventListeners() {
    // Navigation: Home -> Setup Screen
    this.dom.btnGoToSetup.addEventListener('click', () => {
      this.transitionScreen(this.dom.homeSection, this.dom.setupSection);
    });

    // Navigation: Home -> Rules Screen
    this.dom.btnViewRules.addEventListener('click', () => {
      this.transitionScreen(this.dom.homeSection, this.dom.rulesSection);
    });

    // Navigation: Rules Screen -> Home
    this.dom.btnRulesBack.addEventListener('click', () => {
      this.transitionScreen(this.dom.rulesSection, this.dom.homeSection);
    });

    // Segmented pills team count listener
    const segmentButtons = this.dom.teamsSegmented.querySelectorAll('.segment-btn');
    segmentButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        segmentButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.teamsCount = parseInt(btn.getAttribute('data-val'));
        this.renderSetupInputs();
      });
    });

    this.dom.btnStartGame.addEventListener('click', () => this.startGameBattle());

    this.dom.wordCard.addEventListener('click', () => {
      if (this.activeWordString && !this.isWordRevealed) {
        this.revealWord(true);
      }
    });
    this.dom.btnToggleReveal.addEventListener('click', () => this.toggleReveal());

    this.dom.btnGetWord.addEventListener('click', () => this.drawWordForActiveTeam());
    this.dom.btnStart.addEventListener('click', () => this.startTimer());
    this.dom.btnSkip.addEventListener('click', () => this.handleSkip());
    this.dom.btnCorrect.addEventListener('click', () => this.handleCorrect());

    this.dom.btnReset.addEventListener('click', () => this.showHomeScreen());
    this.dom.btnRestart.addEventListener('click', () => this.showHomeScreen());
    this.dom.btnTiebreaker.addEventListener('click', () => this.startTieBreakerRound());

    const initAudio = () => {
      this.sounds.init();
      document.body.removeEventListener('click', initAudio);
      document.body.removeEventListener('touchstart', initAudio);
    };
    document.body.addEventListener('click', initAudio);
    document.body.addEventListener('touchstart', initAudio);
  }

  // Shuffle Utility
  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // --- Smooth Screen Swapping Helper ---
  transitionScreen(hideEl, showEl, showSiblings = []) {
    hideEl.classList.add('fade-out-scale');
    
    setTimeout(() => {
      hideEl.classList.add('hidden');
      hideEl.classList.remove('fade-out-scale');

      showEl.classList.remove('hidden');
      showEl.classList.add('fade-in-scale');
      
      showSiblings.forEach(el => {
        el.classList.remove('hidden');
        el.classList.add('fade-in-scale');
      });

      // Clear animation classes after transition finished
      setTimeout(() => {
        showEl.classList.remove('fade-in-scale');
        showSiblings.forEach(el => el.classList.remove('fade-in-scale'));
      }, 300);
    }, 200);
  }

  // --- Setup Controllers ---
  adjustTeamsCount(change) {
    const newCount = this.teamsCount + change;
    if (newCount >= 2 && newCount <= 10) {
      this.teamsCount = newCount;
      this.dom.teamsCountVal.textContent = this.teamsCount;
      this.renderSetupInputs();
    }
  }

  renderSetupInputs() {
    const currentValues = Array.from(this.dom.teamInputsList.querySelectorAll('.team-name-input'))
      .map(input => input.value.trim());

    this.dom.teamInputsList.innerHTML = '';
    for (let i = 0; i < this.teamsCount; i++) {
      const wrapper = document.createElement('div');
      wrapper.className = 'team-input-wrapper';
      wrapper.setAttribute('data-team', i + 1);

      const dot = document.createElement('span');
      dot.className = 'team-color-dot';
      dot.style.backgroundColor = TEAM_HEX_COLORS[i];
      dot.style.boxShadow = SHADOW_STYLES[i];

      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'team-name-input';
      input.placeholder = DEFAULT_TEAM_NAMES[i];
      input.value = currentValues[i] || '';
      input.maxLength = 18;

      wrapper.appendChild(dot);
      wrapper.appendChild(input);
      this.dom.teamInputsList.appendChild(wrapper);
    }
  }

  showHomeScreen() {
    this.stopTimer();
    this.activeWordString = "";
    this.isTieBreakerMode = false;
    this.originalTeams = [];

    // Reset segmented control states to default (3 teams)
    const segmentButtons = this.dom.teamsSegmented.querySelectorAll('.segment-btn');
    segmentButtons.forEach(btn => {
      if (btn.getAttribute('data-val') === "3") {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    this.teamsCount = 3;
    this.renderSetupInputs();

    let activeScreen = null;
    if (!this.dom.gamePlaySection.classList.contains('hidden')) {
      activeScreen = this.dom.gamePlaySection;
    } else if (!this.dom.winnerSection.classList.contains('hidden')) {
      activeScreen = this.dom.winnerSection;
    } else if (!this.dom.setupSection.classList.contains('hidden')) {
      activeScreen = this.dom.setupSection;
    } else if (!this.dom.rulesSection.classList.contains('hidden')) {
      activeScreen = this.dom.rulesSection;
    }

    if (activeScreen) {
      this.dom.scoreboardSection.classList.add('fade-out-scale');
      this.dom.appFooter.classList.add('fade-out-scale');
      this.dom.wordCounterWrapper.classList.add('fade-out-scale');
      
      this.transitionScreen(activeScreen, this.dom.homeSection);
      
      setTimeout(() => {
        this.dom.scoreboardSection.classList.add('hidden');
        this.dom.scoreboardSection.classList.remove('fade-out-scale');
        this.dom.appFooter.classList.add('hidden');
        this.dom.appFooter.classList.remove('fade-out-scale');
        this.dom.wordCounterWrapper.classList.add('hidden');
        this.dom.wordCounterWrapper.classList.remove('fade-out-scale');
      }, 200);
    } else {
      this.dom.homeSection.classList.remove('hidden');
    }
  }

  // --- Initialize Active Battle ---
  startGameBattle() {
    const inputs = this.dom.teamInputsList.querySelectorAll('.team-name-input');
    this.teams = Array.from(inputs, (input, i) => {
      const typedName = input.value.trim();
      return {
        id: i + 1,
        name: typedName !== "" ? typedName : (DEFAULT_TEAM_NAMES[i] || `Team ${i + 1}`),
        score: 0,
        words: [],
        hexColor: TEAM_HEX_COLORS[i],
        glowClass: GLOW_CLASSES[i],
        shadowStyle: SHADOW_STYLES[i]
      };
    });

    // Smart Dealing Strategy: Pull user priority words first, use backup tech words if remaining space needed
    const numTeams = this.teams.length;
    const wordsNeeded = numTeams * 5;

    let activePool = [];
    const shuffledPriority = this.shuffle(PRIORITY_WORDS);
    const shuffledBackup = this.shuffle(BACKUP_TECH_WORDS);

    if (wordsNeeded <= shuffledPriority.length) {
      activePool = shuffledPriority.slice(0, wordsNeeded);
    } else {
      activePool = [...shuffledPriority];
      const extraCount = wordsNeeded - shuffledPriority.length;
      for (let k = 0; k < extraCount; k++) {
        activePool.push(shuffledBackup[k]);
      }
      activePool = this.shuffle(activePool); // Shuffle combined deck
    }

    this.teams.forEach(team => {
      team.words = [];
      for (let k = 0; k < 5; k++) {
        team.words.push(activePool.pop());
      }
    });

    this.activeTeamIndex = 0;
    this.isWordRevealed = false;
    this.isTimerRunning = false;
    this.activeWordString = "";

    // Smooth screen swap transition
    this.transitionScreen(this.dom.setupSection, this.dom.gamePlaySection, [
      this.dom.scoreboardSection,
      this.dom.appFooter,
      this.dom.wordCounterWrapper
    ]);

    this.renderDynamicScoreboard();
    this.updateActiveTeamTurn();
    this.prepareRoundView();
  }

  renderDynamicScoreboard() {
    this.dom.scoreboardGrid.innerHTML = '';
    this.teams.forEach((team, index) => {
      const card = document.createElement('div');
      card.className = 'score-card';
      card.setAttribute('data-team', team.id);
      card.id = `score-card-${team.id}`;

      if (index === this.activeTeamIndex) {
        card.classList.add('active-turn');
      }

      const dot = document.createElement('span');
      dot.className = 'team-dot';
      dot.style.backgroundColor = team.hexColor;
      dot.style.boxShadow = team.shadowStyle;

      const name = document.createElement('span');
      name.className = 'team-card-name';
      name.textContent = team.name;

      const score = document.createElement('span');
      score.className = 'team-card-score';
      score.textContent = team.score;
      score.style.color = team.hexColor;

      card.appendChild(dot);
      card.appendChild(name);
      card.appendChild(score);

      // Manual override turn swap
      card.addEventListener('click', () => {
        if (!this.isTimerRunning) {
          this.activeTeamIndex = index;
          this.updateActiveTeamTurn();
          this.prepareRoundView();
        }
      });

      this.dom.scoreboardGrid.appendChild(card);
    });
  }

  getActiveTeam() {
    return this.teams[this.activeTeamIndex];
  }

  updateActiveTeamTurn() {
    const activeTeam = this.getActiveTeam();

    const cards = this.dom.scoreboardGrid.querySelectorAll('.score-card');
    cards.forEach((card, idx) => {
      if (idx === this.activeTeamIndex) {
        card.classList.add('active-turn');
      } else {
        card.classList.remove('active-turn');
      }
    });

    this.dom.currentPlayingTeam.textContent = activeTeam.name;
    this.dom.currentPlayingTeam.style.color = activeTeam.hexColor;
    this.dom.currentPlayingTeam.style.textShadow = activeTeam.shadowStyle;
    this.dom.turnBanner.style.borderColor = activeTeam.hexColor;

    const totalRemaining = this.teams.reduce((acc, t) => acc + t.words.length, 0);
    this.dom.remainingCount.textContent = totalRemaining;

    this.dom.wordCard.className = `word-card`;
    this.resetTimerUI();
  }

  prepareRoundView() {
    this.activeWordString = "";
    this.showCardState('empty');
    
    this.dom.btnToggleReveal.disabled = true;
    this.dom.toggleRevealText.textContent = "Show Word";
    this.dom.btnToggleReveal.querySelector('.icon').textContent = "👁️";

    this.dom.btnGetWord.classList.remove('hidden');
    this.dom.playControlsGroup.classList.add('hidden');
    
    this.dom.btnGetWord.style.background = `linear-gradient(135deg, ${this.getActiveTeam().hexColor} 0%, #ffffff 240%)`;
    this.dom.btnGetWord.style.boxShadow = this.getActiveTeam().shadowStyle;

    this.resetTimerUI();
  }

  // --- 3D Word Card Display State Manager ---
  showCardState(state) {
    const activeTeam = this.getActiveTeam();

    if (state === 'empty') {
      this.dom.wordCard.classList.remove('is-flipped');
      this.dom.backStateEmpty.classList.remove('hidden');
      this.dom.backStateDrawn.classList.add('hidden');
      this.dom.wordCard.className = 'word-card';
    } else if (state === 'hidden') {
      this.dom.wordCard.classList.remove('is-flipped');
      this.dom.backStateEmpty.classList.add('hidden');
      this.dom.backStateDrawn.classList.remove('hidden');
      this.dom.wordCard.className = 'word-card glowing-cyan';
    } else if (state === 'revealed') {
      this.dom.wordCard.className = `word-card ${activeTeam.glowClass}`;
      this.dom.wordCard.classList.add('is-flipped'); // rotate to show front face
    }
  }

  // --- Word Draw Engine ---
  drawWordForActiveTeam() {
    const activeTeam = this.getActiveTeam();
    
    if (activeTeam.words.length === 0) {
      this.advanceTurn();
      return;
    }

    this.activeWordString = activeTeam.words.pop();
    this.dom.activeWord.textContent = this.activeWordString;
    this.isWordRevealed = false;

    this.showCardState('hidden');
    this.dom.remainingCount.textContent = this.teams.reduce((acc, t) => acc + t.words.length, 0);

    this.dom.btnToggleReveal.disabled = false;
    this.dom.toggleRevealText.textContent = "Show Word";
    this.dom.btnToggleReveal.querySelector('.icon').textContent = "👁️";

    this.dom.btnGetWord.classList.add('hidden');
    this.dom.playControlsGroup.classList.remove('hidden');
    this.dom.btnStart.classList.remove('hidden');
    this.dom.scoringControls.classList.add('hidden');

    this.dom.btnStart.style.background = `linear-gradient(135deg, ${activeTeam.hexColor} 0%, #ffffff 200%)`;
    this.dom.btnStart.style.boxShadow = activeTeam.shadowStyle;

    this.resetTimerUI();
  }

  revealWord(shouldReveal) {
    this.isWordRevealed = shouldReveal;
    if (shouldReveal) {
      this.showCardState('revealed');
      this.dom.toggleRevealText.textContent = "Hide Word";
      this.dom.btnToggleReveal.querySelector('.icon').textContent = "🙈";
    } else {
      this.showCardState('hidden');
      this.dom.toggleRevealText.textContent = "Show Word";
      this.dom.btnToggleReveal.querySelector('.icon').textContent = "👁️";
    }
  }

  toggleReveal() {
    if (!this.activeWordString) return;
    this.revealWord(!this.isWordRevealed);
  }

  // --- Timer round handlers ---
  startTimer() {
    if (this.isTimerRunning) return;
    this.isTimerRunning = true;
    this.timerSeconds = 60;
    this.resetTimerUI();

    this.dom.btnStart.classList.add('hidden');
    this.dom.scoringControls.classList.remove('hidden');

    if (!this.isWordRevealed) {
      this.revealWord(true);
    }

    this.timerInterval = setInterval(() => {
      this.timerSeconds--;
      this.updateTimerUI();

      if (this.timerSeconds <= 0) {
        this.handleTimerEnd();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.isTimerRunning = false;
  }

  resetTimerUI() {
    this.timerSeconds = 60;
    this.dom.timerText.textContent = '60';
    this.dom.timerContainer.classList.remove('timer-warning');
    this.dom.timerProgress.style.strokeDashoffset = '0';
    
    if (this.teams.length > 0) {
      this.dom.timerProgress.style.stroke = this.getActiveTeam().hexColor;
    }
  }

  updateTimerUI() {
    this.dom.timerText.textContent = this.timerSeconds;
    const offset = 283 * (1 - (this.timerSeconds / 60));
    this.dom.timerProgress.style.strokeDashoffset = offset;

    if (this.timerSeconds <= 10) {
      this.dom.timerContainer.classList.add('timer-warning');
    } else {
      this.dom.timerContainer.classList.remove('timer-warning');
    }
  }

  handleTimerEnd() {
    this.stopTimer();
    this.sounds.playBuzzer();
    
    // Apply Y-axis tilt shake animation
    this.dom.wordCard.classList.add('card-skip-anim');
    setTimeout(() => {
      this.dom.wordCard.classList.remove('card-skip-anim');
      this.advanceTurn();
    }, 1000);
  }

  // --- Scoring & Consecutive Advances ---
  handleCorrect() {
    this.dom.btnCorrect.disabled = true;
    this.dom.btnSkip.disabled = true;

    this.stopTimer();
    this.sounds.playSuccess();

    const activeTeam = this.getActiveTeam();
    activeTeam.score++;

    // Apply active scorecard bump pulse animation
    const scoreCard = document.getElementById(`score-card-${activeTeam.id}`);
    if (scoreCard) {
      const scoreValEl = scoreCard.querySelector('.team-card-score');
      if (scoreValEl) {
        scoreValEl.textContent = activeTeam.score;
        scoreValEl.classList.add('score-pulse');
        setTimeout(() => scoreValEl.classList.remove('score-pulse'), 350);
      }

      const rect = scoreCard.getBoundingClientRect();
      this.spawnFloatingPoint(rect.left + rect.width / 2, rect.top + rect.height / 2, activeTeam.hexColor, activeTeam.shadowStyle);
    }

    // Trigger themed Confetti spray
    const cardRect = this.dom.wordCard.getBoundingClientRect();
    this.confetti.spawn(55, cardRect.left + cardRect.width / 2, cardRect.top + cardRect.height / 2, {
      themeColor: activeTeam.hexColor
    });

    // Apply success visual flash to card
    this.dom.wordCard.classList.add('card-success-anim');
    
    setTimeout(() => {
      this.dom.wordCard.classList.remove('card-success-anim');
      this.advanceTurn();
    }, 600);
  }

  handleSkip() {
    this.dom.btnCorrect.disabled = true;
    this.dom.btnSkip.disabled = true;

    this.stopTimer();

    // Skip animation (card tilt shake)
    this.dom.wordCard.classList.add('card-skip-anim');
    
    setTimeout(() => {
      this.dom.wordCard.classList.remove('card-skip-anim');
      this.advanceTurn();
    }, 600);
  }

  spawnFloatingPoint(x, y, color, shadow) {
    const floatEl = document.createElement('div');
    floatEl.className = 'floating-point';
    floatEl.textContent = '+1';
    floatEl.style.left = `${x}px`;
    floatEl.style.top = `${y}px`;
    floatEl.style.color = color;
    floatEl.style.textShadow = shadow;
    document.body.appendChild(floatEl);

    setTimeout(() => {
      floatEl.remove();
    }, 700);
  }

  advanceTurn() {
    // Check if the current active team still has words left in their deck.
    // If yes, they continue playing sequentially!
    const activeTeam = this.getActiveTeam();
    if (activeTeam.words.length > 0) {
      this.updateActiveTeamTurn();
      this.prepareRoundView();
      return;
    }

    // Current team has finished their words. Check if there are any words left across all teams.
    const totalRemaining = this.teams.reduce((acc, t) => acc + t.words.length, 0);
    if (totalRemaining === 0) {
      this.endGameBattle();
      return;
    }

    // Move to the next team index that still has words remaining.
    let nextIndex = (this.activeTeamIndex + 1) % this.teams.length;
    let safetyCounter = 0;
    while (this.teams[nextIndex].words.length === 0 && safetyCounter < this.teams.length) {
      nextIndex = (nextIndex + 1) % this.teams.length;
      safetyCounter++;
    }

    if (safetyCounter >= this.teams.length) {
      this.endGameBattle();
      return;
    }

    this.activeTeamIndex = nextIndex;
    
    this.updateActiveTeamTurn();
    this.prepareRoundView();
  }

  // --- End of Game Leaderboard ---
  endGameBattle() {
    this.stopTimer();

    // Smooth transition from Gameplay to Winner screen
    this.dom.scoreboardSection.classList.add('fade-out-scale');
    this.dom.wordCounterWrapper.classList.add('fade-out-scale');
    this.dom.appFooter.classList.add('fade-out-scale');

    this.transitionScreen(this.dom.gamePlaySection, this.dom.winnerSection);
    
    setTimeout(() => {
      this.dom.scoreboardSection.classList.add('hidden');
      this.dom.scoreboardSection.classList.remove('fade-out-scale');
      this.dom.wordCounterWrapper.classList.add('hidden');
      this.dom.wordCounterWrapper.classList.remove('fade-out-scale');
      this.dom.appFooter.classList.add('hidden');
      this.dom.appFooter.classList.remove('fade-out-scale');
    }, 200);

    // Merge tie-breaker scores back into original teams list
    if (this.isTieBreakerMode) {
      this.teams.forEach(tiedTeam => {
        const originalTeam = this.originalTeams.find(t => t.id === tiedTeam.id);
        if (originalTeam) {
          originalTeam.score = tiedTeam.score;
          originalTeam.words = [];
        }
      });
      this.teams = [...this.originalTeams];
      this.isTieBreakerMode = false;
    }

    const standings = [...this.teams].sort((a, b) => b.score - a.score);
    
    const topScore = standings[0].score;
    const winners = standings.filter(t => t.score === topScore);

    if (winners.length === 1) {
      this.dom.winnerAnnouncement.textContent = `🏆 ${winners[0].name.toUpperCase()} WINS!`;
      this.dom.winnerAnnouncement.style.color = winners[0].hexColor;
      this.dom.winnerAnnouncement.style.textShadow = winners[0].shadowStyle;
      this.dom.btnTiebreaker.classList.add('hidden');
    } else {
      this.dom.winnerAnnouncement.textContent = `🤝 TIE GAME!`;
      this.dom.winnerAnnouncement.style.color = '#ffffff';
      this.dom.winnerAnnouncement.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.4)';
      this.dom.btnTiebreaker.classList.remove('hidden');
    }

    let currentRank = 1;
    let previousScore = null;
    this.dom.leaderboardTable.innerHTML = '';
    standings.forEach((team, idx) => {
      const row = document.createElement('div');
      row.className = `leaderboard-row ${idx === 0 || team.score === topScore ? 'rank-1' : ''}`;
      
      if (previousScore !== null && team.score < previousScore) {
        currentRank = idx + 1;
      }
      previousScore = team.score;

      const rankAndName = document.createElement('div');
      rankAndName.className = 'leaderboard-rank-name';

      const rankBadge = document.createElement('span');
      rankBadge.className = 'rank-badge';

      if (team.score === topScore && winners.length > 1) {
        rankBadge.textContent = 'TIE';
        rankBadge.style.background = 'rgba(255, 0, 85, 0.18)';
        rankBadge.style.color = 'var(--team-color-3)';
        rankBadge.style.border = '1px solid var(--team-color-3)';
        rankBadge.style.boxShadow = 'var(--shadow-3)';
        rankBadge.style.width = '34px';
      } else {
        rankBadge.textContent = currentRank;
      }

      const nameSpan = document.createElement('span');
      nameSpan.textContent = team.name;
      nameSpan.style.color = team.hexColor;

      rankAndName.appendChild(rankBadge);
      rankAndName.appendChild(nameSpan);

      const scoreSpan = document.createElement('span');
      scoreSpan.className = 'leaderboard-score';
      scoreSpan.textContent = `${team.score} pts`;
      scoreSpan.style.color = team.hexColor;

      row.appendChild(rankAndName);
      row.appendChild(scoreSpan);
      this.dom.leaderboardTable.appendChild(row);
    });

    this.triggerWinnerCelebration();
  }

  startTieBreakerRound() {
    const topScore = Math.max(...this.teams.map(t => t.score));
    const tiedTeams = this.teams.filter(t => t.score === topScore);

    // Deep backup of all teams
    this.originalTeams = this.teams.map(t => ({
      id: t.id,
      name: t.name,
      score: t.score,
      words: [...t.words],
      hexColor: t.hexColor,
      glowClass: t.glowClass,
      shadowStyle: t.shadowStyle
    }));

    // Exclude other teams, reset active words list for tied teams
    this.teams = tiedTeams.map(t => ({
      id: t.id,
      name: t.name,
      score: t.score,
      words: [],
      hexColor: t.hexColor,
      glowClass: t.glowClass,
      shadowStyle: t.shadowStyle
    }));

    this.isTieBreakerMode = true;

    const numTiedTeams = this.teams.length;
    const wordsNeeded = numTiedTeams * 2;

    let activePool = [];
    const shuffledPriority = this.shuffle(PRIORITY_WORDS);
    const shuffledBackup = this.shuffle(BACKUP_TECH_WORDS);

    if (wordsNeeded <= shuffledPriority.length) {
      activePool = shuffledPriority.slice(0, wordsNeeded);
    } else {
      activePool = [...shuffledPriority];
      const extraCount = wordsNeeded - shuffledPriority.length;
      for (let k = 0; k < extraCount; k++) {
        activePool.push(shuffledBackup[k]);
      }
      activePool = this.shuffle(activePool);
    }

    this.teams.forEach(team => {
      team.words = [];
      for (let k = 0; k < 2; k++) {
        team.words.push(activePool.pop());
      }
    });

    this.activeTeamIndex = 0;
    this.isWordRevealed = false;
    this.isTimerRunning = false;
    this.activeWordString = "";

    this.transitionScreen(this.dom.winnerSection, this.dom.gamePlaySection, [
      this.dom.scoreboardSection,
      this.dom.appFooter,
      this.dom.wordCounterWrapper
    ]);

    this.renderDynamicScoreboard();
    this.updateActiveTeamTurn();
    this.prepareRoundView();
  }

  triggerWinnerCelebration() {
    let count = 0;
    const interval = setInterval(() => {
      const x = Math.random() * window.innerWidth;
      const y = window.innerHeight;
      
      const topScore = [...this.teams].sort((a, b) => b.score - a.score)[0].score;
      const winners = this.teams.filter(t => t.score === topScore);
      const randomWinner = winners[Math.floor(Math.random() * winners.length)];

      this.confetti.spawn(40, x, y, { 
        speedY: 18, 
        spreadX: 12,
        themeColor: randomWinner.hexColor
      });
      
      count++;
      if (count > 10 || this.dom.winnerSection.classList.contains('hidden')) {
        clearInterval(interval);
      }
    }, 450);
  }
}

// Instantiate on load
window.addEventListener('DOMContentLoaded', () => {
  new Game();
});
