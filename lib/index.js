'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _processor = require('./processor');

var _processor2 = _interopRequireDefault(_processor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Exporter
 *
 * @param  {EditorState} editorState Draft JS EditorState object
 * @return {Array} An abstract syntax tree representing the draft-js editorState
 */
function exporter(editorState) {
  // Retrieve the content
  var content = editorState.getCurrentContent();
  var blocks = content.getBlocksAsArray();
  // Convert to an abstract syntax tree
  return (0, _processor2.default)(blocks);
}

exports.default = exporter;