import {Entity} from 'draft-js'
import {getEntityRanges} from 'draft-js-utils'
import dataSchema from './dataSchema'

/**
 * Process the content of a ContentBlock into appropriate abstract syntax tree
 * nodes based on their type
 * @param  {ContentBlock} block
 * @return {Array} List of block’s child nodes
 */
function processBlockContent (block) {
  let blockType = block.getType()
  let text = block.getText()

  // Cribbed from sstur’s implementation in draft-js-export-html
  // https://github.com/sstur/draft-js-export-html/blob/master/src/stateToHTML.js#L222
  let charMetaList = block.getCharacterList()
  let entityPieces = getEntityRanges(text, charMetaList)

  // TODO split this up into separate functions
  // Map over the block’s entities
  return entityPieces.map(([entityKey, stylePieces]) => {
    let data = []
    let type = 'default'
    let mutability = null
    let entity = entityKey ? Entity.get(entityKey) : null
    if (entity) {
      type = entity.getType()
      mutability = entity.getMutability().toLowerCase()
      data = entity.getData()[type]
    }
    return [
      'entity',
      [
        type,
        mutability,
        data,
        // Map over the entity’s styles
        stylePieces.map(([text, style]) => {
          return [
            'inline',
            [
              style.toJS().map((s) => s.toLowerCase()),
              text
            ]
          ]
        })
      ]
    ]
  })
}


/**
 * Convert the content from a series of draft-js blocks into an abstract
 * syntax tree
 * @param  {Array} blocks
 * @param  {Array} context
 * @return {Array} An abstract syntax tree representing a draft-js content state
 */
function processBlocks(blocks, context = []) {
  // Track block context
  let currentContext = context
  let lastBlock = null
  let lastProcessed = null
  let parents = []

  // Procedurally process individual blocks
  blocks.forEach(processBlock)

  /**
   * Process an individual block
   * @param  {ContentBlock} block An individual ContentBlock instance
   * @return {Array} A abstract syntax tree node representing a block and its
   * children
   */
  function processBlock (block) {
    let entityData = []

    const type = block.getType()
    const key = block.getEntityAt(0)

    if (type === 'atomic' && key) {
      const entity = Entity.get(key)
      let entityType = entity.getType()
      entityData = [
        entityType,
        entity.getMutability().toLowerCase(),
        entity.getData(),
      ]
    }

    const output = [
      'block',
      [
        type,
        entityData,
        processBlockContent(block)
      ]
    ]

    // Push into context (or not) based on depth. This means either the top-level
    // context array, or the `children` of a previous block
    // This block is deeper
    if (lastBlock && block.getDepth() > lastBlock.getDepth()) {
      // Extract reference object from flat context
      parents.push(lastProcessed) // (mutating)
      currentContext = lastProcessed[dataSchema.block.children]
    } else if (lastBlock && block.getDepth() < lastBlock.getDepth() && parents.length > 0) {
      // This block is shallower, traverse up the set of parents
      let parent = parents.pop() // (mutating)
      currentContext = parent[dataSchema.block.children]
    }
    // If there is no parent, we’re back at the top level
    if (!currentContext) {
      currentContext = context
    }
    currentContext.push(output)
    lastProcessed = output[1]
    lastBlock = block
  }

  return context
}


export default processBlocks
