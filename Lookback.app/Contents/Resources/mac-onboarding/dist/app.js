'use strict';

var store = {
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
  dispatch: function dispatch() {
    var _this = this;

    this._listeners.forEach(function (fn) {
      return fn(_this._state);
    });
  }
};

var increment = function increment(state) {
  return state + 1;
};
var decrement = function decrement(state) {
  return state - 1;
};

// Polyfill for Array.from which isn't being transpiled by babel
if (!Array.from) {
  Array.from = function (object) {
    'use strict';

    return [].slice.call(object);
  };
}

window.App = {
  run: function run(initial, listener) {
    if (typeof initial === 'function') {
      initial();
    }

    if (typeof listener === 'function') {
      store.listeners = listener;
    }

    store.dispatch();
  },
  next: function next() {
    store.current = increment(store.current);
    return store.current;
  },
  previous: function previous() {
    store.current = decrement(store.current);
    return store.current;
  },
  current: function current() {
    return store.current;
  },
  navigateTo: function navigateTo(index) {
    store.current = index;
    return store.current;
  }
};

var scroll = function scroll(steps) {
  return 'translate(-' + steps * 100 + 'vw, 0)';
};
var ACTIVE_CLASS = 'in';
var NAV_CLASS = 'current';

var navigatePanes = function navigatePanes($container, $panes, state) {
  $container.style.WebkitTransform = scroll(state);
  $panes[state].classList.add(ACTIVE_CLASS);
};

var renderNav = function renderNav(pages) {
  var navs = document.querySelectorAll('.nav-dots');
  Array.from(navs).forEach(function (nav) {
    var frag = document.createDocumentFragment();

    for (var i = 0; i < pages; i++) {
      var a = document.createElement('a');
      a.classList.add('dot');
      a.setAttribute('data-nav', i);
      frag.appendChild(a);
    }

    nav.appendChild(frag);
  });
};

var updateNav = function updateNav(state) {
  var navs = document.querySelectorAll('.nav-dots');

  var clearAll = function clearAll(nav) {
    Array.from(nav.children).forEach(function (a) {
      return a.classList.remove(NAV_CLASS);
    });
    return nav;
  };

  Array.from(navs).map(clearAll).forEach(function (nav) {
    var curr = nav.children.item(state);
    curr && curr.classList.add(NAV_CLASS);
  });
};

var init = function init() {
  var $container = document.querySelector('.scroller');
  var $panes = document.querySelectorAll('.pane');

  var resetAllPanes = function resetAllPanes() {
    Array.from($panes).forEach(function (pane) {
      return pane.classList.remove(ACTIVE_CLASS);
    });
  };

  window.App.run(function () {
    store.max = document.querySelectorAll('.pane').length;
    renderNav(store.max);
  }, function (state) {
    resetAllPanes();
    navigatePanes($container, $panes, state);
    updateNav(state);
  });

  var onNavigate = function onNavigate(evt, method) {
    evt.preventDefault();
    window.App[method]();
  };

  var navigateTo = function navigateTo(evt, index) {
    evt.preventDefault();
    window.App.navigateTo(index);
  };

  document.addEventListener('click', function (evt) {
    var method = evt.target.getAttribute('data-app');
    var navDot = evt.target.getAttribute('data-nav');

    if (method) {
      onNavigate(evt, method);
    }

    if (navDot) {
      navigateTo(evt, parseInt(navDot));
    }
  }, false);
};

document.addEventListener('DOMContentLoaded', init, false);
//# sourceMappingURL=app.js.map
