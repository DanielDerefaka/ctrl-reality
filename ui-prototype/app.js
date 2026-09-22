const phone = document.querySelector('#phone');
const valid = new Set(['title','hud','result']);
const query = new URLSearchParams(location.search).get('screen');
setScreen(valid.has(query) ? query : 'title');

function setScreen(screen) {
  phone.dataset.screen = screen;
  document.querySelectorAll('[data-screen-target]').forEach((button) => button.classList.toggle('active', button.dataset.screenTarget === screen));
  const url = new URL(location.href); url.searchParams.set('screen', screen); history.replaceState({}, '', url);
}

document.addEventListener('click', (event) => {
  const target = event.target.closest('[data-screen-target],[data-action]');
  if (!target) return;
  if (target.dataset.screenTarget) setScreen(target.dataset.screenTarget);
  if (target.dataset.action === 'show-hud') setScreen('hud');
  if (target.dataset.action === 'show-title') setScreen('title');
  if (target.dataset.action === 'pulse') {
    phone.classList.remove('is-rewinding');
    requestAnimationFrame(() => { phone.classList.add('is-rewinding'); setTimeout(() => phone.classList.remove('is-rewinding'), 920); });
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === '1') setScreen('title');
  if (event.key === '2') setScreen('hud');
  if (event.key === '3') setScreen('result');
  if (event.key.toLowerCase() === 'r' && phone.dataset.screen === 'hud') document.querySelector('[data-action="pulse"]').click();
});
