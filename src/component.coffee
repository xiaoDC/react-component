###
  react-component
  fork from https://github.com/elucidata/react-coffee
###

React = @React or require 'react'

# helpers
nameParser = /function (.+?)\(/
keyBlacklist = "__super__ __superConstructor__ constructor
                keyBlacklist build toComponent bind".split /\s+/

getFnName = (fn) ->
  fn.name or fn.displayName or (fn.toString().match(nameParser) or [null,'UnnamedComponent'])[1]

extractAndMerge = (prop, merge) ->
  (instance, statics) ->
    result = statics[prop]?() or statics[prop]
    if result?
      unless instance[prop]?
        instance[prop] = result
      else
        instance[prop] = merge(instance[prop], result)

handleMixins = extractAndMerge 'mixins', (target, value) ->
  target.concat value

handlePropTypes = extractAndMerge 'propTypes', (target, value) ->
  target[key] = val for key, val of value
  target

extractInto = (target, source, ignore) ->
  for key, val of source
    continue if key in keyBlacklist
    continue if key in ignore
    target[key] = val
  target

extractMethods = (comp, ignore) ->
  methods = extractInto {}, (new comp), ignore
  methods.displayName = getFnName comp
  handleMixins methods, comp
  handlePropTypes methods, comp
  methods.statics = extractInto Class:comp, comp, ignore.concat(['mixins', 'propTypes'])
  methods

class Component
  @keyBlacklist: keyBlacklist

  @toComponent: (componentClass=this, ignore=[]) ->
    React.createFactory React.createClass extractMethods componentClass, ignore

  @build: @toComponent

if React.Component
  React.ReactComponent = React.Component
React.Component = Component

module?.exports = Component
