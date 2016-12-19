'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _draftJs = require('draft-js');

var _draftJsUtils = require('draft-js-utils');

var _dataSchema = require('./dataSchema');

var _dataSchema2 = _interopRequireDefault(_dataSchema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Process the content of a ContentBlock into appropriate abstract syntax tree
 * nodes based on their type
 * @param  {ContentBlock} block
 * @param  {Object} options.entityModifier Map of functions for modifying entity
 * data as it’s exported
 * @return {Array} List of block’s child nodes
 */
function processBlockContent(block, options) {
  var entityModifiers = options.entityModifiers || {};
  var text = block.getText();

  // Cribbed from sstur’s implementation in draft-js-export-html
  // https://github.com/sstur/draft-js-export-html/blob/master/src/stateToHTML.js#L222
  var charMetaList = block.getCharacterList();
  var entityPieces = (0, _draftJsUtils.getEntityRanges)(text, charMetaList);

  // Map over the block’s entities
  var entities = entityPieces.map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2);

    var entityKey = _ref2[0];
    var stylePieces = _ref2[1];

    var entity = entityKey ? _draftJs.Entity.get(entityKey) : null;

    // Extract the inline element
    var inline = stylePieces.map(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2);

      var text = _ref4[0];
      var style = _ref4[1];

      return ['inline', [style.toJS().map(function (s) {
        return s;
      }), text]];
    });

    // Nest within an entity if there’s data
    if (entity) {
      var type = entity.getType();
      var mutability = entity.getMutability();
      var data = entity.getData();

      // Run the entity data through a modifier if one exists
      var modifier = entityModifiers[type];
      if (modifier) {
        data = modifier(data);
      }

      return [['entity', [type, entityKey, mutability, data, inline]]];
    } else {
      return inline;
    }
  });
  // Flatten the result
  return entities.reduce(function (a, b) {
    return a.concat(b);
  }, []);
}

/**
 * Convert the content from a series of draft-js blocks into an abstract
 * syntax tree
 * @param  {Array} blocks
 * @param  {Object} options
 * @return {Array} An abstract syntax tree representing a draft-js content state
 */
function processBlocks(blocks) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  // Track block context
  var context = context || [];
  var currentContext = context;
  var lastBlock = null;
  var lastProcessed = null;
  var parents = [];

  // Procedurally process individual blocks
  blocks.forEach(processBlock);

  /**
   * Process an individual block
   * @param  {ContentBlock} block An individual ContentBlock instance
   * @return {Array} A abstract syntax tree node representing a block and its
   * children
   */
  function processBlock(block) {
    var type = block.getType();
    var key = block.getKey();
    var data = block.getData ? block.getData().toJS() : {};

    var output = ['block', [type, key, processBlockContent(block, options), data]];

    // Push into context (or not) based on depth. This means either the top-level
    // context array, or the `children` of a previous block
    // This block is deeper
    if (lastBlock && block.getDepth() > lastBlock.getDepth()) {
      // Extract reference object from flat context
      // parents.push(lastProcessed) // (mutating)
      currentContext = lastProcessed[_dataSchema2.default.block.children];
    } else if (lastBlock && block.getDepth() < lastBlock.getDepth() && block.getDepth() > 0) {
      // This block is shallower (but not at the root). We want to find the last
      // block that is one level shallower than this one to append it to
      var parent = parents[block.getDepth() - 1];
      currentContext = parent[_dataSchema2.default.block.children];
    } else if (block.getDepth() === 0) {
      // Reset the parent context if we reach the top level
      parents = [];
      currentContext = context;
    }
    currentContext.push(output);
    lastProcessed = output[1];
    // Store a reference to the last block at any given depth
    parents[block.getDepth()] = lastProcessed;
    lastBlock = block;
  }

  return context;
}

exports.default = processBlocks;