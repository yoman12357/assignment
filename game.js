(() => {
  // Grab elements
  const minEl = document.getElementById('min'), maxEl = document.getElementById('max');
  const setBtn = document.getElementById('set-range'), resetBtn = document.getElementById('reset');
  const statusEl = document.getElementById('status'), attemptsEl = document.getElementById('attempts');
  const historyEl = document.getElementById('history'), form = document.getElementById('guess-form');
  const input = document.getElementById('guess-input');

  // Game state
  let min = 1, max = 100, secret = 0, attempts = 0, history = [], finished = false;

  // Helpers
  const rand = (a,b) => Math.floor(Math.random()* (Math.max(a,b)-Math.min(a,b)+1)) + Math.min(a,b);
  const setStatus = (t, cls='neutral') => {
    statusEl.textContent = t;
    statusEl.className = 'status ' + (cls === 'neutral' ? '' : `hint ${cls}`);
  };
  const refresh = (first=false) => {
    attemptsEl.textContent = attempts;
    historyEl.textContent = history.length ? history.join(', ') : '—';
    if (first) setStatus(`Pick a number between ${min} and ${max}.`, 'warn');
  };
  const start = () => {
    finished = false; attempts = 0; history = [];
    min = Number(minEl.value) || 1; max = Number(maxEl.value) || 100;
    if (min === max) max = min + 1;
    if (min > max) [min, max] = [max, min];
    minEl.value = min; maxEl.value = max;
    secret = rand(min, max);
    input.value = ''; input.disabled = false;
    setStatus(`New game: guess between ${min} and ${max}.`, 'warn');
    refresh(); input.focus();
  };

  // Events
  setBtn.addEventListener('click', start);
  resetBtn.addEventListener('click', start);
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (finished) return;
    const raw = input.value.trim();
    if (!raw) return setStatus('Please enter a number.', 'bad');
    const guess = Number(raw);
    if (!Number.isFinite(guess)) return setStatus('Invalid number.', 'bad');
    if (guess < min || guess > max) return setStatus(`Out of range. Use ${min}–${max}.`, 'bad');

    attempts++; history.push(guess); refresh();
    if (guess === secret) {
      setStatus(`Correct! The number was ${secret}.`, 'ok');
      finished = true; input.disabled = true; input.blur(); return;
    }
    setStatus(guess > secret ? 'Too High.' : 'Too Low.', 'warn');
    input.select(); input.focus();
  });

  // First load
  refresh(true); start();
})();
