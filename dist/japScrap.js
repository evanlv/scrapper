'use strict';

var require$$1 = require('tty');
var require$$1$1 = require('util');
var require$$0$1 = require('os');
var UserAgent = require('user-agents');
var prompts = require('@inquirer/prompts');

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function getAugmentedNamespace(n) {
  if (n.__esModule) return n;
  var f = n.default;
	if (typeof f == "function") {
		var a = function a () {
			if (this instanceof a) {
        return Reflect.construct(f, arguments, this.constructor);
			}
			return f.apply(this, arguments);
		};
		a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

var src = {exports: {}};

var browser = {exports: {}};

var ms;
var hasRequiredMs;

function requireMs () {
	if (hasRequiredMs) return ms;
	hasRequiredMs = 1;
	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var w = d * 7;
	var y = d * 365.25;
	ms = function(val, options) {
	  options = options || {};
	  var type = typeof val;
	  if (type === 'string' && val.length > 0) {
	    return parse(val);
	  } else if (type === 'number' && isFinite(val)) {
	    return options.long ? fmtLong(val) : fmtShort(val);
	  }
	  throw new Error(
	    'val is not a non-empty string or a valid number. val=' +
	      JSON.stringify(val)
	  );
	};
	function parse(str) {
	  str = String(str);
	  if (str.length > 100) {
	    return;
	  }
	  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
	    str
	  );
	  if (!match) {
	    return;
	  }
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'weeks':
	    case 'week':
	    case 'w':
	      return n * w;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	    default:
	      return undefined;
	  }
	}
	function fmtShort(ms) {
	  var msAbs = Math.abs(ms);
	  if (msAbs >= d) {
	    return Math.round(ms / d) + 'd';
	  }
	  if (msAbs >= h) {
	    return Math.round(ms / h) + 'h';
	  }
	  if (msAbs >= m) {
	    return Math.round(ms / m) + 'm';
	  }
	  if (msAbs >= s) {
	    return Math.round(ms / s) + 's';
	  }
	  return ms + 'ms';
	}
	function fmtLong(ms) {
	  var msAbs = Math.abs(ms);
	  if (msAbs >= d) {
	    return plural(ms, msAbs, d, 'day');
	  }
	  if (msAbs >= h) {
	    return plural(ms, msAbs, h, 'hour');
	  }
	  if (msAbs >= m) {
	    return plural(ms, msAbs, m, 'minute');
	  }
	  if (msAbs >= s) {
	    return plural(ms, msAbs, s, 'second');
	  }
	  return ms + ' ms';
	}
	function plural(ms, msAbs, n, name) {
	  var isPlural = msAbs >= n * 1.5;
	  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
	}
	return ms;
}

var common;
var hasRequiredCommon;

