export function createUiController() {
  const app = document.querySelector('#app');
  const title = document.querySelector('#title-screen');
  const result = document.querySelector('#result-screen');
  const objective = document.querySelector('#objective-text');
  const seconds = document.querySelector('#clock-seconds');
  const progress = document.querySelector('#clock-progress');
  const prompt = document.querySelector('#interaction-prompt');
  const slots = [...document.querySelectorAll('.echo-slot')];
  const rewindButton = document.querySelector('#rewind-button');
  const circumference = 2 * Math.PI * 30;

  return {
    setMode(mode) {
      app.dataset.mode = mode;
      title.hidden = mode !== 'title';
      result.hidden = mode !== 'complete';
    },
    update(state, loopDuration) {
      const remaining = Math.max(0, loopDuration - state.loopTime);
      seconds.textContent = String(Math.ceil(remaining)).padStart(2, '0');
      progress.style.strokeDasharray = String(circumference);
      progress.style.strokeDashoffset = String(circumference * (state.loopTime / loopDuration));
      slots.forEach((slot, i) => slot.classList.toggle('filled', i < state.echoes.length));
      rewindButton.disabled = state.mode !== 'playing';
      prompt.hidden = !state.nearJewel || state.jewelTaken;
      if (state.jewelTaken) objective.textContent = 'Escape secured';
      else if (state.doorOpen > .75) objective.textContent = 'Cross and take Chronoglass';
      else if (state.echoes.length === 0) objective.textContent = 'Record a hand on the plate';
      else objective.textContent = 'Let your Second Hand open the gate';
    },
    setResult(state) {
      document.querySelector('#result-time').textContent = formatTime(state.elapsedBeforeComplete);
      document.querySelector('#result-rewinds').textContent = String(state.rewinds);
    },
  };
}

function formatTime(seconds) {
  const whole = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(whole / 60)).padStart(2, '0')}:${String(whole % 60).padStart(2, '0')}`;
}
