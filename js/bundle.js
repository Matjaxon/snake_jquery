/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const SnakeView = __webpack_require__(1);
	
	$( () => {
	  const rootEl = $('.snakegame');
	  new SnakeView(rootEl);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Snake = __webpack_require__(2);
	const Util = __webpack_require__(3);
	const Board = __webpack_require__(4);
	const Key = __webpack_require__(5);
	
	function SnakeView($el) {
	  this.board = new Board();
	  this.$el = $el;
	  this.setupInterface();
	  this.setupBoard();
	  this.interval = setInterval(() => {
	    this.step();
	  }, 100);
	}
	
	SnakeView.prototype.step = function() {
	  if (this.board.gameOver()) {
	    alert("Game Over!");
	    this.addPlayAgain();
	    clearInterval(this.interval);
	  }
	  this.board.snake.move();
	  this.board.hitApple();
	  this.render();
	};
	
	SnakeView.prototype.render = function() {
	  this.renderSnake();
	  this.renderApple();
	  this.updateScore();
	};
	
	SnakeView.prototype.renderSnake = function() {
	  let snake = this.board.snake;
	  let snakePos = snake.segments;
	  $('.square').each((idx, sq) => {
	    const $sq = $(sq);
	    let sqPos = $sq.attr("data-pos").split(",");
	    sqPos = sqPos.map((el) => parseInt(el));
	
	    if (Util.arrayIncludes(snakePos, sqPos)) {
	      $sq.addClass('snake');
	      debugger;
	      if (Util.equals(this.board.snake.head(), sqPos)) {
	        $sq.text(this.board.snake.printEyes());
	      } else {
	        $sq.text("");
	      }
	    } else {
	      $sq.text("");
	      $sq.removeClass('snake');
	    }
	  });
	};
	
	SnakeView.prototype.renderApple = function () {
	  let apple = this.board.apple;
	  $('.square').each((idx, sq) => {
	    const $sq = $(sq);
	    let sqPos = $sq.attr("data-pos").split(",");
	    sqPos = sqPos.map((el) => parseInt(el));
	
	    if (Util.equals(apple, sqPos)) {
	      $sq.addClass('apple');
	    } else {
	      $sq.removeClass('apple');
	    }
	  });
	};
	
	SnakeView.prototype.setupInterface = function () {
	  const $scoreboard = $('<section>').addClass('scoreboard');
	  $scoreboard.text(`SCORE:   ${this.board.snake.maxLength - 1}`);
	  this.$el.append($scoreboard);
	};
	
	
	SnakeView.prototype.setupBoard = function() {
	  const $board = $('<section>').addClass('board');
	  this.$el.append($board);
	  for (let i = 0; i < 20; i++) {
	    const $row = $("<ul>").addClass('row').addClass('group');
	    for (let j = 0; j < 20; j++) {
	      const $sq = $("<li>").addClass('square').attr('data-pos',[i,j]);
	      $row.append($sq);
	    }
	    $board.append($row);
	  }
	
	  this.bindKeyHandlers();
	};
	
	SnakeView.prototype.bindKeyHandlers = function() {
	  key("up", () => this.board.snake.turn("N"));
	  key("down", () => this.board.snake.turn("S"));
	  key("left", () => this.board.snake.turn("W"));
	  key("right", () => this.board.snake.turn("E"));
	};
	
	SnakeView.prototype.updateScore = function() {
	  $('.scoreboard').text(`SCORE: ${this.board.snake.maxLength - 1}`);
	};
	
	SnakeView.prototype.resetBoard = function() {
	  this.board = new Board();
	  $('.board').remove();
	  this.setupBoard();
	  this.interval = setInterval(() => {
	    this.step();
	  }, 100);
	};
	
	SnakeView.prototype.addPlayAgain = function() {
	  const $button = $('<div>').addClass('playagain');
	  $button.text('Play again?'.trim());
	  $button.on('click', event => {
	    $button.remove();
	    this.resetBoard();
	  });
	  $('.board').append($button);
	};
	
	module.exports = SnakeView;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	
	function Snake (dir, segments) {
	  this.dir = dir;
	  this.segments = segments;
	  this.maxLength = 1;
	}
	
	Snake.prototype.printEyes = function() {
	  const eyes = {"N": "..",
	                "S": "..",
	                "W": "~:",
	                "E": ":~"};
	  return eyes[this.dir];
	};
	
	
	Snake.prototype.move = function() {
	  let headPos = this.segments[0];
	  let newPos = Util.plus(headPos, this.dir);
	  this.segments.unshift(newPos);
	  if (!(this.segments.length <= this.maxLength)) {
	    this.segments.pop();
	  }
	};
	
	Snake.prototype.head = function () {
	  return this.segments[0];
	};
	
	Snake.prototype.turn = function(newDir) {
	  if (!Util.isOpposite(newDir, this.dir)) {
	    this.dir = newDir;
	  }
	};
	
	Snake.prototype.grow = function(){
	  this.maxLength += 1;
	};
	
	module.exports = Snake;


/***/ },
/* 3 */
/***/ function(module, exports) {

	const Util = {
	
	  plus (currPos, newDir){
	    let y = currPos[0];
	    let x = currPos[1];
	
	    if (newDir === 'N') y -= 1;
	    if (newDir === 'S') y += 1;
	    if (newDir === 'W') x -= 1;
	    if (newDir === 'E') x += 1;
	
	    return [y, x];
	  },
	
	  equals(arr1, arr2){
	    if (arr1[0] === arr2[0] && arr1[1] === arr2[1]) return true;
	    return false;
	  },
	
	  isOpposite(newDir, currDir){
	    if (currDir === 'N' && newDir ==='S') return true;
	    if (currDir === 'S' && newDir ==='N') return true;
	    if (currDir === 'W' && newDir ==='E') return true;
	    if (currDir === 'E' && newDir ==='W') return true;
	    return false;
	  },
	
	  arrayIncludes(nestedArr, arr) {
	    for (let i = 0; i < nestedArr.length; i++) {
	      if (this.equals(nestedArr[i], arr)) return true;
	    }
	    return false;
	  }
	};
	
	module.exports = Util;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Snake = __webpack_require__(2);
	const Util = __webpack_require__(3);
	
	function Board() {
	  this.snake = new Snake("E", [[10, 9]]);
	  this.apple = this.makeNewApple();
	}
	
	Board.prototype.hitSelf = function(){
	  let headPos = this.snake.segments[0];
	  let bodyPos = this.snake.segments.slice(1);
	  return Util.arrayIncludes(bodyPos, headPos);
	};
	
	Board.prototype.outOfBounds = function() {
	  let headPos = this.snake.segments[0];
	  if (headPos[0] < 0 || headPos[0] >= 20) return true;
	  if (headPos[1] < 0 || headPos[1] >= 20) return true;
	  return false;
	};
	
	Board.prototype.gameOver = function () {
	  return this.hitSelf() || this.outOfBounds();
	};
	
	Board.prototype.makeNewApple = function() {
	  let x = Math.floor(Math.random() * 20);
	  let y = Math.floor(Math.random() * 20);
	  return [y, x];
	};
	
	Board.prototype.hitApple = function () {
	  if (Util.equals(this.snake.head(), this.apple)) {
	    this.snake.grow();
	    this.apple = this.makeNewApple();
	  }
	};
	
	module.exports = Board;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	//     keymaster.js
	//     (c) 2011-2013 Thomas Fuchs
	//     keymaster.js may be freely distributed under the MIT license.
	
	;(function(global){
	  var k,
	    _handlers = {},
	    _mods = { 16: false, 18: false, 17: false, 91: false },
	    _scope = 'all',
	    // modifier keys
	    _MODIFIERS = {
	      '⇧': 16, shift: 16,
	      '⌥': 18, alt: 18, option: 18,
	      '⌃': 17, ctrl: 17, control: 17,
	      '⌘': 91, command: 91
	    },
	    // special keys
	    _MAP = {
	      backspace: 8, tab: 9, clear: 12,
	      enter: 13, 'return': 13,
	      esc: 27, escape: 27, space: 32,
	      left: 37, up: 38,
	      right: 39, down: 40,
	      del: 46, 'delete': 46,
	      home: 36, end: 35,
	      pageup: 33, pagedown: 34,
	      ',': 188, '.': 190, '/': 191,
	      '`': 192, '-': 189, '=': 187,
	      ';': 186, '\'': 222,
	      '[': 219, ']': 221, '\\': 220
	    },
	    code = function(x){
	      return _MAP[x] || x.toUpperCase().charCodeAt(0);
	    },
	    _downKeys = [];
	
	  for(k=1;k<20;k++) _MAP['f'+k] = 111+k;
	
	  // IE doesn't support Array#indexOf, so have a simple replacement
	  function index(array, item){
	    var i = array.length;
	    while(i--) if(array[i]===item) return i;
	    return -1;
	  }
	
	  // for comparing mods before unassignment
	  function compareArray(a1, a2) {
	    if (a1.length != a2.length) return false;
	    for (var i = 0; i < a1.length; i++) {
	        if (a1[i] !== a2[i]) return false;
	    }
	    return true;
	  }
	
	  var modifierMap = {
	      16:'shiftKey',
	      18:'altKey',
	      17:'ctrlKey',
	      91:'metaKey'
	  };
	  function updateModifierKey(event) {
	      for(k in _mods) _mods[k] = event[modifierMap[k]];
	  };
	
	  // handle keydown event
	  function dispatch(event) {
	    var key, handler, k, i, modifiersMatch, scope;
	    key = event.keyCode;
	
	    if (index(_downKeys, key) == -1) {
	        _downKeys.push(key);
	    }
	
	    // if a modifier key, set the key.<modifierkeyname> property to true and return
	    if(key == 93 || key == 224) key = 91; // right command on webkit, command on Gecko
	    if(key in _mods) {
	      _mods[key] = true;
	      // 'assignKey' from inside this closure is exported to window.key
	      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = true;
	      return;
	    }
	    updateModifierKey(event);
	
	    // see if we need to ignore the keypress (filter() can can be overridden)
	    // by default ignore key presses if a select, textarea, or input is focused
	    if(!assignKey.filter.call(this, event)) return;
	
	    // abort if no potentially matching shortcuts found
	    if (!(key in _handlers)) return;
	
	    scope = getScope();
	
	    // for each potential shortcut
	    for (i = 0; i < _handlers[key].length; i++) {
	      handler = _handlers[key][i];
	
	      // see if it's in the current scope
	      if(handler.scope == scope || handler.scope == 'all'){
	        // check if modifiers match if any
	        modifiersMatch = handler.mods.length > 0;
	        for(k in _mods)
	          if((!_mods[k] && index(handler.mods, +k) > -1) ||
	            (_mods[k] && index(handler.mods, +k) == -1)) modifiersMatch = false;
	        // call the handler and stop the event if neccessary
	        if((handler.mods.length == 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91]) || modifiersMatch){
	          if(handler.method(event, handler)===false){
	            if(event.preventDefault) event.preventDefault();
	              else event.returnValue = false;
	            if(event.stopPropagation) event.stopPropagation();
	            if(event.cancelBubble) event.cancelBubble = true;
	          }
	        }
	      }
	    }
	  };
	
	  // unset modifier keys on keyup
	  function clearModifier(event){
	    var key = event.keyCode, k,
	        i = index(_downKeys, key);
	
	    // remove key from _downKeys
	    if (i >= 0) {
	        _downKeys.splice(i, 1);
	    }
	
	    if(key == 93 || key == 224) key = 91;
	    if(key in _mods) {
	      _mods[key] = false;
	      for(k in _MODIFIERS) if(_MODIFIERS[k] == key) assignKey[k] = false;
	    }
	  };
	
	  function resetModifiers() {
	    for(k in _mods) _mods[k] = false;
	    for(k in _MODIFIERS) assignKey[k] = false;
	  };
	
	  // parse and assign shortcut
	  function assignKey(key, scope, method){
	    var keys, mods;
	    keys = getKeys(key);
	    if (method === undefined) {
	      method = scope;
	      scope = 'all';
	    }
	
	    // for each shortcut
	    for (var i = 0; i < keys.length; i++) {
	      // set modifier keys if any
	      mods = [];
	      key = keys[i].split('+');
	      if (key.length > 1){
	        mods = getMods(key);
	        key = [key[key.length-1]];
	      }
	      // convert to keycode and...
	      key = key[0]
	      key = code(key);
	      // ...store handler
	      if (!(key in _handlers)) _handlers[key] = [];
	      _handlers[key].push({ shortcut: keys[i], scope: scope, method: method, key: keys[i], mods: mods });
	    }
	  };
	
	  // unbind all handlers for given key in current scope
	  function unbindKey(key, scope) {
	    var multipleKeys, keys,
	      mods = [],
	      i, j, obj;
	
	    multipleKeys = getKeys(key);
	
	    for (j = 0; j < multipleKeys.length; j++) {
	      keys = multipleKeys[j].split('+');
	
	      if (keys.length > 1) {
	        mods = getMods(keys);
	      }
	
	      key = keys[keys.length - 1];
	      key = code(key);
	
	      if (scope === undefined) {
	        scope = getScope();
	      }
	      if (!_handlers[key]) {
	        return;
	      }
	      for (i = 0; i < _handlers[key].length; i++) {
	        obj = _handlers[key][i];
	        // only clear handlers if correct scope and mods match
	        if (obj.scope === scope && compareArray(obj.mods, mods)) {
	          _handlers[key][i] = {};
	        }
	      }
	    }
	  };
	
	  // Returns true if the key with code 'keyCode' is currently down
	  // Converts strings into key codes.
	  function isPressed(keyCode) {
	      if (typeof(keyCode)=='string') {
	        keyCode = code(keyCode);
	      }
	      return index(_downKeys, keyCode) != -1;
	  }
	
	  function getPressedKeyCodes() {
	      return _downKeys.slice(0);
	  }
	
	  function filter(event){
	    var tagName = (event.target || event.srcElement).tagName;
	    // ignore keypressed in any elements that support keyboard data input
	    return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
	  }
	
	  // initialize key.<modifier> to false
	  for(k in _MODIFIERS) assignKey[k] = false;
	
	  // set current scope (default 'all')
	  function setScope(scope){ _scope = scope || 'all' };
	  function getScope(){ return _scope || 'all' };
	
	  // delete all handlers for a given scope
	  function deleteScope(scope){
	    var key, handlers, i;
	
	    for (key in _handlers) {
	      handlers = _handlers[key];
	      for (i = 0; i < handlers.length; ) {
	        if (handlers[i].scope === scope) handlers.splice(i, 1);
	        else i++;
	      }
	    }
	  };
	
	  // abstract key logic for assign and unassign
	  function getKeys(key) {
	    var keys;
	    key = key.replace(/\s/g, '');
	    keys = key.split(',');
	    if ((keys[keys.length - 1]) == '') {
	      keys[keys.length - 2] += ',';
	    }
	    return keys;
	  }
	
	  // abstract mods logic for assign and unassign
	  function getMods(key) {
	    var mods = key.slice(0, key.length - 1);
	    for (var mi = 0; mi < mods.length; mi++)
	    mods[mi] = _MODIFIERS[mods[mi]];
	    return mods;
	  }
	
	  // cross-browser events
	  function addEvent(object, event, method) {
	    if (object.addEventListener)
	      object.addEventListener(event, method, false);
	    else if(object.attachEvent)
	      object.attachEvent('on'+event, function(){ method(window.event) });
	  };
	
	  // set the handlers globally on document
	  addEvent(document, 'keydown', function(event) { dispatch(event) }); // Passing _scope to a callback to ensure it remains the same by execution. Fixes #48
	  addEvent(document, 'keyup', clearModifier);
	
	  // reset modifiers to false whenever the window is (re)focused.
	  addEvent(window, 'focus', resetModifiers);
	
	  // store previously defined key
	  var previousKey = global.key;
	
	  // restore previously defined key and return reference to our key object
	  function noConflict() {
	    var k = global.key;
	    global.key = previousKey;
	    return k;
	  }
	
	  // set window.key and window.key.set/get/deleteScope, and the default filter
	  global.key = assignKey;
	  global.key.setScope = setScope;
	  global.key.getScope = getScope;
	  global.key.deleteScope = deleteScope;
	  global.key.filter = filter;
	  global.key.isPressed = isPressed;
	  global.key.getPressedKeyCodes = getPressedKeyCodes;
	  global.key.noConflict = noConflict;
	  global.key.unbind = unbindKey;
	
	  if(true) module.exports = assignKey;
	
	})(this);


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map