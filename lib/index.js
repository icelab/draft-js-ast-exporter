'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _processor = require('./processor');

var _processor2 = _interopRequireDefault(_processor);

var _compiler = require('./compiler');

var _compiler2 = _interopRequireDefault(_compiler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaults = {
  allowEmptyTags: false
};

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
function exporter(renderers, config) {
  config = Object.assign({}, defaults, config);
  var renderer = (0, _compiler2.default)(renderers, config);

  /**
   * Converter
   *
   * Take an EditorState and convert it using our renderers
   *
   * @param  {EditorState} editorState An EditorState object from draft-js
   * @return {Array} Converted data
   */
  return function convert(editorState) {
    // Retrieve the content
    var content = editorState.getCurrentContent();
    var blocks = content.getBlocksAsArray();
    // Convert to an abstract syntax tree
    var processedBlocks = (0, _processor2.default)(blocks, []);
    // Render the content
    return renderer(processedBlocks);
  };
}

exports.default = exporter;