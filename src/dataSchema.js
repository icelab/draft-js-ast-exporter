/**
 * A schema for mapping named keys for each type of object in the AST to their
 * relevant index. So we can know what we're talking about when we pull data
 * out of what are not-easy-for-humans data structure.
 * @type {Object}
 */
const schemaMapping = {
  block: {
    type: 0,
    key: 1,
    children: 2,
    data: 3,
  },
  inline: {
    styles: 0,
    text: 1,
  },
  entity: {
    type: 0,
    key: 1,
    mutability: 2,
    data: 3,
    children: 4,
  },
}

export default schemaMapping