function requireCommon () {
	if (hasRequiredCommon) return common;
	hasRequiredCommon = 1;
	function setup(env) {
		createDebug.debug = createDebug;
		createDebug.default = createDebug;
		createDebug.coerce = coerce;
		createDebug.disable = disable;
		createDebug.enable = enable;
		createDebug.enabled = enabled;
		createDebug.humanize = requireMs();
		createDebug.destroy = destroy;
		Object.keys(env).forEach(key => {
			createDebug[key] = env[key];
		});
		createDebug.names = [];
		createDebug.skips = [];
		createDebug.formatters = {};
		function selectColor(namespace) {
			let hash = 0;
			for (let i = 0; i < namespace.length; i++) {
				hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
				hash |= 0;
			}
			return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
		}
		createDebug.selectColor = selectColor;
		function createDebug(namespace) {
			let prevTime;
			let enableOverride = null;
			let namespacesCache;
			let enabledCache;
			function debug(...args) {
				if (!debug.enabled) {
					return;
				}
				const self = debug;
				const curr = Number(new Date());
				const ms = curr - (prevTime || curr);
				self.diff = ms;
				self.prev = prevTime;
				self.curr = curr;
				prevTime = curr;
				args[0] = createDebug.coerce(args[0]);
				if (typeof args[0] !== 'string') {
					args.unshift('%O');
				}
				let index = 0;
				args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
					if (match === '%%') {
						return '%';
					}
					index++;
					const formatter = createDebug.formatters[format];
					if (typeof formatter === 'function') {
						const val = args[index];
						match = formatter.call(self, val);
						args.splice(index, 1);
						index--;
					}
					return match;
				});
				createDebug.formatArgs.call(self, args);
				const logFn = self.log || createDebug.log;
				logFn.apply(self, args);
			}
			debug.namespace = namespace;
			debug.useColors = createDebug.useColors();
			debug.color = createDebug.selectColor(namespace);
			debug.extend = extend;
			debug.destroy = createDebug.destroy;
			Object.defineProperty(debug, 'enabled', {
				enumerable: true,
				configurable: false,
				get: () => {
					if (enableOverride !== null) {
						return enableOverride;
					}
					if (namespacesCache !== createDebug.namespaces) {
						namespacesCache = createDebug.namespaces;
						enabledCache = createDebug.enabled(namespace);
					}
					return enabledCache;
				},
				set: v => {
					enableOverride = v;
				}
			});
			if (typeof createDebug.init === 'function') {
				createDebug.init(debug);
			}
			return debug;
		}
		function extend(namespace, delimiter) {
			const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
			newDebug.log = this.log;
			return newDebug;
		}
		function enable(namespaces) {
			createDebug.save(namespaces);
			createDebug.namespaces = namespaces;
			createDebug.names = [];
			createDebug.skips = [];
			let i;
			const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
			const len = split.length;
			for (i = 0; i < len; i++) {
				if (!split[i]) {
					continue;
				}
				namespaces = split[i].replace(/\*/g, '.*?');
				if (namespaces[0] === '-') {
					createDebug.skips.push(new RegExp('^' + namespaces.slice(1) + '$'));
				} else {
					createDebug.names.push(new RegExp('^' + namespaces + '$'));
				}
			}
		}
		function disable() {
			const namespaces = [
				...createDebug.names.map(toNamespace),
				...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
			].join(',');
			createDebug.enable('');
			return namespaces;
		}
		function enabled(name) {
			if (name[name.length - 1] === '*') {
				return true;
			}
			let i;
			let len;
			for (i = 0, len = createDebug.skips.length; i < len; i++) {
				if (createDebug.skips[i].test(name)) {
					return false;
				}
			}
			for (i = 0, len = createDebug.names.length; i < len; i++) {
				if (createDebug.names[i].test(name)) {
					return true;
				}
			}
			return false;
		}
		function toNamespace(regexp) {
			return regexp.toString()
				.substring(2, regexp.toString().length - 2)
				.replace(/\.\*\?$/, '*');
		}
		function coerce(val) {
			if (val instanceof Error) {
				return val.stack || val.message;
			}
			return val;
		}
		function destroy() {
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
		createDebug.enable(createDebug.load());
		return createDebug;
	}
	common = setup;
	return common;
}

var hasRequiredBrowser;

