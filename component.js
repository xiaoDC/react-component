
/*
  react-component
  fork from https://github.com/elucidata/react-coffee
 */

(function() {
  var Component, React, extractAndMerge, extractInto, extractMethods, getFnName, handleMixins, handlePropTypes, keyBlacklist, nameParser,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  React = this.React || require('react');

  nameParser = /function (.+?)\(/;

  keyBlacklist = "__super__ __superConstructor__ constructor keyBlacklist build toComponent bind".split(/\s+/);

  getFnName = function(fn) {
    return fn.name || fn.displayName || (fn.toString().match(nameParser) || [null, 'UnnamedComponent'])[1];
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

  handleMixins = extractAndMerge('mixins', function(target, value) {
    return target.concat(value);
  });

  handlePropTypes = extractAndMerge('propTypes', function(target, value) {
    var key, val;
    for (key in value) {
      val = value[key];
      target[key] = val;
    }
    return target;
  });

  extractInto = function(target, source, ignore) {
    var key, val;
    for (key in source) {
      val = source[key];
      if (__indexOf.call(keyBlacklist, key) >= 0) {
        continue;
      }
      if (__indexOf.call(ignore, key) >= 0) {
        continue;
      }
      target[key] = val;
    }
    return target;
  };

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

  Component = (function() {
    function Component() {}

    Component.keyBlacklist = keyBlacklist;

    Component.toComponent = function(componentClass, ignore) {
      if (componentClass == null) {
        componentClass = this;
      }
      if (ignore == null) {
        ignore = [];
      }
      return React.createFactory(React.createClass(extractMethods(componentClass, ignore)));
    };

    Component.build = Component.toComponent;

    return Component;

  })();

  if (React.Component) {
    React.ReactComponent = React.Component;
  }

  React.Component = Component;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Component;
  }

}).call(this);
