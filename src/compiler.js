import flatten from 'flatten'
import camelCase from './camelCase'
import dataSchema from './dataSchema'
import defaultRenderers from './defaultRenderers'

/**
 * Retrieve the renderer function for a given block type
 * @param  {Object} renderers The set of available renderers
 * @param  {String} type The block type
 * @return {Function} A render function
 */
function getRendererForBlockType(renderers, type) {
  let renderer = (renderers.block && renderers.block[type])
    ? renderers.block[type]
    : defaultRenderers.block[type]
  if (renderer) {
    return renderer
  } else {
    return (renderers.block && renderers.block['unstyled'])
      ? renderers.block['unstyled']
      : defaultRenderers.block['unstyled']
  }
}

/**
 * Retrieve the renderer function for a given entity type
 * @param  {Object} renderers The set of available renderers
 * @param  {String} type The entity type
 * @return {Function} A render function
 */
function getRendererForEntityType(renderers, type) {
  let renderer = (renderers.entity && renderers.entity[type])
    ? renderers.entity[type]
    : defaultRenderers.entity[type]
  if (renderer) {
    return renderer
  } else {
    return (renderers.entity && renderers.entity['default'])
      ? renderers.entity['default']
      : defaultRenderers.entity['default']
  }
}

/**
 * Retrieve the renderer function for a given inline type
 * @param  {Object} renderers The set of available renderers
 * @param  {String} type The inline type
 * @return {Function} A render function
 */
function getRendererForInlineType(renderers, type) {
  let renderer = (renderers.inline && renderers.inline[type])
    ? renderers.inline[type]
    : defaultRenderers.inline[type]
  if (renderer) {
    return renderer
  } else {
    return (renderers.inline && renderers.inline['default'])
      ? renderers.inline['default']
      : defaultRenderers.inline['default']
  }
}

/**
 * Retrieve the renderer function for a given wrapper type
 * @param  {Object} renderers The set of available renderers
 * @param  {String} type The wrapper type
 * @return {Function} A render function
 */
function getRendererForWrapperType(renderers, type) {
  let renderer = (renderers && renderers.wrapper && renderers.wrapper[type])
    ? renderers.wrapper[type]
    : defaultRenderers.wrapper[type]
  return renderer
}

/**
 * Compiler
 *
 * Curry a set of `renderers` into render function.
 *
 * @param  {Object} renderers A set of renderer functions for each piece of
 * content
 * @param  {Object} config General configuration
 * @return {Function} A render function that turns an AST into rendered output
 */
function compiler (renderers = {}, config = {}) {

  /**
   * Curried render function
   * @param  {Array} ast Abstract syntax tree
   * @return {Array} Array of rendered content
   */
  return function render (ast) {
    let lastBlockType = null

    /**
     * Called for each node in the abstract syntax tree (AST) that makes up the
     * state contained in the store. We identify the node by `type`
     *
     * @param  {Array} Array representing a single node from the AST
     * @param  {Boolean} first Is the first item in the AST?
     * @param  {Boolean} last Is the last item in the AST?
     *
     * @return {Array} Result of the visit/render
     */
    function visit(node, first, last) {
      const type = node[0]
      const content = node[1]
      const visitMethod = 'visit' + camelCase(type, true)
      return destinations[visitMethod](content, first, last)
    }

    /**
     * A reference object so we can call our dynamic functions in `visit`
     * @type {Object}
     */
    const destinations = {

      /**
       * Called for each node that identifies as a 'block'. Identifies the block
       * _type_ function from the `renderers`
       *
       * @param  {Array} Array representing a single block node from the AST
       * @param  {Boolean} first Is the first item in the AST?
       * @param  {Boolean} last Is the last item in the AST?
       *
       * @return {Function} Result of the relevant `renderers.block[type]`
       * function
       */
      visitBlock (node, first, last) {
        const type = node[dataSchema.block.type]
        const entity = node[dataSchema.block.entity]
        const children = node[dataSchema.block.children]

        // Render general block and its children first
        const renderer = getRendererForBlockType(renderers, type)
        const renderedChildren = children.map((child) => {
          return visit(child)
        })
        let output = renderer(renderedChildren)

        // If there are no children and we’re not allowing empty tags the
        // reset the output to nothing
        const isEmpty = (!renderedChildren || renderedChildren.length === 0 || renderedChildren.join('') === '')
        if (!config.allowEmptyTags && isEmpty) {
          output = []
        }

        // Construct look-behind-wrappers to go around the block
        // This is super-awkward
        // If the first item, check if we need an opening wrapper at the start
        let wrapperRenderer = getRendererForWrapperType(renderers, type)
        if (first && wrapperRenderer) {
          // And if it’s filled
          if (!config.allowEmptyTags && !isEmpty) {
            output.unshift(
              getRendererForWrapperType(renderers, type)(type, lastBlockType)
            )
          }
        }
        // If there’s a change in block type
        if (lastBlockType !== type) {
          // Try to insert an opening wrapper (unless it’s the first item) at
          // the start
          if (!first && wrapperRenderer) {
            // And if it’s filled
            if (!config.allowEmptyTags && !isEmpty) {
              output.unshift(
                wrapperRenderer(type, lastBlockType)
              )
            }
          }
          // Try to insert a closing wrapper (unless it’s the first item)
          // at the end
          if (!first && getRendererForWrapperType(renderers, lastBlockType)) {
            output.unshift(
              getRendererForWrapperType(renderers, lastBlockType)(type, lastBlockType)
            )
          }
        }
        // If the last item, check if we need a closing wrapper at the end
        if (last && wrapperRenderer) {
          // Only render the last wrapper if:
          // - The item has content or we allow empty tags
          // - The types match
          if ((!config.allowEmptyTags && !isEmpty) || (lastBlockType === type)) {
            output.push(
              wrapperRenderer(null, type)
            )
          }
        }
        lastBlockType = type
        return flatten(output)
      },

      /**
       * Called for each node that identifies as a 'entity'. Identifies the
       * entity _type_ function from the `renderers`
       *
       * @param  {Array} Array representing a single entity node from the AST
       * @param  {Boolean} first Is the first item in the AST?
       * @param  {Boolean} last Is the last item in the AST?
       *
       * @return {Function} Result of the relevant `renderers.entity[type]`
       * function
       */
      visitEntity (node, first, last) {
        const type = node[dataSchema.entity.type]
        const mutability = node[dataSchema.entity.mutability]
        const data = node[dataSchema.entity.data]
        const children = node[dataSchema.entity.children]
        const renderer = getRendererForEntityType(renderers, type)

        return flatten(renderer(
          type,
          mutability,
          data,
          children.map((child) => {
            return visit(child)
          })
        ))
      },

      /**
       * Called for each node that identifies as a 'inline'. Identifies the
       * entity _type_ function from the `renderers`
       *
       * @param  {Array} Array representing a single inline node from the AST
       * @param  {Boolean} first Is the first item in the AST?
       * @param  {Boolean} last Is the last item in the AST?
       *
       * @return {Function} Result of the relevant `renderers.inline[type]`
       * function
       */
      visitInline (node, first, last) {
        const styles = node[dataSchema.inline.styles]
        const text = node[dataSchema.inline.text]

        let output = [text]
        styles.forEach((style) => {
          const renderer = getRendererForInlineType(renderers, style)
          output = renderer(output)
        })

        return flatten(output)
      }
    }

    // Visit the top level blocks (and flatten the results)
    return flatten(ast.map((node, index) => {
      const last = (index === ast.length - 1)
      const first = (index === 0)
      return visit(node, first, last)
    }))
  }
}

export default compiler
