/* eslint-disable import/prefer-default-export */

import PropTypes from 'prop-types';

const Node = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  attributes: PropTypes.shape({}),
};

export const NodeType = PropTypes.shape(Node);

// Set content field after creating NodeType because this is recursive type.
Node.content = PropTypes.oneOfType([
  PropTypes.string,
  NodeType,
  PropTypes.arrayOf(NodeType),
]).isRequired;
