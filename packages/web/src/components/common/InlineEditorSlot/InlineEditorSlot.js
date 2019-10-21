import React from 'react';
import PropTypes from 'prop-types';

import CreatePostInline from 'components/common/CreatePostInline';

export default function InlineEditorSlot({ isInlineEditorOpen, withPhoto, closeEditor }) {
  if (isInlineEditorOpen) {
    return <CreatePostInline withPhoto={withPhoto} onClose={closeEditor} />;
  }

  return null;
}

InlineEditorSlot.propTypes = {
  isInlineEditorOpen: PropTypes.bool.isRequired,
  withPhoto: PropTypes.bool.isRequired,
  closeEditor: PropTypes.func.isRequired,
};