function requireBrowser () {
	if (hasRequiredBrowser) return browser.exports;
	hasRequiredBrowser = 1;
	(function (module, exports) {
		exports.formatArgs = formatArgs;
		exports.save = save;
		exports.load = load;
		exports.useColors = useColors;
		exports.storage = localstorage();
		exports.destroy = (() => {
			let warned = false;
			return () => {
				if (!warned) {
					warned = true;
					console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
				}
			};
		})();
		exports.colors = [
			'#0000CC',
			'#0000FF',
			'#0033CC',
			'#0033FF',
			'#0066CC',
			'#0066FF',
			'#0099CC',
			'#0099FF',
			'#00CC00',
			'#00CC33',
			'#00CC66',
			'#00CC99',
			'#00CCCC',
			'#00CCFF',
			'#3300CC',
			'#3300FF',
			'#3333CC',
			'#3333FF',
			'#3366CC',
			'#3366FF',
			'#3399CC',
			'#3399FF',
			'#33CC00',
			'#33CC33',
			'#33CC66',
			'#33CC99',
			'#33CCCC',
			'#33CCFF',
			'#6600CC',
			'#6600FF',
			'#6633CC',
			'#6633FF',
			'#66CC00',
			'#66CC33',
			'#9900CC',
			'#9900FF',
			'#9933CC',
			'#9933FF',
			'#99CC00',
			'#99CC33',
			'#CC0000',
			'#CC0033',
			'#CC0066',
			'#CC0099',
			'#CC00CC',
			'#CC00FF',
			'#CC3300',
			'#CC3333',
			'#CC3366',
			'#CC3399',
			'#CC33CC',
			'#CC33FF',
			'#CC6600',
			'#CC6633',
			'#CC9900',
			'#CC9933',
			'#CCCC00',
			'#CCCC33',
			'#FF0000',
			'#FF0033',
			'#FF0066',
			'#FF0099',
			'#FF00CC',
			'#FF00FF',
			'#FF3300',
			'#FF3333',
			'#FF3366',
			'#FF3399',
			'#FF33CC',
			'#FF33FF',
			'#FF6600',
			'#FF6633',
			'#FF9900',
			'#FF9933',
			'#FFCC00',
			'#FFCC33'
		];
		function useColors() {
			if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
				return true;
			}
			if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
				return false;
			}
			return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
				(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
				(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
				(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
		}
		function formatArgs(args) {
			args[0] = (this.useColors ? '%c' : '') +
				this.namespace +
				(this.useColors ? ' %c' : ' ') +
				args[0] +
				(this.useColors ? '%c ' : ' ') +
				'+' + module.exports.humanize(this.diff);
			if (!this.useColors) {
				return;
			}
			const c = 'color: ' + this.color;
			args.splice(1, 0, c, 'color: inherit');
			let index = 0;
			let lastC = 0;
			args[0].replace(/%[a-zA-Z%]/g, match => {
				if (match === '%%') {
					return;
				}
				index++;
				if (match === '%c') {
					lastC = index;
				}
			});
			args.splice(lastC, 0, c);
		}
		exports.log = console.debug || console.log || (() => {});
		function save(namespaces) {
			try {
				if (namespaces) {
					exports.storage.setItem('debug', namespaces);
				} else {
					exports.storage.removeItem('debug');
				}
			} catch (error) {
			}
		}
		function load() {
			let r;
			try {
				r = exports.storage.getItem('debug');
			} catch (error) {
			}
			if (!r && typeof process !== 'undefined' && 'env' in process) {
				r = process.env.DEBUG;
			}
			return r;
		}
		function localstorage() {
			try {
				return localStorage;
			} catch (error) {
			}
		}
		module.exports = requireCommon()(exports);
		const {formatters} = module.exports;
		formatters.j = function (v) {
			try {
				return JSON.stringify(v);
			} catch (error) {
				return '[UnexpectedJSONParseError]: ' + error.message;
			}
		}; 
	} (browser, browser.exports));
	return browser.exports;
}

var node = {exports: {}};

var hasFlag;
var hasRequiredHasFlag;

function requireHasFlag () {
	if (hasRequiredHasFlag) return hasFlag;
	hasRequiredHasFlag = 1;
	hasFlag = (flag, argv = process.argv) => {
		const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
		const position = argv.indexOf(prefix + flag);
		const terminatorPosition = argv.indexOf('--');
		return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
	};
	return hasFlag;
}

var supportsColor_1;
var hasRequiredSupportsColor;

function requireSupportsColor () {
	if (hasRequiredSupportsColor) return supportsColor_1;
	hasRequiredSupportsColor = 1;
	const os = require$$0$1;
	const tty = require$$1;
	const hasFlag = requireHasFlag();
	const {env} = process;
	let forceColor;
	if (hasFlag('no-color') ||
		hasFlag('no-colors') ||
		hasFlag('color=false') ||
		hasFlag('color=never')) {
		forceColor = 0;
	} else if (hasFlag('color') ||
		hasFlag('colors') ||
		hasFlag('color=true') ||
		hasFlag('color=always')) {
		forceColor = 1;
	}
	if ('FORCE_COLOR' in env) {
		if (env.FORCE_COLOR === 'true') {
			forceColor = 1;
		} else if (env.FORCE_COLOR === 'false') {
			forceColor = 0;
		} else {
			forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
		}
	}
	function translateLevel(level) {
		if (level === 0) {
			return false;
		}
		return {
			level,
			hasBasic: true,
			has256: level >= 2,
			has16m: level >= 3
		};
	}
	function supportsColor(haveStream, streamIsTTY) {
		if (forceColor === 0) {
			return 0;
		}
		if (hasFlag('color=16m') ||
			hasFlag('color=full') ||
			hasFlag('color=truecolor')) {
			return 3;
		}
		if (hasFlag('color=256')) {
			return 2;
		}
		if (haveStream && !streamIsTTY && forceColor === undefined) {
			return 0;
		}
		const min = forceColor || 0;
		if (env.TERM === 'dumb') {
			return min;
		}
		if (process.platform === 'win32') {
			const osRelease = os.release().split('.');
			if (
				Number(osRelease[0]) >= 10 &&
				Number(osRelease[2]) >= 10586
			) {
				return Number(osRelease[2]) >= 14931 ? 3 : 2;
			}
			return 1;
		}
		if ('CI' in env) {
			if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
				return 1;
			}
			return min;
		}
		if ('TEAMCITY_VERSION' in env) {
			return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
		}
		if (env.COLORTERM === 'truecolor') {
			return 3;
		}
		if ('TERM_PROGRAM' in env) {
			const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);
			switch (env.TERM_PROGRAM) {
				case 'iTerm.app':
					return version >= 3 ? 3 : 2;
				case 'Apple_Terminal':
					return 2;
			}
		}
		if (/-256(color)?$/i.test(env.TERM)) {
			return 2;
		}
		if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
			return 1;
		}
		if ('COLORTERM' in env) {
			return 1;
		}
		return min;
	}
	function getSupportLevel(stream) {
		const level = supportsColor(stream, stream && stream.isTTY);
		return translateLevel(level);
	}
	supportsColor_1 = {
		supportsColor: getSupportLevel,
		stdout: translateLevel(supportsColor(true, tty.isatty(1))),
		stderr: translateLevel(supportsColor(true, tty.isatty(2)))
	};
	return supportsColor_1;
}

