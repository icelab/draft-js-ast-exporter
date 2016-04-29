'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _flatten = require('flatten');

var _flatten2 = _interopRequireDefault(_flatten);

var _camelCase = require('./camelCase');

var _camelCase2 = _interopRequireDefault(_camelCase);

var _dataSchema = require('./dataSchema');

var _dataSchema2 = _interopRequireDefault(_dataSchema);

var _defaultRenderers = require('./defaultRenderers');

var _defaultRenderers2 = _interopRequireDefault(_defaultRenderers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Retrieve the renderer function for a given block type
 * @param  {Object} renderers The set of available renderers
 * @param  {String} type The block type
 * @return {Function} A render function
 */
function getRendererForBlockType(renderers, type) {
  var renderer = renderers.block && renderers.block[type] ? renderers.block[type] : _defaultRenderers2.default.block[type];
  if (renderer) {
    return renderer;
  } else {
    return renderers.block && renderers.block['unstyled'] ? renderers.block['unstyled'] : _defaultRenderers2.default.block['unstyled'];
  }
}

/**
 * Retrieve the renderer function for a given entity type
 * @param  {Object} renderers The set of available renderers
 * @param  {String} type The entity type
 * @return {Function} A render function
 */
function getRendererForEntityType(renderers, type) {
  var renderer = renderers.entity && renderers.entity[type] ? renderers.entity[type] : _defaultRenderers2.default.entity[type];
  if (renderer) {
    return renderer;
  } else {
    return renderers.entity && renderers.entity['default'] ? renderers.entity['default'] : _defaultRenderers2.default.entity['default'];
  }
}

/**
 * Retrieve the renderer function for a given inline type
 * @param  {Object} renderers The set of available renderers
 * @param  {String} type The inline type
 * @return {Function} A render function
 */
function getRendererForInlineType(renderers, type) {
  var renderer = renderers.inline && renderers.inline[type] ? renderers.inline[type] : _defaultRenderers2.default.inline[type];
  if (renderer) {
    return renderer;
  } else {
    return renderers.inline && renderers.inline['default'] ? renderers.inline['default'] : _defaultRenderers2.default.inline['default'];
  }
}

/**
 * Retrieve the renderer function for a given wrapper type
 * @param  {Object} renderers The set of available renderers
 * @param  {String} type The wrapper type
 * @return {Function} A render function
 */
function getRendererForWrapperType(renderers, type) {
  var renderer = renderers && renderers.wrapper && renderers.wrapper[type] ? renderers.wrapper[type] : _defaultRenderers2.default.wrapper[type];
  return renderer;
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
function compiler() {
  var renderers = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];


  /**
   * Curried render function
   * @param  {Array} ast Abstract syntax tree
   * @return {Array} Array of rendered content
   */
  return function render(ast) {
    var lastBlockType = null;

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
      var type = node[0];
      var content = node[1];
      var visitMethod = 'visit' + (0, _camelCase2.default)(type, true);
      return destinations[visitMethod](content, first, last);
    }

    /**
     * A reference object so we can call our dynamic functions in `visit`
     * @type {Object}
     */
    var destinations = {

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

      visitBlock: function visitBlock(node, first, last) {
        var type = node[_dataSchema2.default.block.type];
        var entity = node[_dataSchema2.default.block.entity];
        var children = node[_dataSchema2.default.block.children];

        // Render general block and its children first
        var renderer = getRendererForBlockType(renderers, type);
        var renderedChildren = children.map(function (child) {
          return visit(child);
        });
        var output = renderer(renderedChildren);

        // If there are no children and we’re not allowing empty tags the
        // reset the output to nothing
        var isEmpty = !renderedChildren || renderedChildren.length === 0 || renderedChildren.join('') === '';
        if (!config.allowEmptyTags && isEmpty) {
          output = [];
        }

        // Construct look-behind-wrappers to go around the block
        // This is super-awkward
        // If the first item, check if we need an opening wrapper at the start
        var wrapperRenderer = getRendererForWrapperType(renderers, type);
        if (first && wrapperRenderer) {
          // And if it’s filled
          if (!config.allowEmptyTags && !isEmpty) {
            output.unshift(getRendererForWrapperType(renderers, type)(type, lastBlockType));
          }
        }
        // If there’s a change in block type
        if (lastBlockType !== type) {
          // Try to insert an opening wrapper (unless it’s the first item) at
          // the start
          if (!first && wrapperRenderer) {
            // And if it’s filled
            if (!config.allowEmptyTags && !isEmpty) {
              output.unshift(wrapperRenderer(type, lastBlockType));
            }
          }
          // Try to insert a closing wrapper (unless it’s the first item)
          // at the end
          if (!first && getRendererForWrapperType(renderers, lastBlockType)) {
            output.unshift(getRendererForWrapperType(renderers, lastBlockType)(type, lastBlockType));
          }
        }
        // If the last item, check if we need a closing wrapper at the end
        if (last && wrapperRenderer) {
          // Only render the last wrapper if:
          // - The item has content or we allow empty tags
          // - The types match
          if (!config.allowEmptyTags && !isEmpty || lastBlockType === type) {
            output.push(wrapperRenderer(null, type));
          }
        }
        lastBlockType = type;
        return (0, _flatten2.default)(output);
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
      visitEntity: function visitEntity(node, first, last) {
        var type = node[_dataSchema2.default.entity.type];
        var mutability = node[_dataSchema2.default.entity.mutability];
        var data = node[_dataSchema2.default.entity.data];
        var children = node[_dataSchema2.default.entity.children];
        var renderer = getRendererForEntityType(renderers, type);

        return (0, _flatten2.default)(renderer(type, mutability, data, children.map(function (child) {
          return visit(child);
        })));
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
      visitInline: function visitInline(node, first, last) {
        var styles = node[_dataSchema2.default.inline.styles];
        var text = node[_dataSchema2.default.inline.text];

        var output = [text];
        styles.forEach(function (style) {
          var renderer = getRendererForInlineType(renderers, style);
          output = renderer(output);
        });

        return (0, _flatten2.default)(output);
      }
    };

    // Visit the top level blocks (and flatten the results)
    return (0, _flatten2.default)(ast.map(function (node, index) {
      var last = index === ast.length - 1;
      var first = index === 0;
      return visit(node, first, last);
    }));
  };
}

exports.default = compiler;