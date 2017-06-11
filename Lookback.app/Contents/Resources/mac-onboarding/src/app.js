const store = {
  _state: 0,
  max: Infinity,
  min: 0,
  _listeners: [],
  set listeners(fn) {
    this._listeners.push(fn);
  },
  get current() {
    return this._state;
  },
  set current(n) {
    if (n <= this.max && n >= this.min) {
      this._state = n;
      this.dispatch();
    }
  },
  dispatch() {
    this._listeners.forEach(fn => fn(this._state));
  }
};

const increment = (state) => state + 1;
const decrement = (state) => state - 1;

// Polyfill for Array.from which isn't being transpiled by babel
if (!Array.from) {
    Array.from = function (object) {
        'use strict';
        return [].slice.call(object);
    };
}

window.App = {
  run(initial, listener) {
    if (typeof initial === 'function') {
      initial();
    }

    if (typeof listener === 'function') {
      store.listeners = listener;
    }

    store.dispatch();
  },
  next() {
    store.current = increment(store.current);
    return store.current;
  },
  previous() {
    store.current = decrement(store.current);
    return store.current;
  },
  current() {
    return store.current;
  },
  navigateTo(index) {
    store.current = index;
    return store.current;
  }
};

const scroll = (steps) => `translate(-${steps * 100}vw, 0)`;
const ACTIVE_CLASS = 'in';
const NAV_CLASS = 'current';

const navigatePanes = ($container, $panes, state) => {
  $container.style.WebkitTransform = scroll(state);
  $panes[state].classList.add(ACTIVE_CLASS);
};

const renderNav = (pages) => {
  const navs = document.querySelectorAll('.nav-dots');
  Array.from(navs).forEach(nav => {
    const frag = document.createDocumentFragment();

    for(let i = 0; i < pages; i++) {
      let a = document.createElement('a');
      a.classList.add('dot');
      a.setAttribute('data-nav', i);
      frag.appendChild(a);
    }

    nav.appendChild(frag);
  });
};

const updateNav = (state) => {
  const navs = document.querySelectorAll('.nav-dots');

  const clearAll = (nav) => {
    Array.from(nav.children).forEach(a => a.classList.remove(NAV_CLASS));
    return nav;
  }

  Array.from(navs)
    .map(clearAll)
    .forEach(nav => {
      const curr = nav.children.item(state);
      curr && curr.classList.add(NAV_CLASS);
    });
};

const init = () => {
  const $container = document.querySelector('.scroller');
  const $panes = document.querySelectorAll('.pane');

  const resetAllPanes = () => {
    Array.from($panes).forEach(pane => pane.classList.remove(ACTIVE_CLASS))
  };

  window.App.run(() => {
    store.max = document.querySelectorAll('.pane').length;
    renderNav(store.max);
  }, (state) => {
    resetAllPanes();
    navigatePanes($container, $panes, state);
    updateNav(state);
  });

  const onNavigate = (evt, method) => {
    evt.preventDefault();
    window.App[method]();
  };

  const navigateTo = (evt, index) => {
    evt.preventDefault();
    window.App.navigateTo(index);
  };

  document.addEventListener('click', (evt) => {
    const method = evt.target.getAttribute('data-app');
    const navDot = evt.target.getAttribute('data-nav');

    if (method) {
      onNavigate(evt, method);
    }

    if (navDot) {
      navigateTo(evt, parseInt(navDot));
    }

  }, false);
};

document.addEventListener('DOMContentLoaded', init, false);