var hasRequiredNode;

function requireNode () {
	if (hasRequiredNode) return node.exports;
	hasRequiredNode = 1;
	(function (module, exports) {
		const tty = require$$1;
		const util = require$$1$1;
		exports.init = init;
		exports.log = log;
		exports.formatArgs = formatArgs;
		exports.save = save;
		exports.load = load;
		exports.useColors = useColors;
		exports.destroy = util.deprecate(
			() => {},
			'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
		);
		exports.colors = [6, 2, 3, 4, 5, 1];
		try {
			const supportsColor = requireSupportsColor();
			if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
				exports.colors = [
					20,
					21,
					26,
					27,
					32,
					33,
					38,
					39,
					40,
					41,
					42,
					43,
					44,
					45,
					56,
					57,
					62,
					63,
					68,
					69,
					74,
					75,
					76,
					77,
					78,
					79,
					80,
					81,
					92,
					93,
					98,
					99,
					112,
					113,
					128,
					129,
					134,
					135,
					148,
					149,
					160,
					161,
					162,
					163,
					164,
					165,
					166,
					167,
					168,
					169,
					170,
					171,
					172,
					173,
					178,
					179,
					184,
					185,
					196,
					197,
					198,
					199,
					200,
					201,
					202,
					203,
					204,
					205,
					206,
					207,
					208,
					209,
					214,
					215,
					220,
					221
				];
			}
		} catch (error) {
		}
		exports.inspectOpts = Object.keys(process.env).filter(key => {
			return /^debug_/i.test(key);
		}).reduce((obj, key) => {
			const prop = key
				.substring(6)
				.toLowerCase()
				.replace(/_([a-z])/g, (_, k) => {
					return k.toUpperCase();
				});
			let val = process.env[key];
			if (/^(yes|on|true|enabled)$/i.test(val)) {
				val = true;
			} else if (/^(no|off|false|disabled)$/i.test(val)) {
				val = false;
			} else if (val === 'null') {
				val = null;
			} else {
				val = Number(val);
			}
			obj[prop] = val;
			return obj;
		}, {});
		function useColors() {
			return 'colors' in exports.inspectOpts ?
				Boolean(exports.inspectOpts.colors) :
				tty.isatty(process.stderr.fd);
		}
		function formatArgs(args) {
			const {namespace: name, useColors} = this;
			if (useColors) {
				const c = this.color;
				const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
				const prefix = `  ${colorCode};1m${name} \u001B[0m`;
				args[0] = prefix + args[0].split('\n').join('\n' + prefix);
				args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
			} else {
				args[0] = getDate() + name + ' ' + args[0];
			}
		}
		function getDate() {
			if (exports.inspectOpts.hideDate) {
				return '';
			}
			return new Date().toISOString() + ' ';
		}
		function log(...args) {
			return process.stderr.write(util.format(...args) + '\n');
		}
		function save(namespaces) {
			if (namespaces) {
				process.env.DEBUG = namespaces;
			} else {
				delete process.env.DEBUG;
			}
		}
		function load() {
			return process.env.DEBUG;
		}
		function init(debug) {
			debug.inspectOpts = {};
			const keys = Object.keys(exports.inspectOpts);
			for (let i = 0; i < keys.length; i++) {
				debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
			}
		}
		module.exports = requireCommon()(exports);
		const {formatters} = module.exports;
		formatters.o = function (v) {
			this.inspectOpts.colors = this.useColors;
			return util.inspect(v, this.inspectOpts)
				.split('\n')
				.map(str => str.trim())
				.join(' ');
		};
		formatters.O = function (v) {
			this.inspectOpts.colors = this.useColors;
			return util.inspect(v, this.inspectOpts);
		}; 
	} (node, node.exports));
	return node.exports;
}

