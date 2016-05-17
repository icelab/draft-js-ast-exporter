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
      return '<ul>'
    } else if (lastBlockType === 'unordered-list-item') {
      return '</ul>'
    }
  },
  'ordered-list-item': (type, lastBlockType) => {
    if (type === 'ordered-list-item') {
      return '<ol>'
    } else if (lastBlockType === 'ordered-list-item') {
      return '</ol>'
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
  'atomic': (key, children) => {
    return children
  },
  'unstyled': (key, children) => {
    return [
      `<p>`,
      children,
      '</p>',
    ]
  },
  'header-one': (key, children) => {
    return [
      '<h1>',
      children,
      '</h1>',
    ]
  },
  'header-two': (key, children) => {
    return [
      '<h2>',
      children,
      '</h2>',
    ]
  },
  'header-three': (key, children) => {
    return [
      '<h3>',
      children,
      '</h3>',
    ]
  },
  'header-four': (key, children) => {
    return [
      '<h4>',
      children,
      '</h4>',
    ]
  },
  'header-five': (key, children) => {
    return [
      '<h5>',
      children,
      '</h5>',
    ]
  },
  'header-six': (key, children) => {
    return [
      '<h6>',
      children,
      '</h6>',
    ]
  },
  'unordered-list-item': (key, children) => {
    return [
      '<li>',
      children,
      '</li>',
    ]
  },
  'ordered-list-item': (key, children) => {
    return [
      '<li>',
      children,
      '</li>',
    ]
  },
  'blockquote': (key, children) => {
    return [
      '<blockquote>',
      children,
      '</blockquote>',
    ]
  },
  'code-block': (key, children) => {
    return [
      '<pre>',
      children,
      '</prev>',
    ]
  },
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
  },
  'code': (context) => {
    const output = context.slice(0)
    output.unshift('<code>')
    output.push('</code>')
    return output
  },
  'strikethrough': (context) => {
    const output = context.slice(0)
    output.unshift('<del>')
    output.push('</del>')
    return output
  },
  'underline': (context) => {
    const output = context.slice(0)
    output.unshift('<u>')
    output.push('</u>')
    return output
  },
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
  'default': (type, key, mutability, data, children) => {
    // Spit out all the data for a non-default entity
    if (type !== 'default') {
      return [
        `<div data-entity-key="${key}">`,
          children,
        `</div>`,
      ]
    } else {
      return children
    }
  },
  'link': (type, key, mutability, data, children) => {
    return [
      `<a data-entity-key="${key}" href="${data.url}">`,
      children,
      '</a>',
    ]
  },
  'image': (type, key, mutability, data, children) => {
    return [
      `<img data-entity-key="${key}" src="${data.src}"/>`
    ]
  },
  'video': (type, key, mutability, data, children) => {
    return [
      `<video data-entity-key="${key}" src="${data.src}"/>`
    ]
  },
}

export default defaultRenderers
