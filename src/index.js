import processBlocks from './processor'

/**
 * Exporter
 *
 * @param  {EditorState} editorState Draft JS EditorState object
 * @param  {Object} options Additional configuration options
 * @return {Array} An abstract syntax tree representing the draft-js editorState
 */
function exporter (editorState, options = {}) {
  // Retrieve the content
  const content = editorState.getCurrentContent()
  const blocks = content.getBlocksAsArray()
  // Convert to an abstract syntax tree
  return processBlocks(blocks, options)
}

export default exporter