if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
	src.exports = requireBrowser();
} else {
	src.exports = requireNode();
}

var srcExports = src.exports;
var debug$1 = /*@__PURE__*/getDefaultExportFromCjs(srcExports);

var isMergeableObject = function isMergeableObject(value) {
	return isNonNullObject(value)
		&& !isSpecial(value)
};
function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}
function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);
	return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
		|| isReactElement(value)
}
var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;
function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE
}
function emptyTarget(val) {
	return Array.isArray(val) ? [] : {}
}
function cloneUnlessOtherwiseSpecified(value, options) {
	return (options.clone !== false && options.isMergeableObject(value))
		? deepmerge(emptyTarget(value), value, options)
		: value
}
function defaultArrayMerge(target, source, options) {
	return target.concat(source).map(function(element) {
		return cloneUnlessOtherwiseSpecified(element, options)
	})
}
function getMergeFunction(key, options) {
	if (!options.customMerge) {
		return deepmerge
	}
	var customMerge = options.customMerge(key);
	return typeof customMerge === 'function' ? customMerge : deepmerge
}
function getEnumerableOwnPropertySymbols(target) {
	return Object.getOwnPropertySymbols
		? Object.getOwnPropertySymbols(target).filter(function(symbol) {
			return Object.propertyIsEnumerable.call(target, symbol)
		})
		: []
}
function getKeys(target) {
	return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
}
function propertyIsOnObject(object, property) {
	try {
		return property in object
	} catch(_) {
		return false
	}
}
function propertyIsUnsafe(target, key) {
	return propertyIsOnObject(target, key)
		&& !(Object.hasOwnProperty.call(target, key)
			&& Object.propertyIsEnumerable.call(target, key))
}
function mergeObject(target, source, options) {
	var destination = {};
	if (options.isMergeableObject(target)) {
		getKeys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
	}
	getKeys(source).forEach(function(key) {
		if (propertyIsUnsafe(target, key)) {
			return
		}
		if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
			destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
		} else {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
		}
	});
	return destination
}
function deepmerge(target, source, options) {
	options = options || {};
	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
	options.isMergeableObject = options.isMergeableObject || isMergeableObject;
	options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;
	var sourceIsArray = Array.isArray(source);
	var targetIsArray = Array.isArray(target);
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;
	if (!sourceAndTargetTypesMatch) {
		return cloneUnlessOtherwiseSpecified(source, options)
	} else if (sourceIsArray) {
		return options.arrayMerge(target, source, options)
	} else {
		return mergeObject(target, source, options)
	}
}
deepmerge.all = function deepmergeAll(array, options) {
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array')
	}
	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, options)
	}, {})
};
var deepmerge_1 = deepmerge;
var cjs = deepmerge_1;

var merge$1 = /*@__PURE__*/getDefaultExportFromCjs(cjs);

/*!
 * puppeteer-extra v3.3.5 by berstend
 * https://github.com/berstend/puppeteer-extra
 * @license MIT
 */
