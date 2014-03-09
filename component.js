
/*
  elucidata-react-coffee v0.3.2
  https://github.com/elucidata/react-coffee


  Public: Define components as CoffeeScript classes
 
  Example:
  
    class UserChip extends Component
  
      @staticMethod: -> # becomes a static method on the React Component
        "hello"
  
      render: ->
        (@div null, "Hello")
 
     * This will create the React component based on the class definition,
     * including translating (@div XXX) calls into React.DOM.div(XXX) calls.
    module.exports= UserChip.reactify()
 */

(function() {
  var Component, React, extractInto, extractMethods, ignoredKeys, tagParser, translateTagCalls, umd,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Component = (function() {
    function Component() {}

    Component.reactify = function(componentClass) {
      if (componentClass == null) {
        componentClass = this;
      }
      return React.createClass(extractMethods(componentClass));
    };

    return Component;

  })();

  extractMethods = function(comp) {
    var methods;
    methods = extractInto({}, comp.prototype);
    methods.displayName = comp.name || comp.displayName || 'UnnamedComponent';
    methods.statics = extractInto({
      Class: comp
    }, comp);
    return methods;
  };

  extractInto = function(target, source) {
    var key, val;
    for (key in source) {
      val = source[key];
      if (__indexOf.call(ignoredKeys, key) >= 0) {
        continue;
      }
      target[key] = translateTagCalls(val);
    }
    return target;
  };

  ignoredKeys = '__super__ constructor reactify'.split(' ');

  tagParser = /this\.(\w*)\(/g;

  translateTagCalls = function(fn) {
    var compiled, source;
    if (typeof fn !== 'function') {
      return fn;
    }
    source = fn.toString();
    compiled = source.replace(tagParser, function(fragment, tag) {
      if (React.DOM[tag] != null) {
        return "React.DOM." + tag + "(";
      } else {
        return fragment;
      }
    });
    if (compiled !== source) {
      return eval("(" + compiled + ")");
    } else {
      return fn;
    }
  };

  React = this.React || require('react');

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
