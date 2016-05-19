import processBlocks from './processor'

/**
 * Exporter
 *
 * @param  {EditorState} editorState Draft JS EditorState object
 * @return {Array} An abstract syntax tree representing the draft-js editorState
 */
function exporter (editorState) {
  // Retrieve the content
  const content = editorState.getCurrentContent()
  const blocks = content.getBlocksAsArray()
  // Convert to an abstract syntax tree
  return processBlocks(blocks)
}

export default exporter
