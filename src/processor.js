import {Entity} from 'draft-js'
import {getEntityRanges} from 'draft-js-utils'
import dataSchema from './dataSchema'

/**
 * Process the content of a ContentBlock into appropriate abstract syntax tree
 * nodes based on their type
 * @param  {ContentBlock} block
 * @param  {Object} options.entityModifier Map of functions for modifying entity
 * data as it’s exported
 * @return {Array} List of block’s child nodes
 */
function processBlockContent (block, options) {
  const entityModifiers = options.entityModifiers || {}
  let text = block.getText()

  // Cribbed from sstur’s implementation in draft-js-export-html
  // https://github.com/sstur/draft-js-export-html/blob/master/src/stateToHTML.js#L222
  let charMetaList = block.getCharacterList()
  let entityPieces = getEntityRanges(text, charMetaList)

  // Map over the block’s entities
  const entities = entityPieces.map(([entityKey, stylePieces]) => {
    let entity = entityKey ? Entity.get(entityKey) : null

    // Extract the inline element
    const inline = stylePieces.map(([text, style]) => {
      return [
        'inline',
        [
          style.toJS().map((s) => s),
          text,
        ],
      ]
    })

    // Nest within an entity if there’s data
    if (entity) {
      const type = entity.getType()
      const mutability = entity.getMutability()
      let data = entity.getData()

      // Run the entity data through a modifier if one exists
      const modifier = entityModifiers[type]
      if (modifier) {
        data = modifier(data)
      }

      return [
        [
          'entity',
          [
            type,
            entityKey,
            mutability,
            data,
            inline,
          ],
        ],
      ]
    } else {
      return inline
    }
  })
  // Flatten the result
  return entities.reduce((a, b) => {
    return a.concat(b)
  }, [])
}

/**
 * Convert the content from a series of draft-js blocks into an abstract
 * syntax tree
 * @param  {Array} blocks
 * @param  {Object} options
 * @return {Array} An abstract syntax tree representing a draft-js content state
 */
function processBlocks (blocks, options = {}) {
  // Track block context
  let context = context || []
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
    const type = block.getType()
    const key = block.getKey()
    const data = block.getData().toJS()

    const output = [
      'block',
      [
        type,
        key,
        processBlockContent(block, options),
        data,
      ],
    ]

    // Push into context (or not) based on depth. This means either the top-level
    // context array, or the `children` of a previous block
    // This block is deeper
    if (lastBlock && block.getDepth() > lastBlock.getDepth()) {
      // Extract reference object from flat context
      // parents.push(lastProcessed) // (mutating)
      currentContext = lastProcessed[dataSchema.block.children]
    } else if (lastBlock && block.getDepth() < lastBlock.getDepth() && block.getDepth() > 0) {
      // This block is shallower (but not at the root). We want to find the last
      // block that is one level shallower than this one to append it to
      let parent = parents[block.getDepth() - 1]
      currentContext = parent[dataSchema.block.children]
    } else if (block.getDepth() === 0) {
      // Reset the parent context if we reach the top level
      parents = []
      currentContext = context
    }
    currentContext.push(output)
    lastProcessed = output[1]
    // Store a reference to the last block at any given depth
    parents[block.getDepth()] = lastProcessed
    lastBlock = block
  }

  return context
}

export default processBlocks