const debug = debug$1('puppeteer-extra');
class PuppeteerExtra {
    constructor(_pptr, _requireError) {
        this._pptr = _pptr;
        this._requireError = _requireError;
        this._plugins = [];
    }
    use(plugin) {
        if (typeof plugin !== 'object' || !plugin._isPuppeteerExtraPlugin) {
            console.error(`Warning: Plugin is not derived from PuppeteerExtraPlugin, ignoring.`, plugin);
            return this;
        }
        if (!plugin.name) {
            console.error(`Warning: Plugin with no name registering, ignoring.`, plugin);
            return this;
        }
        if (plugin.requirements.has('dataFromPlugins')) {
            plugin.getDataFromPlugins = this.getPluginData.bind(this);
        }
        plugin._register(Object.getPrototypeOf(plugin));
        this._plugins.push(plugin);
        debug('plugin registered', plugin.name);
        return this;
    }
    get pptr() {
        if (this._pptr) {
            return this._pptr;
        }
        console.warn(`
    Puppeteer is missing. :-)

    Note: puppeteer is a peer dependency of puppeteer-extra,
    which means you can install your own preferred version.

    - To get the latest stable version run: 'yarn add puppeteer' or 'npm i puppeteer'

    Alternatively:
    - To get puppeteer without the bundled Chromium browser install 'puppeteer-core'
    `);
        throw this._requireError || new Error('No puppeteer instance provided.');
    }
    async launch(options) {
        const defaultLaunchOptions = { args: [] };
        options = merge$1(defaultLaunchOptions, options || {});
        this.resolvePluginDependencies();
        this.orderPlugins();
        options = await this.callPluginsWithValue('beforeLaunch', options);
        const opts = {
            context: 'launch',
            options,
            defaultArgs: this.defaultArgs
        };
        this.checkPluginRequirements(opts);
        const browser = await this.pptr.launch(options);
        this._patchPageCreationMethods(browser);
        await this.callPlugins('_bindBrowserEvents', browser, opts);
        return browser;
    }
    async connect(options) {
        this.resolvePluginDependencies();
        this.orderPlugins();
        options = await this.callPluginsWithValue('beforeConnect', options);
        const opts = { context: 'connect', options };
        this.checkPluginRequirements(opts);
        const browser = await this.pptr.connect(options);
        this._patchPageCreationMethods(browser);
        await this.callPlugins('_bindBrowserEvents', browser, opts);
        return browser;
    }
    defaultArgs(options) {
        return this.pptr.defaultArgs(options);
    }
    executablePath() {
        return this.pptr.executablePath();
    }
    createBrowserFetcher(options) {
        return this.pptr.createBrowserFetcher(options);
    }
    _patchPageCreationMethods(browser) {
        if (!browser._createPageInContext) {
            debug('warning: _patchPageCreationMethods failed (no browser._createPageInContext)');
            return;
        }
        browser._createPageInContext = (function (originalMethod, context) {
            return async function () {
                const page = await originalMethod.apply(context, arguments);
                await page.goto('about:blank');
                return page;
            };
        })(browser._createPageInContext, browser);
    }
    get plugins() {
        return this._plugins;
    }
    get pluginNames() {
        return this._plugins.map(p => p.name);
    }
    getPluginData(name) {
        const data = this._plugins
            .map(p => (Array.isArray(p.data) ? p.data : [p.data]))
            .reduce((acc, arr) => [...acc, ...arr], []);
        return name ? data.filter((d) => d.name === name) : data;
    }
    getPluginsByProp(prop) {
        return this._plugins.filter(plugin => prop in plugin);
    }
    resolvePluginDependencies() {
        const missingPlugins = this._plugins
            .map(p => p._getMissingDependencies(this._plugins))
            .reduce((combined, list) => {
            return new Set([...combined, ...list]);
        }, new Set());
        if (!missingPlugins.size) {
            debug('no dependencies are missing');
            return;
        }
        debug('dependencies missing', missingPlugins);
        for (let name of [...missingPlugins]) {
            if (this.pluginNames.includes(name)) {
                debug(`ignoring dependency '${name}', which has been required already.`);
                continue;
            }
            name = name.startsWith('puppeteer-extra-plugin')
                ? name
                : `puppeteer-extra-plugin-${name}`;
            const packageName = name.split('/')[0];
            let dep = null;
            try {
                dep = require(name)();
                this.use(dep);
            }
            catch (err) {
                console.warn(`
          A plugin listed '${name}' as dependency,
          which is currently missing. Please install it:

          yarn add ${packageName}

          Note: You don't need to require the plugin yourself,
          unless you want to modify it's default settings.
          `);
                throw err;
            }
            if (dep.dependencies.size) {
                this.resolvePluginDependencies();
            }
        }
    }
    orderPlugins() {
        debug('orderPlugins:before', this.pluginNames);
        const runLast = this._plugins
            .filter(p => p.requirements.has('runLast'))
            .map(p => p.name);
        for (const name of runLast) {
            const index = this._plugins.findIndex(p => p.name === name);
            this._plugins.push(this._plugins.splice(index, 1)[0]);
        }
        debug('orderPlugins:after', this.pluginNames);
    }
    checkPluginRequirements(opts = {}) {
        for (const plugin of this._plugins) {
            for (const requirement of plugin.requirements) {
                if (opts.context === 'launch' &&
                    requirement === 'headful' &&
                    opts.options.headless) {
                    console.warn(`Warning: Plugin '${plugin.name}' is not supported in headless mode.`);
                }
                if (opts.context === 'connect' && requirement === 'launch') {
                    console.warn(`Warning: Plugin '${plugin.name}' doesn't support puppeteer.connect().`);
                }
            }
        }
    }
    async callPlugins(prop, ...values) {
        for (const plugin of this.getPluginsByProp(prop)) {
            await plugin[prop].apply(plugin, values);
        }
    }
    async callPluginsWithValue(prop, value) {
        for (const plugin of this.getPluginsByProp(prop)) {
            const newValue = await plugin[prop](value);
            if (newValue) {
                value = newValue;
            }
        }
        return value;
    }
}
const defaultExport = (() => {
    return new PuppeteerExtra(...requireVanillaPuppeteer());
})();
function requireVanillaPuppeteer() {
    try {
        return [require('puppeteer'), undefined];
    }
    catch (_) {
    }
    try {
        return [require('puppeteer-core'), undefined];
    }
    catch (err) {
        return [undefined, err];
    }
}

