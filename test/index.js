import test from 'tape'
import {Map} from 'immutable'
import {
  convertFromRaw,
  convertToRaw,
  EditorState,
} from 'draft-js'
import exporter from '../src'
import content from './fixtures/content'
import contentExported from './fixtures/content-exported'
import contentExportedEntity from './fixtures/content-exported-entity'
import depth from './fixtures/depth'
import depthExported from './fixtures/depth-exported'

test('it should export data', (nest) => {
  const contentState = convertFromRaw(content)
  const editorState = EditorState.createWithContent(contentState)

  nest.test('... to an abstract syntax tree', (assert) => {
    const actual = exporter(editorState)
    const expected = contentExported
    assert.deepEqual(actual, expected, 'exported data is an array')
    assert.end()
  })

  nest.test('... with entity modifications', (assert) => {

    // Simple modifiers to make URLs protocol-less
    const options = {
      entityModifiers: {
        'LINK': (data) => {
          let copy = Object.assign({}, data)
          copy.url = copy.url.replace(/^https?:/, '')
          return copy
        },
        'image': (data) => {
          let copy = Object.assign({}, data)
          copy.src = copy.src.replace(/^https?:/, '')
          return copy
        },
      },
    }
    const actual = exporter(editorState, options)
    const expected = contentExportedEntity
    assert.deepEqual(actual, expected, 'exported entity data is modified')
    assert.end()
  })
})

test('... handling depth correctly', (assert) => {
  const contentState = convertFromRaw(depth)
  const editorState = EditorState.createWithContent(contentState)
  const actual = exporter(editorState)
  const expected = depthExported
  assert.deepEqual(actual, expected, 'exported data is an array')
  assert.end()
})

test('... handling block metadata', (assert) => {
  const contentState = convertFromRaw(depth)
  const editorState = EditorState.createWithContent(contentState)
  const actual = exporter(editorState)[0][1][3]
  const expected = depthExported[0][1][3]
  assert.deepEqual(actual, expected, 'exported metadata matches')
  assert.end()
})
