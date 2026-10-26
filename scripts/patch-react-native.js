const fs = require('fs');
const path = require('path');

const rnPath = path.resolve(__dirname, '..', 'node_modules', 'react-native');

if (!fs.existsSync(rnPath)) {
  console.log('react-native not found in node_modules, skipping patch.');
  process.exit(0);
}

// 1. Create error-guard-polyfill.js
const errorGuardContent = `/**
 * ErrorUtils Polyfill for React Native Mobile & Web runtimes
 */
(function(global) {
  if (global.ErrorUtils) {
    return;
  }
  var _globalHandler = null;
  var _inGuard = 0;

  var logNative = function(msg) {
    if (typeof global.nativeLoggingHook !== 'undefined') {
      try { global.nativeLoggingHook(String(msg), 3); } catch (e) {}
    }
  };

  var ErrorUtils = {
    setGlobalHandler: function(fun) {
      _globalHandler = fun;
    },
    getGlobalHandler: function() {
      return _globalHandler;
    },
    reportError: function(error) {
      logNative('ErrorUtils.reportError: ' + (error && error.stack ? error.stack : String(error)));
      if (_globalHandler) {
        _globalHandler(error, false);
      } else if (typeof console !== 'undefined' && console.error) {
        console.error('ErrorUtils.reportError:', error);
      }
    },
    reportFatalError: function(error) {
      logNative('FATAL ERROR: ' + (error && error.stack ? error.stack : String(error)));
      if (_globalHandler) {
        _globalHandler(error, true);
      } else if (typeof console !== 'undefined' && console.error) {
        console.error('FATAL ERROR:', error);
      }
    },
    applyWithGuard: function(fun, context, args) {
      try {
        _inGuard++;
        return fun.apply(context, args);
      } catch (e) {
        ErrorUtils.reportError(e);
        throw e;
      } finally {
        _inGuard--;
      }
    },
    applyWithGuardIfNeeded: function(fun, context, args) {
      if (ErrorUtils.inGuard()) {
        return fun.apply(context, args);
      } else {
        return ErrorUtils.applyWithGuard(fun, context, args);
      }
    },
    inGuard: function() {
      return _inGuard > 0;
    },
    guard: function(fun, name, context) {
      if (typeof fun !== 'function') {
        return null;
      }
      return function() {
        return ErrorUtils.applyWithGuard(
          fun,
          context || this,
          Array.prototype.slice.call(arguments),
          null,
          name
        );
      };
    }
  };

  global.ErrorUtils = ErrorUtils;
})(typeof globalThis !== 'undefined' ? globalThis : typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this);
`;

const polyfillFile = path.join(rnPath, 'error-guard-polyfill.js');
fs.writeFileSync(polyfillFile, errorGuardContent, 'utf8');

// 2. Create rn-get-polyfills.js that returns standard polyfills PLUS error-guard-polyfill.js
const rnGetPolyfillsContent = `const path = require('path');

module.exports = function getPolyfills() {
  const polyfills = [];
  try {
    polyfills.push(require.resolve('@react-native/js-polyfills/console.js'));
  } catch (e) {}
  try {
    polyfills.push(require.resolve('@react-native/js-polyfills/error-guard.js'));
  } catch (e) {}
  polyfills.push(path.resolve(__dirname, 'error-guard-polyfill.js'));
  return polyfills;
};
`;

const rnGetPolyfillsFile = path.join(rnPath, 'rn-get-polyfills.js');
fs.writeFileSync(rnGetPolyfillsFile, rnGetPolyfillsContent, 'utf8');

// 3. Ensure react-native package.json has './rn-get-polyfills' export
const rnPkgFile = path.join(rnPath, 'package.json');
if (fs.existsSync(rnPkgFile)) {
  try {
    const pkg = JSON.parse(fs.readFileSync(rnPkgFile, 'utf8'));
    if (!pkg.exports) pkg.exports = {};
    pkg.exports['./rn-get-polyfills'] = './rn-get-polyfills.js';
    pkg.exports['./error-guard-polyfill'] = './error-guard-polyfill.js';
    fs.writeFileSync(rnPkgFile, JSON.stringify(pkg, null, 2), 'utf8');
  } catch (e) {
    console.warn('Could not update react-native/package.json exports:', e.message);
  }
}

// 4. Also patch Libraries/vendor/core/ErrorUtils.js as an inline fallback
const errorUtilsJsFile = path.join(rnPath, 'Libraries', 'vendor', 'core', 'ErrorUtils.js');
if (fs.existsSync(errorUtilsJsFile)) {
  let content = fs.readFileSync(errorUtilsJsFile, 'utf8');
  if (!content.includes('error-guard-polyfill')) {
    const injection = `// Ensure ErrorUtils is always defined on global\ntry { require('../../../error-guard-polyfill'); } catch (e) {}\n\n`;
    content = injection + content;
    fs.writeFileSync(errorUtilsJsFile, content, 'utf8');
  }
}

console.log('✓ Successfully patched react-native polyfills (ErrorUtils / error-guard).');
