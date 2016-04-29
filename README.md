# Draft.js Exporter

WIP.

Allows for rendering the content from [Facebook’s Draft.js editor](https://facebook.github.io/draft-js/) to whatever format you like.

## Installation

```
npm install --save draft-js-exporter
```

## Usage

```js
import createExporter from 'draft-js-exporter'
const exporter = createExporter()
exporter(editorState)
```

The creation function allows you to curry it with a set of custom renderers and configuration options:

```js
import createExporter from 'draft-js-exporter'
const options = {
  allowEmptyTags: true
}
const renderers = {
   // ... renderers would be defined here.
}
const exporter = createExporter(renderers, options)
exporter(editorState)
```

## Configuration options

```js
const options = {
  allowEmptyTags: false
}
```