/*!
 * puppeteer-extra-plugin v3.2.2 by berstend
 * https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin
 * @license MIT
 */
const merge = require('merge-deep');
let PuppeteerExtraPlugin$1 = class PuppeteerExtraPlugin {
    constructor(opts) {
        this._debugBase = debug$1(`puppeteer-extra-plugin:base:${this.name}`);
        this._childClassMembers = [];
        this._opts = merge(this.defaults, opts || {});
        this._debugBase('Initialized.');
    }
    get name() {
        throw new Error('Plugin must override "name"');
    }
    get defaults() {
        return {};
    }
    get requirements() {
        return new Set([]);
    }
    get dependencies() {
        return new Set([]);
    }
    get data() {
        return [];
    }
    get opts() {
        return this._opts;
    }
    get debug() {
        return debug$1(`puppeteer-extra-plugin:${this.name}`);
    }
    async beforeLaunch(options) {
    }
    async afterLaunch(browser, opts = { options: {} }) {
    }
    async beforeConnect(options) {
    }
    async afterConnect(browser, opts = {}) {
    }
    async onBrowser(browser, opts) {
    }
    async onTargetCreated(target) {
    }
    async onPageCreated(page) {
    }
    async onTargetChanged(target) {
    }
    async onTargetDestroyed(target) {
    }
    async onDisconnected() {
    }
    async onClose() {
    }
    async onPluginRegistered() {
    }
    getDataFromPlugins(name) {
        return [];
    }
    _getMissingDependencies(plugins) {
        const pluginNames = new Set(plugins.map((p) => p.name));
        const missing = new Set(Array.from(this.dependencies.values()).filter(x => !pluginNames.has(x)));
        return missing;
    }
    async _bindBrowserEvents(browser, opts = {}) {
        if (this._hasChildClassMember('onTargetCreated') ||
            this._hasChildClassMember('onPageCreated')) {
            browser.on('targetcreated', this._onTargetCreated.bind(this));
        }
        if (this._hasChildClassMember('onTargetChanged') && this.onTargetChanged) {
            browser.on('targetchanged', this.onTargetChanged.bind(this));
        }
        if (this._hasChildClassMember('onTargetDestroyed') &&
            this.onTargetDestroyed) {
            browser.on('targetdestroyed', this.onTargetDestroyed.bind(this));
        }
        if (this._hasChildClassMember('onDisconnected') && this.onDisconnected) {
            browser.on('disconnected', this.onDisconnected.bind(this));
        }
        if (opts.context === 'launch' && this._hasChildClassMember('onClose')) {
            if (this.onClose) {
                process.on('exit', this.onClose.bind(this));
                browser.on('disconnected', this.onClose.bind(this));
                if (opts.options.handleSIGINT !== false) {
                    process.on('SIGINT', this.onClose.bind(this));
                }
                if (opts.options.handleSIGTERM !== false) {
                    process.on('SIGTERM', this.onClose.bind(this));
                }
                if (opts.options.handleSIGHUP !== false) {
                    process.on('SIGHUP', this.onClose.bind(this));
                }
            }
        }
        if (opts.context === 'launch' && this.afterLaunch) {
            await this.afterLaunch(browser, opts);
        }
        if (opts.context === 'connect' && this.afterConnect) {
            await this.afterConnect(browser, opts);
        }
        if (this.onBrowser)
            await this.onBrowser(browser, opts);
    }
    async _onTargetCreated(target) {
        if (this.onTargetCreated)
            await this.onTargetCreated(target);
        if (target.type() === 'page') {
            try {
                const page = await target.page();
                if (!page) {
                    return;
                }
                const validPage = 'isClosed' in page && !page.isClosed();
                if (this.onPageCreated && validPage) {
                    await this.onPageCreated(page);
                }
            }
            catch (err) {
                console.error(err);
            }
        }
    }
    _register(prototype) {
        this._registerChildClassMembers(prototype);
        if (this.onPluginRegistered)
            this.onPluginRegistered();
    }
    _registerChildClassMembers(prototype) {
        this._childClassMembers = Object.getOwnPropertyNames(prototype);
    }
    _hasChildClassMember(name) {
        return !!this._childClassMembers.includes(name);
    }
    get _isPuppeteerExtraPlugin() {
        return true;
    }
};

