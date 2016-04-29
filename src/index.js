import processBlocks from './processor'
import compiler from './compiler'

const defaults = {
  allowEmptyTags: false
}

/**
 * Exporter
 *
 * Curry the converter function with the set of (compiled) renderers and
 * configuration.
 *
 * @param  {Object} renderers A set of compatible renderers
 * @param  {Object} config Configuration
 * @return {Function} Converter function
 */
function exporter (renderers, config) {
  config = Object.assign({}, defaults, config)
  const renderer = compiler(renderers, config)

  /**
   * Converter
   *
   * Take an EditorState and convert it using our renderers
   *
   * @param  {EditorState} editorState An EditorState object from draft-js
   * @return {Array} Converted data
   */
  return function convert (editorState) {
    // Retrieve the content
    const content = editorState.getCurrentContent()
    const blocks = content.getBlocksAsArray()
    // Convert to an abstract syntax tree
    const processedBlocks = processBlocks(blocks, [])
    // Render the content
    return renderer(processedBlocks)
  }
}

export default exporter
