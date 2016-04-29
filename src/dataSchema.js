/**
 * A schema for mapping named keys for each type of object in the AST to their
 * relevant index. So we can know what we're talking about when we pull data
 * out of what are not-easy-for-humans data structure.
 * @type {Object}
 */
const schemaMapping = {
  block: {
    type: 0,
    entity: 1,
    children: 2,
  },
  inline: {
    styles: 0,
    text: 1,
  },
  entity: {
    type: 0,
    mutability: 1,
    data: 2,
    children: 3,
  }
}

export default schemaMapping
