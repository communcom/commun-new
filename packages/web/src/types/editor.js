/* eslint-disable import/prefer-default-export */

import PropTypes from 'prop-types';

const Node = {
  id: PropTypes.number.isRequired,
  attributes: PropTypes.shape({}),
};

export const NodeType = PropTypes.shape(Node);

Node.content = PropTypes.oneOfType([
  PropTypes.string,
  NodeType,
  PropTypes.arrayOf(NodeType),
]).isRequired;
