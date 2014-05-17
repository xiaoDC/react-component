
/*
  elucidata-react-coffee
  https://github.com/elucidata/react-coffee
 */

(function() {
  var Component, React, extractAndMerge, extractInto, extractMethods, getFnName, handleMixins, handlePropTypes, nameParser, umd,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  nameParser = /function (.+?)\(/;

  React = this.React || require('react');

  Component = (function() {
    function Component() {}

    Component.keyBlacklist = '__super__ __superConstructor__ constructor keyBlacklist reactify build toComponent'.split(' ');

    Component.toComponent = function(componentClass, ignore) {
      if (componentClass == null) {
        componentClass = this;
      }
      if (ignore == null) {
        ignore = [];
      }
      return React.createClass(extractMethods(componentClass, ignore));
    };

    Component.build = Component.toComponent;

    Component.reactify = Component.toComponent;

    return Component;

  })();

  extractMethods = function(comp, ignore) {
    var methods;
    methods = extractInto({}, new comp, ignore);
    methods.displayName = getFnName(comp);
    handleMixins(methods, comp);
    handlePropTypes(methods, comp);
    methods.statics = extractInto({
      Class: comp
    }, comp, ignore.concat(['mixins', 'propTypes']));
    return methods;
  };

  extractInto = function(target, source, ignore) {
    var key, val;
    for (key in source) {
      val = source[key];
      if (__indexOf.call(Component.keyBlacklist, key) >= 0) {
        continue;
      }
      if (__indexOf.call(ignore, key) >= 0) {
        continue;
      }
      target[key] = val;
    }
    return target;
  };

  extractAndMerge = function(prop, merge) {
    return function(instance, statics) {
      var result;
      result = (typeof statics[prop] === "function" ? statics[prop]() : void 0) || statics[prop];
      if (result != null) {
        if (instance[prop] == null) {
          return instance[prop] = result;
        } else {
          return instance[prop] = merge(instance[prop], result);
        }
      }
    };
  };

  handlePropTypes = extractAndMerge('propTypes', function(target, value) {
    var key, val;
    for (key in value) {
      val = value[key];
      target[key] = val;
    }
    return target;
  });

  handleMixins = extractAndMerge('mixins', function(target, value) {
    return target.concat(value);
  });

  getFnName = function(fn) {
    return fn.name || fn.displayName || (fn.toString().match(nameParser) || [null, 'UnnamedComponent'])[1];
  };

  umd = function(factory) {
    if (typeof exports === 'object') {
      return module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
      return define([], factory);
    } else {
      return this.Component = factory();
    }
  };

  umd(function() {
    return Component;
  });

  React.Component = Component;

}).call(this);
