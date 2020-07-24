const log = document.getElementsByClassName('logs')[0];

const prepend = (level, line) => {
  const p = document.createElement('p');
  p.textContent = line;
  p.className = level;
  log.prepend(document.createElement('br'));
  log.prepend(p);
};

const info = console.log.bind(console);
console.log = (...messages) => {
  const logMessages = messages.join(' ');
  if (logMessages.indexOf('http://www.pixijs.com/ ') <= -1) {
    prepend('log', logMessages);
    info(...messages);
  }
};

const error = console.error.bind(console);
console.error = (...messages) => {
  prepend('error', messages.join(' '));
  error(...messages);
};