var index_esm = /*#__PURE__*/Object.freeze({
	__proto__: null,
	PuppeteerExtraPlugin: PuppeteerExtraPlugin$1
});

var require$$0 = /*@__PURE__*/getAugmentedNamespace(index_esm);

const { PuppeteerExtraPlugin } = require$$0;
class Plugin extends PuppeteerExtraPlugin {
  constructor(opts = {}) {
    super(opts);
  }
  get name() {
    return 'anonymize-ua'
  }
  get defaults() {
    return {
      stripHeadless: true,
      makeWindows: true,
      customFn: null
    }
  }
  async onPageCreated(page) {
    let ua = await page.browser().userAgent();
    if (this.opts.stripHeadless) {
      ua = ua.replace('HeadlessChrome/', 'Chrome/');
    }
    if (this.opts.makeWindows) {
      ua = ua.replace(/\(([^)]+)\)/, '(Windows NT 10.0; Win64; x64)');
    }
    if (this.opts.customFn) {
      ua = this.opts.customFn(ua);
    }
    this.debug('new ua', ua);
    await page.setUserAgent(ua);
  }
}
var puppeteerExtraPluginAnonymizeUa = function(pluginConfig) {
  return new Plugin(pluginConfig)
};

var StealthPlugin = /*@__PURE__*/getDefaultExportFromCjs(puppeteerExtraPluginAnonymizeUa);

const paginate = (array, pageSize, pageNumber) =>
  array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

const newUserAgent = new UserAgent().toString();
defaultExport.use(StealthPlugin());
const website = "https://www.japscan.lol";
const searchInputSelector = "input#searchInput";
const firstItemSelector = "div#results a.list-group-item";
const chapterSelector = "div#chapters_list div.collapse div a";
const PAGE_SIZE = 10;
const viewportWidth = 1280;
const viewportHeight = 800
;(async () => {
  console.dir("Disclaimer: This tool is only for personal use!");
  const searchQuery = await prompts.input({
    message: "Which manga are you looking for?",
  });
  const browser = await defaultExport.launch({
    headless: "new",
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const page = await browser.newPage();
  await page.setUserAgent(newUserAgent);
  await page.setViewport({
    width: viewportWidth,
    height: viewportHeight,
  });
  await page.goto(website);
  await page.type(searchInputSelector, searchQuery);
  await page.waitForSelector(searchInputSelector);
  await page.keyboard.press("Enter");
  await page.waitForSelector(firstItemSelector);
  await page.click(firstItemSelector);
  await page.waitForSelector(chapterSelector);
  const chapterURL = await page.$$eval(chapterSelector, (elements) => {
    const links = elements.filter((el) => el.href).map((el) => el.href);
    return links
  });
  console.log(`\nWelcome to ${website.split(".")[1]}\n`);
  console.log(`You are looking for ${searchQuery} scans.`);
  console.log(`Here, the last ${chapterURL.length} chapters:\n`);
  let currentPage = 1;
  let displayLinks = paginate(chapterURL, PAGE_SIZE, currentPage);
  while (displayLinks.length > 0) {
    console.log("Click on the chapter you want to read:");
    console.dir("To open a URL, press cmd + click (or double-click)");
    console.log(displayLinks);
    console.log("Enjoy~~\n");
    const inputPrompt = await prompts.input({
      message: "Enter 'n' to view the next page, or press 'q' to exit",
      default: "n",
    });
    if (inputPrompt === "n") {
      currentPage++;
      displayLinks = paginate(chapterURL, PAGE_SIZE, currentPage);
    } else if (inputPrompt === "q") {
      break
    }
  }
  await browser.close();
})();
