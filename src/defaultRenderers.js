const defaultRenderers = {}

/**
 * Renderer for each wrapper type
 *
 * Each type should return a function under a matching `key`. Wrapper render
 * functions get passed:
 *
 * - The `type` for the current block
 * - The `lastBlockType`, i.e., the type for the previous block
 *
 * @type {Object}
 */
defaultRenderers.wrapper = {
  'unordered-list-item': (type, lastBlockType) => {
    if (type === 'unordered-list-item') {
      return '<ul>\n\n'
    } else if (lastBlockType === 'unordered-list-item') {
      return '</ul>\n\n'
    }
  },
  'ordered-list-item': (type, lastBlockType) => {
    if (type === 'ordered-list-item') {
      return '<ol>'
    } else if (lastBlockType === 'ordered-list-item') {
      return '</ol>\n\n'
    }
  }
}

/**
 * Renderer for each block type
 *
 * Each type should return a function under a matching `key`. Block render
 * functions get passed:
 *
 * - The `children` for the current block
 *
 * @type {Object}
 */
defaultRenderers.block = {
  'unstyled': (children) => {
    return [
      '<p>',
      children,
      '</p>\n\n',
    ]
  },
  'unordered-list-item': (children) => {
    return [
      '<li>',
      children,
      '</li>\n\n',
    ]
  },
  'ordered-list-item': (children) => {
    return [
      '<li>',
      children,
      '</li>\n\n',
    ]
  }
}

/**
 * Renderer for each inline type
 *
 * Each type should return a function under a matching `key`. Inline render
 * functions get passed:
 *
 * - The `context` for the inline element. I.e., the current render state for
 *   the inline element
 *
 * @type {Object}
 */
defaultRenderers.inline = {
  'default': (context) => {
    return context
  },
  'bold': (context) => {
    const output = context.slice(0)
    output.unshift('<strong>')
    output.push('</strong>')
    return output
  },
  'italic': (context) => {
    const output = context.slice(0)
    output.unshift('<em>')
    output.push('</em>')
    return output
  }
}

/**
 * Renderer for each entity type
 *
 * Each type should return a function under a matching `key`. Entity render
 * functions get passed:
 *
 * - The `type` of entity
 * - Its `mutability` value
 * - Any `data` associated with the entity
 * - The `children` of the entity
 *
 * @type {Object}
 */
defaultRenderers.entity = {
  'default': (type, mutability, data, children) => {
    return children
  },
}

export default defaultRenderers
