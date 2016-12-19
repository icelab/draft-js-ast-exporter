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
 * @param  {Object} options Additional configuration options
 * @return {Array} An abstract syntax tree representing the draft-js editorState
 */
function exporter(editorState) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  // Retrieve the content
  var content = editorState.getCurrentContent();
  var blocks = content.getBlocksAsArray();
  // Convert to an abstract syntax tree
  return (0, _processor2.default)(blocks, options);
}

exports.default = exporter;