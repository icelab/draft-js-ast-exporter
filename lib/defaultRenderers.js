'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var defaultRenderers = {};

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
  'unordered-list-item': function unorderedListItem(type, lastBlockType) {
    if (type === 'unordered-list-item') {
      return '<ul>\n\n';
    } else if (lastBlockType === 'unordered-list-item') {
      return '</ul>\n\n';
    }
  },
  'ordered-list-item': function orderedListItem(type, lastBlockType) {
    if (type === 'ordered-list-item') {
      return '<ol>';
    } else if (lastBlockType === 'ordered-list-item') {
      return '</ol>\n\n';
    }
  }
};

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
  'unstyled': function unstyled(children) {
    return ['<p>', children, '</p>\n\n'];
  },
  'unordered-list-item': function unorderedListItem(children) {
    return ['<li>', children, '</li>\n\n'];
  },
  'ordered-list-item': function orderedListItem(children) {
    return ['<li>', children, '</li>\n\n'];
  }
};

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
  'default': function _default(context) {
    return context;
  },
  'bold': function bold(context) {
    var output = context.slice(0);
    output.unshift('<strong>');
    output.push('</strong>');
    return output;
  },
  'italic': function italic(context) {
    var output = context.slice(0);
    output.unshift('<em>');
    output.push('</em>');
    return output;
  }
};

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
  'default': function _default(type, mutability, data, children) {
    return children;
  }
};

exports.default = defaultRenderers;