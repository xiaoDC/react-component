# react-component

## Installation

For bower:

    bower install DC3/react-component#master -S


Define React components using natural CoffeeScript syntax.


## Example

```coffeescript
class UserChip extends React.Component
  @staticMethod: -> # becomes a static method on the React Component
    "hello"

  mixins: [React.DOM]

  render: ->
    @div null, "Hello"

module.exports= UserChip.toComponent()
```

Or:

```coffeescript
{div}= React.DOM

class UserChip extends React.Component
  @staticMethod: -> # becomes a static method on the React Component
    "hello"

  render: ->
    (div null, "Hello")

module.exports= UserChip.toComponent()
```

Alternate style:

```coffeescript
{div}= React.DOM

module.exports= React.Component.toComponent class MyComponent

  render: ->
    (div null,
      "My Component!"
    )
```

## Note

* You'll need to use the result of `.toComponent()` in React.
* When `.toComponent()` is called a new instance of the component is created.
  So you can use the constructor to fill any instance properties (specifically
  for ES6 classes). But don't do anything crazy in there. It's must ONLY be
  used for this purpose, as the constructor is discarded in the React component.


# License

The MIT License (MIT)

Copyright (c) 2014 Elucidata unLTD

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
